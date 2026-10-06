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

export function formatDateLabel(date: Date, relative: 'today' | 'tomorrow' | 'weekday'): string {
  const sub = formatMonthDay(date);
  if (relative === 'today') return `Today, ${sub}`;
  if (relative === 'tomorrow') return `Tomorrow, ${sub}`;
  return `${formatWeekday(date)}, ${sub}`;
}

export interface BookingDateDefaults {
  date: string;
  dateLabel: string;
  time: string;
}

export function getTodayBookingDefaults(time = '09:00'): BookingDateDefaults {
  const today = new Date();
  return {
    date: toLocalDateString(today),
    dateLabel: formatDateLabel(today, 'today'),
    time,
  };
}

/** Google Calendar compact datetime: YYYYMMDDTHHMMSS (local, no Z). */
export function toGoogleCalendarDateTime(date: string, time: string, durationMinutes = 30): string {
  const [hours, minutes] = time.split(':').map(Number);
  const start = new Date(`${date}T00:00:00`);
  start.setHours(hours || 0, minutes || 0, 0, 0);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}${m}${day}T${h}${min}00`;
  };

  return `${fmt(start)}/${fmt(end)}`;
}
