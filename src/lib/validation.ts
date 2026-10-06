/** Indian mobile: starts with 6–9, exactly 10 digits. */
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function normalizeMobile(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function isValidIndianMobile(value: string): boolean {
  return INDIAN_MOBILE_REGEX.test(normalizeMobile(value));
}

export function generateOpdReference(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `AKR-OPD-${num}`;
}

export const VISIT_REASONS = [
  { id: 'routine-opd', label: 'Routine OPD' },
  { id: 'camp-checkup', label: 'Camp Checkup' },
  { id: 'follow-up', label: 'Follow-up' },
  { id: 'diagnostic-review', label: 'Diagnostic Review' },
] as const;

export type VisitReasonId = (typeof VISIT_REASONS)[number]['id'];
