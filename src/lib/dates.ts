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