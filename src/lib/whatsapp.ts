/** Centralized WhatsApp deep links for AKR Hospital CTAs. */

export const WHATSAPP_NUMBER = '919849057185';

export function wa(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_OPD_INQUIRE = wa(
  'Hello, I want to inquire about OPD consultations.'
);

export function whatsappBookingConfirm(details: {
  reference?: string;
  patientName: string;
  mobile: string;
  department: string;
  doctorName?: string;
  dateLabel: string;
  time: string;
  reason: string;
}): string {
  const lines = [
    `Hello AKR Hospital, I would like an OPD appointment.`,
    ...(details.reference ? [`Reference: ${details.reference}`] : []),
    `Patient: ${details.patientName}`,
    `Mobile: ${details.mobile}`,
    `Department: ${details.department}`,
    `Doctor: ${details.doctorName ?? 'Any available'}`,
    `Preferred: ${details.dateLabel} at ${details.time}`,
    `Reason: ${details.reason}`,
  ];
  return wa(lines.join('\n'));
}
