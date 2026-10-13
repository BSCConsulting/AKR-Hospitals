import type { WeeklySession } from '@/lib/dates';

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

export interface NavItem {
  label: string;
  href: string;
}

export interface OpdSpecialty extends WeeklySession {
  id: string;
  name: string;
  shortName: string;
}

export type BranchId = "madhira" | "vijayawada";

export interface Branch {
  id: BranchId;
  name: string;
  city: string;
  logo: string;
  address: string;
  phones: { label: string; display: string; tel: string }[];
  email?: string;
  mapsUrl: string;
  services: string[];
  /** Only branches with listed doctors take online requests; others are phone-only. */
  bookOnline: boolean;
}

export interface Facility {
  icon: string;
  name: string;
  detail: string;
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
  /** Show only once confirmed; 0 means a free OP consultation. */
  fee?: number;
  branch: BranchId;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  type: "government" | "tpa" | "corporate";
  coveredProcedures: string[];
  deskRequirements: string[];
}

export const hospitalInfo = {
  name: "AKR Super Speciality Hospitals",
  // TODO(hospital): replace the placeholder with the real AKR logo (SVG or transparent PNG).
  logo: "/brand/akr-logo.svg",
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
  { label: "Facilities", href: "#facilities" },
  { label: "Insurance", href: "#cashless" },
  { label: "Founder", href: "#founder" },
  { label: "Specialists", href: "#specialists" },
  { label: "Branches", href: "#branches" },
  { label: "Contact", href: "#contact" },
];

export const branches: Branch[] = [
  {
    id: "madhira",
    name: hospitalInfo.name,
    city: "Madhira",
    logo: hospitalInfo.logo,
    address: hospitalInfo.address,
    phones: [
      { label: "Casualty & reception (24/7)", display: hospitalInfo.phone, tel: hospitalInfo.phoneTel },
      { label: "Appointments & WhatsApp", display: hospitalInfo.appointmentLine, tel: "tel:+919849057185" },
    ],
    mapsUrl: hospitalInfo.mapsDirectionsUrl,
    services: ["General Medicine", "Laparoscopic Surgery", "Cardiology", "Urology", "CT Scan", "24/7 Casualty"],
    bookOnline: true,
  },
  {
    id: "vijayawada",
    name: "Mahajan Super Speciality Hospitals",
    city: "Vijayawada",
    // TODO(hospital): replace the placeholder with the real Mahajan logo.
    logo: "/brand/mahajan-logo.svg",
    // TODO(hospital): PIN code and exact map pin; mahajanhospitals.in only says "Vijayawada, Andhra Pradesh".
    address: "Kiran Tower, RR Nagar, Kabela Centre, Vijayawada, Andhra Pradesh",
    phones: [
      { label: "Reception", display: "+91 93919 44733", tel: "tel:+919391944733" },
      { label: "Alternate", display: "+91 99858 15095", tel: "tel:+919985815095" },
    ],
    email: "contact@mahajanhospitals.in",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mahajan+Hospital+Kiran+Tower+Kabela+Centre+Vijayawada",
    // Services as listed on mahajanhospitals.in.
    services: ["Cardiology", "Orthopaedics", "General Medicine", "Surgery", "Diagnostics lab", "24/7 Emergency"],
    bookOnline: false,
  },
];

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6] as const;

/** Bookable OPDs at Madhira. Days use Date.getDay() (0 = Sunday). */
export const opdSpecialties: OpdSpecialty[] = [
  { id: "general-medicine", name: "General Medicine", shortName: "Medicine", days: EVERY_DAY, start: "11:00", end: "13:00" },
  { id: "general-surgery", name: "General & Laparoscopic Surgery", shortName: "Surgery", days: [4], start: "11:00", end: "14:00" },
  { id: "cardiology", name: "Cardiology", shortName: "Cardiology", days: [2], start: "16:00", end: "18:00" },
  { id: "urology", name: "Urology & Andrology", shortName: "Urology", days: [0], start: "10:00", end: "14:00" },
];

/** The casualty duty doctor ("family physician"): walk-in round the clock, not bookable. */
export const familyPhysician: WeeklySession = { days: EVERY_DAY, start: "00:00", end: "24:00" };

