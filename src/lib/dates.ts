/** Local calendar helpers (avoids UTC midnight skew for IST). */

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export function toLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addLocalDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatMonthDay(date: Date): string {
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
}

export function formatWeekday(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

/** A weekly OPD window. `days` use Date.getDay() (0 = Sunday); times are "HH:00", end exclusive. */
export interface WeeklySession {
  days: readonly number[];
  start: string;
  end: string;
}

/** Hourly start times inside the window: 11:00–14:00 → ["11:00", "12:00", "13:00"]. */
export function sessionHours({ start, end }: WeeklySession): string[] {
  const hours: string[] = [];
  for (let h = Number(start.slice(0, 2)); h < Number(end.slice(0, 2)); h++) {
    hours.push(`${String(h).padStart(2, '0')}:00`);
  }
  return hours;
}

/** Next `count` dates the session runs. Today counts only while one of its start hours is still ahead. */
export function nextSessions(session: WeeklySession, now: Date = new Date(), count = 3): Date[] {
  const hours = sessionHours(session);
  const lastHour = hours.length ? Number(hours[hours.length - 1].slice(0, 2)) : -1;
  const dates: Date[] = [];
  for (let i = 0; dates.length < count && i < 7 * (count + 1); i++) {
    const day = addLocalDays(now, i);
    if (!session.days.includes(day.getDay())) continue;
    if (i === 0 && lastHour <= now.getHours()) continue;
    dates.push(day);
  }
  return dates;
}

const formatHour = (hhmm: string) => {
  const h = Number(hhmm.slice(0, 2));
  return `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
};

/** "Tuesdays · 4 PM – 6 PM", "Daily · 11 AM – 1 PM" or "24/7". */
export function formatSession(s: WeeklySession): string {
  if (s.days.length === 7 && s.start === '00:00' && s.end === '24:00') return '24/7';
  const days = s.days.length === 7 ? 'Daily' : s.days.map((d) => `${WEEKDAYS[d]}s`).join(', ');
  return `${days} · ${formatHour(s.start)} – ${formatHour(s.end)}`;
}

export type CampPhase = 'upcoming' | 'live' | 'ended';

/** startsAt / endsAt are ISO strings with offset, e.g. 2026-10-11T10:00:00+05:30. */
export function campPhase(now: number, startsAt?: string, endsAt?: string): CampPhase {
  if (endsAt && now >= Date.parse(endsAt)) return 'ended';
  if (startsAt && now < Date.parse(startsAt)) return 'upcoming';
  return 'live';
}

/** "Sunday, 11 Oct 2026" in IST regardless of the visitor's timezone. */
export function formatCampDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(Date.parse(iso));
}