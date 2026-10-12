import {
  addLocalDays,
  formatMonthDay,
  formatWeekday,
  toLocalDateString,
} from '@/lib/dates';

// Only facts confirmed by the hospital belong in this file. Anything unconfirmed is left out
// (not guessed) — see the TODO(hospital) notes.

export interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  accent: string;
  features: string[];
  highlight?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface OpdSpecialty {
  id: string;
  name: string;
  shortName: string;
}

export interface Doctor {
  id: string;
  name: string;
  credentials: string;
  /** State Medical Council / NMC registration — display only once confirmed. */
  registrationNumber?: string;
  specialtyId: string;
  specialtyName: string;
  designation?: string;
  photo?: string;
  opdDays: string[];
  fee: number;
  available: boolean;
}

export interface DateTab {
  id: string;
  label: string;
  subLabel: string;
  date: string;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  type: "government" | "tpa" | "corporate";
  coveredProcedures: string[];
  deskRequirements: string[];
}

export const hospitalInfo = {
  name: "Dr. AKR's Multispeciality Hospital",
  tagline: "Quality healthcare... now within your reach!",
  phone: "+91 87492 73030",
  phoneTel: "tel:+918749273030",
  ambulancePhone: "108",
  ambulanceTel: "tel:108",
  ambulanceLabel: "Govt. ambulance (108)",
  appointmentLine: "+91 98490 57185",
  address: "Samatha Nagar, Didugupadu, Madhira, Khammam, Telangana 507203",
  landmark: "Opposite Susheela College, Wyra Road, Madhira",
  // TODO(hospital): add a working email — care@akrhospital.in has no mail server (no MX record).
  established: "2008",
  coordinates: { lat: 16.9364216, lng: 80.3673425 },
  mapsUrl: "https://maps.google.com/?cid=15932574121423350845",
  mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=16.9364216,80.3673425",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Book", href: "#appointments" },
  { label: "Camps", href: "#camps" },
  { label: "Departments", href: "#departments" },
  { label: "Insurance", href: "#cashless" },
  { label: "Founder", href: "#founder" },
  { label: "Specialists", href: "#specialists" },
  { label: "Contact", href: "#contact" },
];

export const opdSpecialties: OpdSpecialty[] = [
  { id: "general-medicine", name: "General Medicine", shortName: "Medicine" },
  { id: "cardiology", name: "Cardiology", shortName: "Cardiology" },
  { id: "orthopedics", name: "Orthopedics", shortName: "Ortho" },
  { id: "pediatrics", name: "Pediatrics", shortName: "Peds" },
  { id: "gynecology", name: "Gynecology & Obstetrics", shortName: "Gynec" },
  { id: "urology", name: "Urology", shortName: "Urology" },
  { id: "ophthalmology", name: "Ophthalmology", shortName: "Eye" },
  { id: "dermatology", name: "Dermatology", shortName: "Derma" },
];

/** Rolling 3-day OPD tabs based on the visitor's local calendar. */
export function getDateTabs(from: Date = new Date()): DateTab[] {
  const today = from;
  const tomorrow = addLocalDays(today, 1);
  const dayAfter = addLocalDays(today, 2);

  return [
    {
      id: 'today',
      label: 'Today',
      subLabel: formatMonthDay(today),
      date: toLocalDateString(today),
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      subLabel: formatMonthDay(tomorrow),
      date: toLocalDateString(tomorrow),
    },
    {
      id: 'day-after',
      label: formatWeekday(dayAfter),
      subLabel: formatMonthDay(dayAfter),
      date: toLocalDateString(dayAfter),
    },
  ];
}

// TODO(hospital): add the full consultant list (name, qualification, TSMC reg no, specialty,
// OPD days, fee). Until then only the two clinicians named on the hospital's own camp
// material are listed; fees and OPD days below still need confirmation.
export const doctors: Doctor[] = [
  {
    id: "d0",
    name: "Dr. A. Kondal Rao",
    credentials: "MBBS | Ex-DM&HO (Khammam)",
    specialtyId: "general-medicine",
    specialtyName: "General Medicine",
    designation: "Founder & Chief Physician",
    photo: "/founder-dr-kondal-rao.webp",
    opdDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    fee: 0,
    available: true,
  },
  {
    id: "d7",
    name: "Dr. Pinnamaneni Sreedhar",
    credentials: "M.Ch (Urology)",
    specialtyId: "urology",
    specialtyName: "Urology",
    designation: "Senior Urologist & Andrologist",
    opdDays: ["Mon", "Wed", "Fri", "Sat"],
    fee: 700,
    available: true,
  },
];

