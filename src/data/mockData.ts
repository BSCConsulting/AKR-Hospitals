import {
  addLocalDays,
  formatMonthDay,
  formatWeekday,
  toLocalDateString,
} from '@/lib/dates';

export interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  accent: string;
  wing: string;
  floor: string;
  stats: { label: string; value: string }[];
  features: string[];
  bentoSpan: string;
  highlight?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  label: string;
  available: boolean;
  doctorCount: number;
}

export interface QueuePatient {
  id: string;
  token: string;
  patientName: string;
  department: string;
  status: "waiting" | "in-consult" | "next";
  waitMinutes: number;
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
  specialtyId: string;
  specialtyName: string;
  opdDays: string[];
  room: string;
  fee: number;
  experience: number;
  available: boolean;
  rating: number;
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
  turnaround: string;
}

export const hospitalInfo = {
  name: "Dr. AKR's Multispeciality Hospital",
  tagline: "Quality healthcare... now within your reach!",
  taglineTe: "నాణ్యమైన వైద్యం... ఇప్పుడు మీకు అందుబాటులో!",
  phone: "+91 87492 73030",
  emergencyPhone: "1066",
  appointmentLine: "+91 9849057185",
  managingDirector: "Dr. Kondal Rao",
  mdCredentials: "MD / Chief Consultant",
  address: "Samatha Nagar, Didugupadu, Madhira, Khammam, Telangana 507203",
  landmark: "Opposite Susheela College, Wyra Road, Madhira",
  email: "care@akrhospital.in",
  established: "2008",
  beds: 250,
  doctors: 80,
  coordinates: { lat: 16.9364216, lng: 80.3673425 },
  mapsUrl: "https://maps.google.com/?cid=15932574121423350845",
  mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=16.9364216,80.3673425",
};

export interface SpecialOffer {
  id: string;
  titleEn: string;
  titleTe: string;
  descEn: string;
  descTe: string;
  icon: string;
}

export const specialOffers: SpecialOffer[] = [
  {
    id: "free-op",
    titleEn: "Free OP Consultation",
    titleTe: "ఉచిత OP కన్సల్టేషన్",
    descEn: "Free OP Consultation by Dr. Kondal Rao",
    descTe: "డా॥ కొండల్ రావు గారిచే ఉచిత OP కన్సల్టేషన్",
    icon: "stethoscope",
  },
  {
    id: "lab-discount",
    titleEn: "30% Off Lab Tests",
    titleTe: "ల్యాబ్ పరీక్షలపై 30% తగ్గింపు",
    descEn: "30% Flat Discount on all Laboratory Tests",
    descTe: "అన్ని రకాల ల్యాబ్ పరీక్షలపై 30% తగ్గింపు",
    icon: "test-tube",
  },
  {
    id: "pharmacy-discount",
    titleEn: "20% Off Pharmacy",
    titleTe: "మందులపై 20% తగ్గింపు",
    descEn: "20% Discount at the in-house Medical Shop / Pharmacy",
    descTe: "మెడికల్ షాపులో మందులపై 20% తగ్గింపు",
    icon: "pill",
  },
  {
    id: "sugar-test",
    titleEn: "Sugar Test @ ₹20",
    titleTe: "షుగర్ పరీక్ష @ ₹20",
    descEn: "Routine Sugar (Blood Glucose) Test at just ₹20/-",
    descTe: "రక్తంలో గ్లూకోజ్ పరీక్ష కేవలం ₹20/- లకే",
    icon: "droplet",
  },
  {
    id: "247-availability",
    titleEn: "24/7 Emergency & Pharmacy",
    titleTe: "24/7 అత్యవసరం & మెడికల్ షాప్",
    descEn: "24/7 Availability for Emergency, Pharmacy, and Casualty",
    descTe: "అత్యవసరం, మెడికల్ షాప్, క్యాజువాలిటీ 24/7 అందుబాటులో",
    icon: "clock",
  },
];

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Departments", href: "#departments" },
  { label: "Specialists", href: "#specialists" },
  { label: "Cashless", href: "#cashless" },
  { label: "Contact", href: "#contact" },
];

