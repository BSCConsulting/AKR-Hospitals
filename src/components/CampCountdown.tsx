import { useEffect, useState } from 'react';

/** Mega Urology Camp start — Sunday, Oct 11, 2026, 10:00 IST (UTC+5:30). */
const CAMP_START_MS = Date.parse('2026-10-11T10:00:00+05:30');

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0');
}

function splitCountdown(now: number) {
  const diff = Math.max(0, CAMP_START_MS - now);
  const totalMins = Math.floor(diff / 60_000);
  return {
    days: Math.floor(totalMins / (60 * 24)),
    hours: Math.floor((totalMins % (60 * 24)) / 60),
    mins: totalMins % 60,
    started: diff === 0,
  };
}

/** Live Days : Hours : Mins countdown — client-mounted to avoid hydration skew. */
export default function CampCountdown({ className = '' }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    setReady(true);
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, mins, started } = splitCountdown(ready ? now : CAMP_START_MS);

  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-emerald-300/80 bg-white/90 px-2.5 py-2 shadow-sm ${className}`}
      aria-live="polite"
      aria-label={
        !ready
          ? 'Camp countdown loading'
          : started
            ? 'Camp is live'
            : `Camp starts in ${days} days, ${hours} hours, ${mins} minutes`
      }
    >
      {(
        [
          { label: 'Days', value: ready ? pad(days) : '--' },
          { label: 'Hours', value: ready ? pad(hours) : '--' },
          { label: 'Mins', value: ready ? pad(mins) : '--' },
        ] as const
      ).map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-1.5 sm:gap-2">
          {i > 0 && <span className="text-emerald-400 font-bold text-sm">:</span>}
          <div className="text-center min-w-[2.5rem]">
            <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums leading-none">
              {ready && started ? '00' : unit.value}
            </div>
            <div className="text-[9px] uppercase tracking-wide text-emerald-800 font-semibold mt-0.5">
              {unit.label}
            </div>
          </div>
        </div>
      ))}
      {ready && started && (
        <span className="ml-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          Live now
        </span>
      )}
    </div>
  );
}
