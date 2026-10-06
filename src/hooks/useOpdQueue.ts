import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

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
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInitial = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('opd_sessions')
          .select('id, session_date, current_token_served, is_paused')
          .eq('session_date', today)
          .maybeSingle();

        if (cancelled) return;

        if (error || !data) {
          // Fallback to mock state — Supabase unreachable or no row for today
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

    // Subscribe to realtime UPDATE events on opd_sessions
    const channel = supabase
      .channel('opd-sessions-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'opd_sessions' },
        (payload) => {
          const updated = payload.new as OpdSession;
          setCurrentTokenServed(updated.current_token_served);
          setIsPaused(updated.is_paused);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return { currentTokenServed, isPaused, isLoading };
}
