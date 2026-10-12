import { useState, useEffect } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { toLocalDateString } from '@/lib/dates';

interface OpdSession {
  id: string;
  session_date: string;
  current_token_served: number;
  is_paused: boolean;
}

interface UseOpdQueueResult {
  /** True only when reception has published today's queue; never show token numbers otherwise. */
  isLive: boolean;
  currentTokenServed: number;
  isPaused: boolean;
  isLoading: boolean;
}

export function useOpdQueue(): UseOpdQueueResult {
  const [session, setSession] = useState<OpdSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);

  useEffect(() => {
    const pending = getSupabase();
    if (!pending) return;

    let cancelled = false;
    let unsubscribe = () => {};
    const today = toLocalDateString();
    const done = () => !cancelled && setIsLoading(false);

    pending
      .then((client) => {
        if (cancelled) return;
        client
          .from('opd_sessions')
          .select('id, session_date, current_token_served, is_paused')
          .eq('session_date', today)
          .maybeSingle()
          .then(({ data, error }) => {
            if (cancelled) return;
            setSession(error ? null : (data as OpdSession | null));
            done();
          }, done);

        const channel = client
          .channel(`opd-sessions-${crypto.randomUUID()}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'opd_sessions' },
            (payload) => {
              if (payload.eventType === 'DELETE') {
                // DELETE payloads carry only the primary key.
                const deletedId = (payload.old as Partial<OpdSession>).id;
                setSession((s) => (s?.id === deletedId ? null : s));
                return;
              }
              const updated = payload.new as OpdSession;
              if (updated.session_date === today) setSession(updated);
            }
          )
          .subscribe();
        unsubscribe = () => void client.removeChannel(channel);
      })
      .catch(done);

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return {
    isLive: session !== null,
    currentTokenServed: session?.current_token_served ?? 0,
    isPaused: session?.is_paused ?? false,
    isLoading,
  };
}
