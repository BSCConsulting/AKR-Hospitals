import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const looksConfigured = (value: string | undefined) =>
  Boolean(
    value &&
      value.trim() &&
      !value.includes('your_project') &&
      !value.includes('your_anon')
  );

export const isSupabaseConfigured =
  looksConfigured(supabaseUrl) && looksConfigured(supabaseAnonKey);

let clientPromise: Promise<SupabaseClient> | null = null;

/** Null when env vars are missing; the SDK is code-split so unconfigured sites never download it. */
export function getSupabase(): Promise<SupabaseClient> | null {
  if (!isSupabaseConfigured) return null;
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(supabaseUrl!, supabaseAnonKey!, { auth: { persistSession: false } })
  );
  return clientPromise;
}

export interface AppointmentRequestRow {
  patient_name: string;
  mobile: string;
  department: string;
  doctor_name: string | null;
  preferred_date: string;
  preferred_slot: string;
  reason: string;
  reference: string;
}

/** Insert-only (RLS); resolves false when offline/unconfigured so the UI can offer WhatsApp/call. */
export async function submitAppointmentRequest(row: AppointmentRequestRow): Promise<boolean> {
  const pending = getSupabase();
  if (!pending) return false;
  try {
    const { error } = await (await pending).from('appointment_requests').insert(row);
    return !error;
  } catch {
    return false;
  }
}