export const opdSpecialties: OpdSpecialty[] = [
  { id: "general-medicine", name: "General Medicine", shortName: "Medicine" },
  { id: "cardiology", name: "Cardiology", shortName: "Cardiology" },
  { id: "orthopedics", name: "Orthopedics", shortName: "Ortho" },
  { id: "pediatrics", name: "Pediatrics", shortName: "Peds" },
  { id: "gynecology", name: "Gynecology & Obstetrics", shortName: "Gynec" },
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

/** @deprecated Prefer getDateTabs() — kept for any static imports during migration. */
export const dateTabs: DateTab[] = getDateTabs();

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. R. Sharma",
    credentials: "MD, General Medicine",
    specialtyId: "general-medicine",
    specialtyName: "General Medicine",
    opdDays: ["Mon", "Tue", "Wed", "Fri"],
    room: "Cabin 104",
    fee: 400,
    experience: 18,
    available: true,
    rating: 4.8,
  },
  {
    id: "d2",
    name: "Dr. A. Krishnan",
    credentials: "DM, Cardiology",
    specialtyId: "cardiology",
    specialtyName: "Cardiology",
    opdDays: ["Mon", "Wed", "Thu", "Sat"],
    room: "Cabin 201",
    fee: 800,
    experience: 22,
    available: true,
    rating: 4.9,
  },
  {
    id: "d3",
    name: "Dr. P. Reddy",
    credentials: "MS Ortho, Fellowship Joint Replacement",
    specialtyId: "orthopedics",
    specialtyName: "Orthopedics",
    opdDays: ["Tue", "Wed", "Fri", "Sat"],
    room: "Cabin 108",
    fee: 600,
    experience: 15,
    available: true,
    rating: 4.7,
  },
  {
    id: "d4",
    name: "Dr. S. Iyer",
    credentials: "MD Pediatrics, Fellowship Neonatology",
    specialtyId: "pediatrics",
    specialtyName: "Pediatrics",
    opdDays: ["Mon", "Tue", "Thu", "Fri"],
    room: "Cabin 112",
    fee: 500,
    experience: 12,
    available: true,
    rating: 4.8,
  },
  {
    id: "d5",
    name: "Dr. L. Nair",
    credentials: "MS OB-GYN, Fellowship High-Risk Pregnancy",
    specialtyId: "gynecology",
    specialtyName: "Gynecology & Obstetrics",
    opdDays: ["Mon", "Wed", "Thu", "Sat"],
    room: "Cabin 205",
    fee: 700,
    experience: 20,
    available: false,
    rating: 4.9,
  },
  {
    id: "d6",
    name: "Dr. M. Khan",
    credentials: "MD Dermatology, Fellowship Cosmetic",
    specialtyId: "dermatology",
    specialtyName: "Dermatology",
    opdDays: ["Tue", "Wed", "Fri"],
    room: "Cabin 110",
    fee: 550,
    experience: 10,
    available: true,
    rating: 4.6,
  },
];

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
    turnaround: "< 60 min pre-auth",
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
    turnaround: "< 60 min pre-auth",
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
    turnaround: "< 75 min pre-auth",
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
    turnaround: "< 60 min pre-auth",
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
    turnaround: "< 60 min pre-auth",
  },
];

