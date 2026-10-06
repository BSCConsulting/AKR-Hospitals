/** Centralized WhatsApp deep links for AKR Hospital CTAs. */

export const WHATSAPP_NUMBER = '919849057185';

function wa(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_CAMP_RSVP = wa(
  'Hello AKR Hospital, I would like to RSVP for the Mega Urology Camp on Oct 11.'
);

export const WHATSAPP_OPD_INQUIRE = wa(
  'Hello, I want to inquire about OPD consultations.'
);

/** @deprecated Prefer WHATSAPP_OPD_INQUIRE — kept as the default general CTA. */
export const WHATSAPP_LINK = WHATSAPP_OPD_INQUIRE;

export function whatsappBookingConfirm(details: {
  reference: string;
  patientName: string;
  department: string;
  doctorName: string;
  dateLabel: string;
  time: string;
  reason?: string;
}): string {
  const lines = [
    `Hello AKR Hospital, please confirm my OPD booking.`,
    `Reference: ${details.reference}`,
    `Patient: ${details.patientName}`,
    `Department: ${details.department}`,
    `Doctor: ${details.doctorName}`,
    `Slot: ${details.dateLabel} at ${details.time}`,
  ];
  if (details.reason) lines.push(`Reason: ${details.reason}`);
  return wa(lines.join('\n'));
}
