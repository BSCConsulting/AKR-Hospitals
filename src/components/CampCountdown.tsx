import { useEffect, useState } from 'react';
import { campPhase } from '@/lib/dates';

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0');
}

function splitCountdown(now: number, startMs: number) {
  const totalMins = Math.floor(Math.max(0, startMs - now) / 60_000);
  return {
    days: Math.floor(totalMins / (60 * 24)),
    hours: Math.floor((totalMins % (60 * 24)) / 60),
    mins: totalMins % 60,
  };
}

interface CampCountdownProps {
  startsAt: string;
  endsAt?: string;
  className?: string;
}

/** Days : Hours : Mins until camp start; "Happening now" while live; nothing once ended. */
export default function CampCountdown({ startsAt, endsAt, className = '' }: CampCountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const phase = campPhase(now, startsAt, endsAt);
  if (phase === 'ended') return null;

  if (phase === 'live') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full text-xs font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 ${className}`}
        aria-live="polite"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" aria-hidden />
        Happening now
      </span>
    );
  }

  const { days, hours, mins } = splitCountdown(now, Date.parse(startsAt));

  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-emerald-300/80 bg-white/90 px-2.5 py-2 shadow-sm ${className}`}
      aria-live="polite"
      aria-label={`Camp starts in ${days} days, ${hours} hours, ${mins} minutes`}
    >
      {(
        [
          { label: 'Days', value: pad(days) },
          { label: 'Hours', value: pad(hours) },
          { label: 'Mins', value: pad(mins) },
        ] as const
      ).map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-1.5 sm:gap-2">
          {i > 0 && <span className="text-emerald-400 font-bold text-sm">:</span>}
          <div className="text-center min-w-[2.5rem]">
            <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums leading-none">
              {unit.value}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-emerald-800 font-semibold mt-0.5">
              {unit.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
