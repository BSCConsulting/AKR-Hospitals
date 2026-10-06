/*
# Create opd_sessions table for live OPD queue tracking

1. New Tables
- `opd_sessions`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `session_date` (date, not null) — the calendar day this OPD session belongs to
  - `current_token_served` (integer, not null, default 14) — the token number currently being served at the reception desk
  - `is_paused` (boolean, not null, default false) — whether the OPD queue is temporarily paused (lunch break, system issue, etc.)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now()) — updated whenever current_token_served or is_paused changes

2. Security
- Enable RLS on `opd_sessions`.
- Public visitors may SELECT the live queue status.
- INSERT / UPDATE / DELETE are not granted to anon/authenticated — staff updates must use
  the service role (dashboard, Edge Function, or trusted backend).

3. Realtime
- The table is subscribed to from the frontend for UPDATE events so the Live Token drawer
  reflects the current serving token in real time.

4. Seed Data
- Inserts one row for today's date with current_token_served = 14 and is_paused = false.

5. Indexes
- Unique index on `session_date` so only one active session per day can exist.
*/

CREATE TABLE IF NOT EXISTS opd_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date date NOT NULL,
  current_token_served integer NOT NULL DEFAULT 14,
  is_paused boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS opd_sessions_session_date_unique
  ON opd_sessions (session_date);

ALTER TABLE opd_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_opd_sessions" ON opd_sessions;
CREATE POLICY "anon_select_opd_sessions"
  ON opd_sessions FOR SELECT
  TO anon, authenticated USING (true);

-- Remove overly permissive write policies if a previous revision applied them
DROP POLICY IF EXISTS "anon_insert_opd_sessions" ON opd_sessions;
DROP POLICY IF EXISTS "anon_update_opd_sessions" ON opd_sessions;
DROP POLICY IF EXISTS "anon_delete_opd_sessions" ON opd_sessions;

-- Seed today's session (idempotent via ON CONFLICT)
INSERT INTO opd_sessions (session_date, current_token_served, is_paused)
VALUES (CURRENT_DATE, 14, false)
ON CONFLICT (session_date) DO NOTHING;

-- Enable realtime publication for this table
ALTER PUBLICATION supabase_realtime ADD TABLE opd_sessions;
