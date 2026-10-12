/*
# Appointment requests from the website

Patients submit a request (not a confirmed slot); reception reviews new rows in the
Supabase dashboard and calls the patient back to confirm.

Security
- RLS on. anon may INSERT only — no SELECT/UPDATE/DELETE, so submitted data can't be read back
  from the browser. Staff use the dashboard (service role).
- A BEFORE INSERT trigger forces server-side values (created_at, status) and rate-limits.

ponytail: rate limits are per-mobile (5 / 24 h) plus a global cap (200 / h). A bot rotating fake
mobiles can still fill the global cap; upgrade path is an Edge Function with Cloudflare
Turnstile / hCaptcha in front of the insert.
*/

CREATE TABLE IF NOT EXISTS appointment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  patient_name text NOT NULL CHECK (char_length(patient_name) BETWEEN 2 AND 80),
  mobile text NOT NULL CHECK (mobile ~ '^[6-9][0-9]{9}$'),
  department text NOT NULL CHECK (char_length(department) BETWEEN 1 AND 60),
  doctor_name text CHECK (char_length(doctor_name) <= 80),
  preferred_date date NOT NULL,
  preferred_slot text NOT NULL CHECK (preferred_slot ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  reason text NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 60),
  reference text NOT NULL UNIQUE CHECK (reference ~ '^AKR-[A-Z0-9]{6}$'),
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'confirmed', 'cancelled', 'no_answer'))
);

CREATE INDEX IF NOT EXISTS appointment_requests_mobile_created_idx
  ON appointment_requests (mobile, created_at DESC);
CREATE INDEX IF NOT EXISTS appointment_requests_created_idx
  ON appointment_requests (created_at DESC);

ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

-- Explicit grants: newer Supabase projects don't auto-grant table access to anon.
GRANT INSERT ON appointment_requests TO anon;
GRANT SELECT ON opd_sessions TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_appointment_requests" ON appointment_requests;
CREATE POLICY "anon_insert_appointment_requests"
  ON appointment_requests FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION appointment_requests_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today_ist date := (now() AT TIME ZONE 'Asia/Kolkata')::date;
BEGIN
  NEW.created_at := now();
  NEW.status := 'new';
  NEW.patient_name := btrim(NEW.patient_name);

  IF NEW.preferred_date < today_ist - 1 OR NEW.preferred_date > today_ist + 30 THEN
    RAISE EXCEPTION 'preferred_date out of range';
  END IF;

  IF (SELECT count(*) FROM appointment_requests
      WHERE mobile = NEW.mobile AND created_at > now() - interval '24 hours') >= 5 THEN
    RAISE EXCEPTION 'too many requests for this mobile';
  END IF;

  IF (SELECT count(*) FROM appointment_requests
      WHERE created_at > now() - interval '1 hour') >= 200 THEN
    RAISE EXCEPTION 'too many requests';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION appointment_requests_guard() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS appointment_requests_guard ON appointment_requests;
CREATE TRIGGER appointment_requests_guard
  BEFORE INSERT ON appointment_requests
  FOR EACH ROW EXECUTE FUNCTION appointment_requests_guard();
