import { WHATSAPP_CAMP_RSVP, WHATSAPP_OPD_INQUIRE } from '@/lib/whatsapp';

export type PromotionType = 'camp' | 'discount' | 'general';

export interface PromotionDoctor {
  name: string;
  title: string;
  qualification: string;
}

export interface Promotion {
  id: string;
  type: PromotionType;
  isActive: boolean;
  title: string;
  highlightBadge: string;
  /** Human-readable schedule / validity line */
  date: string;
  doctors: PromotionDoctor[];
  benefits: string[];
  symptoms: string[];
  /** Pre-filled WhatsApp deep link */
  whatsappCTA: string;
  /** Short line for the top announcement bar */
  announcementText?: string;
  /** Optional time window shown in the camp card */
  timeWindow?: string;
  /** Card status badge */
  statusLabel?: 'LIMITED TIME CAMP' | 'UPCOMING EVENT' | 'ALWAYS ON';
}

/** Toggle `isActive` here to show/hide campaigns site-wide. */
export const promotions: Promotion[] = [
  {
    id: 'urology-mega-camp',
    type: 'camp',
    isActive: true,
    title: 'Free Mega Urology Medical Camp',
    highlightBadge: 'Free OP & 50% Off Ultrasound',
    date: 'Sunday, 11th October 2026 | 10:00 AM - 2:00 PM',
    timeWindow: '10:00 AM – 2:00 PM',
    statusLabel: 'LIMITED TIME CAMP',
    announcementText:
      'Active Camp: Free Mega Urology Camp — Free OP Consultation & 50% Off Scans',
    doctors: [
      {
        name: 'Dr. Pinnamaneni Sreedhar',
        title: 'Urologist',
        qualification: 'M.Ch Urology',
      },
      {
        name: 'Dr. A. Kondal Rao',
        title: 'Founder & Chief Physician',
        qualification: 'MBBS',
      },
    ],
    benefits: [
      'Free Consultation',
      'Ultrasound Scan 50% Off',
      '₹20 Sugar Test',
      '30% Off Lab Tests',
      '20% Off Pharmacy',
    ],
    symptoms: [
      'Burning urination',
      'Kidney stones',
      'Prostate issues',
      'Frequent night urination',
      'Blood in urine',
    ],
    whatsappCTA: WHATSAPP_CAMP_RSVP,
  },
  {
    id: 'free-op-kondal-rao',
    type: 'discount',
    isActive: true,
    title: 'Special Camp / First-Visit Community Waiver',
    highlightBadge: '₹0 OP Registration (Select Doctors)',
    date: 'Daily during OPD hours (9 AM – 8 PM) · Select consultants',
    statusLabel: 'ALWAYS ON',
    announcementText:
      'Community Waiver: ₹0 OP Registration with select doctors (Dr. Kondal Rao & camp clinicians)',
    doctors: [
      {
        name: 'Dr. A. Kondal Rao',
        title: 'Founder & Chief Physician',
        qualification: 'MBBS | Ex-DM&HO (Khammam)',
      },
    ],
    benefits: [
      '₹0 OP registration for first-visit / community waiver doctors',
      'Standard consultant fees (₹400–₹800) apply to other specialists',
    ],
    symptoms: [],
    whatsappCTA: WHATSAPP_OPD_INQUIRE,
  },
  {
    id: 'lab-30',
    type: 'discount',
    isActive: true,
    title: '30% Off Laboratory Tests',
    highlightBadge: '30% Off Labs',
    date: 'Ongoing community subsidy',
    statusLabel: 'ALWAYS ON',
    doctors: [],
    benefits: ['30% flat discount on laboratory tests', 'Computerized diagnostics'],
    symptoms: [],
    whatsappCTA: WHATSAPP_OPD_INQUIRE,
  },
  {
    id: 'pharmacy-20',
    type: 'discount',
    isActive: true,
    title: '20% Off Pharmacy',
    highlightBadge: '20% Off Medicines',
    date: 'Ongoing at in-house pharmacy',
    statusLabel: 'ALWAYS ON',
    doctors: [],
    benefits: ['20% discount on medicines', '24/7 pharmacy availability'],
    symptoms: [],
    whatsappCTA: WHATSAPP_OPD_INQUIRE,
  },
  {
    id: 'ultrasound-50',
    type: 'discount',
    isActive: true,
    title: '50% Off Ultrasound',
    highlightBadge: '50% Off Scans',
    date: 'During active camp hours & selected OPD windows',
    statusLabel: 'ALWAYS ON',
    doctors: [],
    benefits: [
      'Ultrasound 50% off during Mega Urology Camp hours (Oct 11, 10 AM–2 PM) and notified OPD windows',
      'Same-day reporting where available',
    ],
    symptoms: [],
    whatsappCTA: WHATSAPP_OPD_INQUIRE,
  },
];

export function getActivePromotions(): Promotion[] {
  return promotions.filter((p) => p.isActive);
}

export function getActiveCamps(): Promotion[] {
  return getActivePromotions().filter((p) => p.type === 'camp');
}

export function getActiveDiscounts(): Promotion[] {
  return getActivePromotions().filter((p) => p.type === 'discount' || p.type === 'general');
}

export function hasActivePromotion(): boolean {
  return getActivePromotions().length > 0;
}

/** Primary camp used for the feature card / announcement (first active camp). */
export function getFeaturedCamp(): Promotion | undefined {
  return getActiveCamps()[0];
}

export function hasFreeOpConsultation(): boolean {
  return getActivePromotions().some(
    (p) =>
      p.isActive &&
      (p.id === 'free-op-kondal-rao' ||
        p.benefits.some((b) => /free\s*(op|consultation)/i.test(b)) ||
        /free\s*op/i.test(p.highlightBadge))
  );
}

export const ROUTINE_SUBSIDIES = [
  { label: 'Lab tests', value: '30% Off' },
  { label: 'Pharmacy medicines', value: '20% Off' },
  { label: 'Ultrasound scans', value: '50% Off*' },
  { label: 'Sugar (glucose) test', value: '₹20' },
  { label: 'Emergency triage', value: '24/7' },
] as const;

export const SUPPORT_PHONE = '+91 87492 73030';
export const SUPPORT_PHONE_TEL = 'tel:+918749273030';
export const APPOINTMENT_PHONE = '+91 98490 57185';
export const APPOINTMENT_PHONE_TEL = 'tel:+919849057185';