// TODO(hospital): swap each placeholder for /doctors/<name>.webp once real photos arrive,
// and add TSMC/NMC registration numbers and fees only when confirmed.
const PHOTO_PLACEHOLDER = "/doctors/placeholder.svg";

export const doctors: Doctor[] = [
  {
    id: "d0",
    name: "Dr. A. Kondal Rao",
    credentials: "MBBS | Ex-DM&HO (Khammam)",
    specialtyId: "general-medicine",
    specialtyName: "General Medicine",
    designation: "Founder & Chief Physician",
    photo: "/founder-dr-kondal-rao.webp",
    fee: 0,
    branch: "madhira",
  },
  {
    id: "d1",
    name: "Dr. C. T. Murali Krishna",
    credentials: "FICS",
    specialtyId: "general-surgery",
    specialtyName: "General & Laparoscopic Surgery",
    designation: "Laparoscopic & General Surgeon",
    photo: PHOTO_PLACEHOLDER,
    branch: "madhira",
  },
  {
    id: "d2",
    name: "Dr. Pavan Kumar Reddy",
    credentials: "MD, DM (Cardiology)",
    specialtyId: "cardiology",
    specialtyName: "Cardiology",
    designation: "Consultant Cardiologist",
    photo: PHOTO_PLACEHOLDER,
    branch: "madhira",
  },
  {
    id: "d7",
    name: "Dr. Pinnamaneni Sreedhar",
    credentials: "MS, M.Ch (Urology)",
    specialtyId: "urology",
    specialtyName: "Urology & Andrology",
    designation: "Urologist & Andrologist",
    photo: PHOTO_PLACEHOLDER,
    branch: "madhira",
  },
];

export const facilities: Facility[] = [
  { icon: "scan-line", name: "CT Scan", detail: "In-house CT imaging for casualty and OPD patients." },
  { icon: "scissors", name: "Advanced HD Laparoscopy", detail: "Keyhole surgery suite for laparoscopic procedures." },
  { icon: "flask", name: "Advanced Laboratory", detail: "Computerised lab for routine and specialised tests." },
  { icon: "heart-pulse", name: "2D Echo", detail: "Heart ultrasound for cardiac evaluation." },
  { icon: "waves", name: "Ultrasound", detail: "Ultrasound scanning for OPD and casualty patients." },
  { icon: "activity", name: "ECG", detail: "Quick heart-rhythm recording." },
  { icon: "bone", name: "X-Ray", detail: "X-ray imaging for fractures and chest checks." },
  { icon: "ambulance", name: "24/7 Ambulance", detail: "Hospital ambulance on call day and night." },
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
      "24/7 casualty with a family physician on duty round the clock and a hospital ambulance on call.",
    icon: "ambulance",
    accent: "#e11d48",
    features: ["24/7 family physician", "24/7 ambulance", "Fracture & accident care"],
    highlight: true,
  },
  {
    id: "cardiology",
    name: "Cardiology",
    shortName: "Cardiology",
    description: "Heart care with Dr. Pavan Kumar Reddy (DM Cardiology), supported by 2D Echo and ECG.",
    icon: "heart-pulse",
    accent: "#dc2626",
    features: ["2D Echo", "ECG", "Tuesday OPD"],
  },
  {
    id: "general-surgery",
    name: "General & Laparoscopic Surgery",
    shortName: "Surgery",
    description:
      "Keyhole (laparoscopic) and open surgery with Dr. C. T. Murali Krishna in an advanced HD laparoscopy suite.",
    icon: "scissors",
    accent: "#7c3aed",
    features: ["Laparoscopic surgery", "General surgery", "Thursday OPD"],
  },
  {
    id: "urology",
    name: "Urology & Andrology",
    shortName: "Urology",
    description: "Kidney stone, prostate and men's health care with Dr. Pinnamaneni Sreedhar (M.Ch Urology).",
    icon: "activity",
    accent: "#0d9488",
    features: ["Kidney stones", "Prostate care", "Sunday OPD"],
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
    id: "ophthalmology",
    name: "Ophthalmology & Eye Care",
    shortName: "Eye Care",
    description:
      "Eye care from routine eye check-ups to cataract evaluation and diabetic eye screening.",
    icon: "eye",
    accent: "#0284c7",
    features: ["Eye check-ups", "Cataract evaluation", "Diabetic eye screening"],
  },
];