// TODO(hospital): confirm current empanelment for each insurer / TPA.
export const insuranceProviders: InsuranceProvider[] = [
  {
    id: "star-health",
    name: "Star Health",
    type: "tpa",
    coveredProcedures: [
      "OPD & IPD consultation",
      "Surgical procedures",
      "Maternity",
      "Diagnostics & lab",
    ],
    deskRequirements: [
      "Insurance E-Card / Policy Copy",
      "Doctor's Admission Advice",
      "Photo ID (Voter ID / Govt ID)",
    ],
  },
  {
    id: "icici-lombard",
    name: "ICICI Lombard",
    type: "corporate",
    coveredProcedures: [
      "OPD & IPD",
      "Surgical & maternity",
      "Health checkup packages",
      "Emergency & ambulance",
    ],
    deskRequirements: [
      "Insurance E-Card / Policy Copy",
      "Doctor's Admission Advice",
      "Photo ID (Voter ID / Govt ID)",
    ],
  },
  {
    id: "mediassist",
    name: "MediAssist",
    type: "tpa",
    coveredProcedures: [
      "IPD & surgical",
      "Day-care procedures",
      "Diagnostics",
      "Emergency admission",
    ],
    deskRequirements: [
      "Insurance E-Card / Policy Copy",
      "Doctor's Admission Advice",
      "Photo ID (Voter ID / Govt ID)",
    ],
  },
  {
    id: "care-health",
    name: "Care Health",
    type: "tpa",
    coveredProcedures: [
      "IPD & surgical",
      "Maternity & delivery",
      "Day-care procedures",
      "Emergency admission",
    ],
    deskRequirements: [
      "Insurance E-Card / Policy Copy",
      "Doctor's Admission Advice",
      "Photo ID (Voter ID / Govt ID)",
    ],
  },
  {
    id: "hdfc-ergo",
    name: "HDFC ERGO",
    type: "corporate",
    coveredProcedures: [
      "OPD & IPD",
      "Surgical & maternity",
      "Health checkup packages",
      "Emergency & ambulance",
    ],
    deskRequirements: [
      "Insurance E-Card / Policy Copy",
      "Doctor's Admission Advice",
      "Photo ID (Voter ID / Govt ID)",
    ],
  },
];

/** Clinical departments only — admin/insurance lives in PatientServicesSection. */
export const departments: Department[] = [
  {
    id: "trauma",
    name: "Trauma & Emergency Care",
    shortName: "Trauma",
    description:
      "24/7 casualty and trauma care, with orthopaedic surgery support for fractures and accident injuries.",
    icon: "ambulance",
    accent: "#e11d48",
    features: ["24/7 casualty", "Fracture & accident care", "Orthopaedic surgery"],
    highlight: true,
  },
  {
    id: "maternity",
    name: "Maternity & Women's Health",
    shortName: "Maternity",
    description:
      "Antenatal check-ups, labour and delivery, and gynaecology care, with support for newborns.",
    icon: "baby",
    accent: "#db2777",
    features: ["Antenatal check-ups", "Labour & delivery", "Newborn care"],
  },
  {
    id: "urology",
    name: "Urology & General Surgery",
    shortName: "Urology",
    description:
      "Urology and general surgery services including kidney stone management, prostate care, and planned procedures.",
    icon: "activity",
    accent: "#0d9488",
    features: ["Kidney stone management", "Prostate evaluation", "Day-care procedures"],
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology & Eye Care",
    shortName: "Eye Care",
    description:
      "Eye care from routine eye check-ups to cataract evaluation and diabetic eye screening.",
    icon: "eye",
    accent: "#0284c7",
    features: ["Eye check-ups", "Cataract evaluation", "Diabetic eye screening"],
  },
  {
    id: "diagnostics",
    name: "Diagnostics & Imaging",
    shortName: "Diagnostics",
    description:
      "In-house computerised laboratory and imaging, including CT scan and ultrasound, for OPD and emergency patients.",
    icon: "scan-line",
    accent: "#4f46e5",
    features: ["Computerised laboratory", "CT scan", "Ultrasound"],
  },
];

/** Preferred-time options for appointment requests; staff confirm the actual slot by phone. */
export const timeSlots: TimeSlot[] = [
  { id: "s1", time: "09:00" },
  { id: "s2", time: "10:00" },
  { id: "s3", time: "11:00" },
  { id: "s4", time: "12:00" },
  { id: "s5", time: "14:00" },
  { id: "s6", time: "15:00" },
  { id: "s7", time: "16:00" },
  { id: "s8", time: "17:00" },
  { id: "s9", time: "18:00" },
  { id: "s10", time: "19:00" },
];
