import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toLocalDateString } from '@/lib/dates';

interface OpdSession {
  id: string;
  session_date: string;
  current_token_served: number;
  is_paused: boolean;
}

interface UseOpdQueueResult {
  currentTokenServed: number;
  isPaused: boolean;
  isLoading: boolean;
}

const FALLBACK_TOKEN = 14;
const FALLBACK_PAUSED = false;

export function useOpdQueue(): UseOpdQueueResult {
  const [currentTokenServed, setCurrentTokenServed] = useState<number>(FALLBACK_TOKEN);
  const [isPaused, setIsPaused] = useState<boolean>(FALLBACK_PAUSED);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const channelRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseConfigured || !supabase) {
      setCurrentTokenServed(FALLBACK_TOKEN);
      setIsPaused(FALLBACK_PAUSED);
      setIsLoading(false);
      return;
    }

    const client = supabase;
    const today = toLocalDateString();

    const fetchInitial = async () => {
      try {
        const { data, error } = await client
          .from('opd_sessions')
          .select('id, session_date, current_token_served, is_paused')
          .eq('session_date', today)
          .maybeSingle();

        if (cancelled) return;

        if (error || !data) {
          setCurrentTokenServed(FALLBACK_TOKEN);
          setIsPaused(FALLBACK_PAUSED);
        } else {
          const session = data as OpdSession;
          setCurrentTokenServed(session.current_token_served);
          setIsPaused(session.is_paused);
        }
      } catch {
        if (cancelled) return;
        setCurrentTokenServed(FALLBACK_TOKEN);
        setIsPaused(FALLBACK_PAUSED);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchInitial();

    const channel = client
      .channel('opd-sessions-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'opd_sessions' },
        (payload) => {
          const updated = payload.new as OpdSession;
          if (updated.session_date !== today) return;
          setCurrentTokenServed(updated.current_token_served);
          setIsPaused(updated.is_paused);
        }
      )
      .subscribe();

    channelRef.current = {
      unsubscribe: () => {
        client.removeChannel(channel);
      },
    };

    return () => {
      cancelled = true;
      channelRef.current?.unsubscribe();
      channelRef.current = null;
    };
  }, []);

  return { currentTokenServed, isPaused, isLoading };
}
