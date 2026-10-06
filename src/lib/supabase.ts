import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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

/** Null when env vars are missing so the marketing site still loads offline/demo. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
      },
    })
  : null;
