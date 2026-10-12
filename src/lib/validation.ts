/** Indian mobile: starts with 6–9, exactly 10 digits. */
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

/** Strips formatting and a +91 / 0 prefix (only when there are more than 10 digits). */
export function normalizeMobile(value: string): string {
  const digits = value.replace(/\D/g, '');
  return (digits.length > 10 ? digits.replace(/^(91|0)/, '') : digits).slice(0, 10);
}

export function isValidIndianMobile(value: string): boolean {
  return INDIAN_MOBILE_REGEX.test(normalizeMobile(value));
}

/** No 0/O/1/I/L so references read clearly over the phone. */
const REFERENCE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export function generateOpdReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `AKR-${Array.from(bytes, (b) => REFERENCE_ALPHABET[b % REFERENCE_ALPHABET.length]).join('')}`;
}

export const VISIT_REASONS = [
  { id: 'routine-opd', label: 'Routine OPD' },
  { id: 'camp-checkup', label: 'Camp Checkup' },
  { id: 'follow-up', label: 'Follow-up' },
  { id: 'diagnostic-review', label: 'Diagnostic Review' },
] as const;

export type VisitReasonId = (typeof VISIT_REASONS)[number]['id'];