export const departments: Department[] = [
  {
    id: "trauma",
    name: "Trauma & C-Arm Surgery",
    shortName: "Trauma",
    description:
      "24/7 Level-1 trauma center with advanced C-arm image intensifier for real-time intraoperative imaging. Rapid-response team for polytrauma, fractures, and orthopedic emergencies.",
    icon: "ambulance",
    color: "rose",
    accent: "#f43f5e",
    wing: "Wing A — Emergency Block",
    floor: "Ground Floor",
    stats: [
      { label: "Response Time", value: "< 8 min" },
      { label: "Surgeons On Call", value: "6" },
      { label: "Trauma Beds", value: "14" },
    ],
    features: [
      "C-arm image intensifier",
      "Polytrauma rapid-response unit",
      "24/7 orthopedic surgery",
      "ICU backup integration",
    ],
    bentoSpan: "md:col-span-2 md:row-span-2",
    highlight: true,
  },
  {
    id: "maternity",
    name: "Maternity & Women's Health",
    shortName: "Maternity",
    description:
      "State-of-the-art labor suites with fetal monitoring, painless delivery options, and dedicated NICU support for high-risk pregnancies.",
    icon: "baby",
    color: "pink",
    accent: "#ec4899",
    wing: "Wing B — Maternity Block",
    floor: "2nd Floor",
    stats: [
      { label: "Labor Suites", value: "8" },
      { label: "NICU Beds", value: "12" },
      { label: "Delivers / mo", value: "120+" },
    ],
    features: [
      "Fetal monitoring",
      "Painless delivery",
      "Level-3 NICU",
      "Lactation consulting",
    ],
    bentoSpan: "md:col-span-2",
  },
  {
    id: "cashless-tpa",
    name: "Cashless Insurance / TPA Desk",
    shortName: "Cashless",
    description:
      "Empanelled with leading private insurers and TPA partners for seamless cashless treatment. Dedicated pre-authorization desk with rapid claim processing.",
    icon: "shield-check",
    color: "teal",
    accent: "#0d9488",
    wing: "Wing C — Administration",
    floor: "1st Floor",
    stats: [
      { label: "Insurers", value: "5+" },
      { label: "Pre-Auth TAT", value: "< 60 min" },
      { label: "Approval Rate", value: "96%" },
    ],
    features: [
      "Private insurance empanelled",
      "Cashless TPA desk",
      "Dedicated claim officer",
      "On-spot eligibility check",
    ],
    bentoSpan: "md:col-span-2",
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology & Eye Care",
    shortName: "Eye Care",
    description:
      "Comprehensive eye care including phacoemulsification, LASIK, and diabetic retinopathy management with advanced slit-lamp and OCT imaging.",
    icon: "eye",
    color: "sky",
    accent: "#0ea5e9",
    wing: "Wing D — Specialty OPD",
    floor: "3rd Floor",
    stats: [
      { label: "OCT Scans / day", value: "30+" },
      { label: "Surgeries / mo", value: "80" },
      { label: "Consultants", value: "4" },
    ],
    features: [
      "Phacoemulsification",
      "LASIK & refractive",
      "Diabetic retinopathy",
      "OCT imaging",
    ],
    bentoSpan: "md:col-span-1",
  },
  {
    id: "ctscan",
    name: "CT Scan & Diagnostics",
    shortName: "CT Scan",
    description:
      "128-slice CT scanner with low-dose protocols. 24/7 radiology reporting with sub-30-minute turnaround for emergency scans.",
    icon: "scan-line",
    color: "indigo",
    accent: "#6366f1",
    wing: "Wing E — Diagnostics",
    floor: "Ground Floor",
    stats: [
      { label: "Slice Scanner", value: "128" },
      { label: "Report TAT", value: "< 30 min" },
      { label: "Scans / day", value: "60+" },
    ],
    features: [
      "128-slice CT",
      "Low-dose protocol",
      "24/7 radiology",
      "Contrast studies",
    ],
    bentoSpan: "md:col-span-1",
  },
];

export const opdQueue: QueuePatient[] = [
  {
    id: "q1",
    token: "A-014",
    patientName: "R. Sharma",
    department: "General Medicine",
    status: "in-consult",
    waitMinutes: 0,
  },
  {
    id: "q2",
    token: "A-015",
    patientName: "K. Reddy",
    department: "Orthopedics",
    status: "next",
    waitMinutes: 3,
  },
  {
    id: "q3",
    token: "A-016",
    patientName: "S. Iyer",
    department: "Cardiology",
    status: "waiting",
    waitMinutes: 12,
  },
  {
    id: "q4",
    token: "A-017",
    patientName: "M. Khan",
    department: "Dermatology",
    status: "waiting",
    waitMinutes: 18,
  },
  {
    id: "q5",
    token: "A-018",
    patientName: "P. Nair",
    department: "Pediatrics",
    status: "waiting",
    waitMinutes: 25,
  },
];

export const timeSlots: TimeSlot[] = [
  { id: "s1", time: "09:00", label: "Morning", available: true, doctorCount: 3 },
  { id: "s2", time: "10:00", label: "Morning", available: true, doctorCount: 2 },
  { id: "s3", time: "11:00", label: "Morning", available: false, doctorCount: 0 },
  { id: "s4", time: "12:00", label: "Morning", available: true, doctorCount: 1 },
  { id: "s5", time: "14:00", label: "Afternoon", available: true, doctorCount: 4 },
  { id: "s6", time: "15:00", label: "Afternoon", available: true, doctorCount: 3 },
  { id: "s7", time: "16:00", label: "Afternoon", available: false, doctorCount: 0 },
  { id: "s8", time: "17:00", label: "Evening", available: true, doctorCount: 5 },
  { id: "s9", time: "18:00", label: "Evening", available: true, doctorCount: 2 },
  { id: "s10", time: "19:00", label: "Evening", available: true, doctorCount: 1 },
];

export const emergencyContacts = [
  { label: "Ambulance", number: "1066", icon: "ambulance" },
  { label: "Emergency Casualty", number: "+91 87492 73030", icon: "phone-call" },
  { label: "NICU", number: "+91 87492 73035", icon: "baby" },
];
