import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Activity,
  Phone,
  Stethoscope,
  Zap,
  Ambulance,
  ShieldCheck,
  Calendar,
  MapPin,
  AlertTriangle,
  PhoneCall,
  ChevronRight,
  Search,
  Navigation,
  Tag,
  FlaskConical,
} from 'lucide-react';
import { useOpdQueue } from '@/hooks/useOpdQueue';
import {
  hospitalInfo,
  insuranceProviders,
  doctors,
  opdSpecialties,
  familyPhysician,
  facilities,
  branches,
} from '@/data/mockData';
import { formatSession } from '@/lib/dates';

type Lang = 'en' | 'te';

interface CareBotProps {
  onGenerateToken: () => void;
  onBookAppointment: (specialtyId?: string) => void;
  onCheckEligibility: () => void;
  /** Controlled open state when launcher is hosted in FloatingDock */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideLauncher?: boolean;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  lang: Lang;
  type?: 'text' | 'emergency' | 'token' | 'department' | 'eligibility' | 'quick-reply' | 'offers';
  data?: Record<string, unknown>;
  quickReplies?: QuickReplyKey[];
}

type QuickReplyKey =
  | 'check_token' | 'book_ambulance' | 'book_appt' | 'cashless_tpa'
  | 'open_live_token' | 'star_health' | 'icici_lombard' | 'mediassist'
  | 'care_health' | 'hdfc_ergo' | 'other_tpa' | 'open_full_checker'
  | 'casualty_location' | 'book_ortho' | 'call_casualty' | 'navigate_casualty'
  | 'call_reception' | 'find_doctor'
  | 'special_offers' | 'call_appointment' | 'book_lab_test';

// ─── Translations ──────────────────────────────────────────────

const scheduleText = [
  `Family physician: ${formatSession(familyPhysician)} (walk in)`,
  ...opdSpecialties.map((s) => `${s.name}: ${formatSession(s)}`),
].join('; ');
const facilityText = facilities.map((f) => f.name).join(', ');
const [madhira, vijayawada] = branches;

const T = {
  en: {
    greeting: `Hello! I am CareBot, your 24/7 AKR Super Speciality Hospitals assistant. How can I assist you today?`,
    online: 'Online · 24/7',
    placeholder: 'Ask CareBot anything...',
    typing: 'CareBot is typing...',
    // Quick chips
    qr_check_token: 'Check Live Token',
    qr_book_ambulance: 'Emergency / Ambulance',
    qr_book_appt: 'Book Appointment',
    qr_cashless_tpa: 'Cashless TPA Desk',
    qr_open_live_token: 'Open Live Token',
    qr_star_health: 'Star Health',
    qr_icici_lombard: 'ICICI Lombard',
    qr_mediassist: 'MediAssist',
    qr_care_health: 'Care Health',
    qr_hdfc_ergo: 'HDFC ERGO',
    qr_other_tpa: 'Other Corporate TPA',
    qr_open_full_checker: 'Open Full Checker',
    qr_casualty_location: 'Casualty Location',
    qr_book_ortho: 'Book OPD Slot',
    qr_call_casualty: 'Call Casualty',
    qr_navigate_casualty: 'Navigate to Casualty',
    qr_call_reception: 'Call Reception',
    qr_find_doctor: 'Find Doctor',
    // Persistent toolbar
    tb_live_queue: 'Live Queue',
    tb_call_reception: 'Call Reception',
    tb_find_doctor: 'Find Doctor',
    // Emergency
    emergency_title: 'CRITICAL EMERGENCY DETECTED',
    emergency_msg: `CRITICAL EMERGENCY DETECTED. Call our 24/7 Casualty & hospital ambulance (+91 87492 73030) immediately, or 108 for a government ambulance. Our emergency team is at Didugupadu, Madhira.`,
    emergency_btn: 'Call Casualty Now',
    emergency_navigate: 'Navigate to Casualty',
    // Token flow
    token_response: (serving: string, paused: boolean) =>
      `Reception is now serving token ${serving}.${paused ? ' The queue is paused briefly.' : ''} Open the queue tracker and enter the number on your reception slip to see how many patients are ahead of you.`,
    token_not_live: `The live OPD queue isn't published right now. Please ask at reception or call ${hospitalInfo.phone} for your turn.`,
    token_opening: 'Opening your live token tracker now...',
    token_currently_serving: 'Currently Serving',
    token_paused: 'Queue is paused',
    // Trauma flow
    trauma_response: `For acute fractures or trauma, come to our 24/7 casualty immediately — a family physician is on duty round the clock. For a follow-up visit, request a General Medicine OPD appointment.`,
    trauma_book_slot: 'Book Slot',
    trauma_casualty_loc: 'Directions',
    trauma_nav_msg: `Tap here to open Google Maps directions to ${hospitalInfo.name} (${hospitalInfo.landmark}).`,
    // Eligibility flow
    eligibility_intro: `I can help with cashless insurance. Our TPA desk works with Star Health, ICICI Lombard, MediAssist, Care Health, and HDFC ERGO. Please select your insurance provider below.`,
    eligibility_provider: (name: string, procedures: string, docs: string) =>
      `${name} — commonly covered: ${procedures}. Coverage depends on your policy, so please confirm with our TPA desk (${hospitalInfo.phone}). Bring: ${docs}.`,
    eligibility_guidance: `Planned inpatient procedures may be covered after pre-authorisation, depending on your policy. Please bring your insurance card and doctor's admission advice to the TPA desk.`,
    eligibility_open_checker: 'Open Full Eligibility Checker',
    eligibility_not_found: `I couldn't find that provider. Please try one of the listed providers.`,
    // Misc
    book_appt_msg: 'Opening the appointment request form. Choose your department and a preferred time — reception will call you to confirm.',
    call_reception_msg: `You can reach our casualty & reception desk at ${hospitalInfo.phone} — answered 24/7. For Vijayawada, call ${vijayawada.name} at ${vijayawada.phones[0].display}.`,
    find_doctor_msg: (docList: string) => `Our listed consultants: ${docList}. For other specialties, call reception at ${hospitalInfo.phone}. Would you like to request an appointment?`,
    fallback: `Sorry, I didn't catch that. I can help with: tracking your OPD token, emergency triage, department guidance, booking appointments, or checking insurance eligibility. Could you rephrase, or try one of the quick options below?`,
    opening_checker: 'Opening the full cashless eligibility checker...',
    casualty_msg: `Call our 24/7 Casualty & hospital ambulance at +91 87492 73030, or 108 for a government ambulance.`,
    casualty_loc_msg: `Casualty is at ${hospitalInfo.name}, ${hospitalInfo.landmark} — ${hospitalInfo.address}. Tap "Directions" to open Google Maps.`,
    // Special offers
    qr_special_offers: '🏷️ Special Offers & Discounts',
    qr_call_appointment: '📞 Call: +91 98490 57185',
    qr_book_lab_test: '🧪 Book Lab Test (30% Off)',
    offers_title: 'Special Offers & Discounts',
    offers_summary: 'Current offers: 1) Free OP with Dr. Kondal Rao, 2) 30% off Lab tests, 3) 20% off Pharmacy, and 4) ₹20 Blood Sugar check.',
    offers_call: 'Call: +91 98490 57185',
    offers_lab: 'Book Lab Test (30% Off)',
    // Q&A knowledge base
    qa_1: `The hospital was founded in ${hospitalInfo.established} by **Dr. A. Kondal Rao**, our Founder & Chief Physician and former DM&HO, Khammam.`,
    fee_msg: `Dr. Kondal Rao's OP consultation is free. Fees for other consultants vary — reception confirms the fee when they call you back, or call ${hospitalInfo.phone}.`,
    qa_2: `Yes! We provide **Free OP Consultation** with Dr. Kondal Rao as part of our community healthcare initiative. Book via the bot or call +91 98490 57185.`,
    qa_3: `Yes, we offer a flat **30% discount on all Laboratory Tests** at our computerized diagnostic center.`,
    qa_4: `Random/Fasting Blood Sugar tests are available at just **₹20/-**.`,
    qa_5: `Yes, our 24/7 in-house pharmacy offers a **20% discount on medicines** on valid prescriptions.`,
    qa_6: `You can call our direct appointment desk directly at **+91 98490 57185** or request an appointment on this website.`,
    qa_7: `Yes, ${hospitalInfo.name} is open **24 Hours (24/7)** for Casualty, Emergency Trauma, Pharmacy, Ambulance and Inpatient services, with a family physician on duty round the clock.`,
    qa_8: `We are located **Opposite Susheela College, Wyra Road, Madhira** (Samatha Nagar / Didugupadu). Tap 'Directions' to open Google Maps.`,
    qa_9: `Current offers: 1) Free OP with Dr. Kondal Rao, 2) 30% off Lab tests, 3) 20% off Pharmacy, and 4) ₹20 Blood Sugar check.`,
    qa_10: `OPD timings at Madhira — ${scheduleText}. Casualty, pharmacy and ambulance are open 24/7.`,
    facilities_msg: `Facilities at ${hospitalInfo.name}, Madhira: ${facilityText}.`,
    branches_msg: `We have two hospitals: **${madhira.name}** in Madhira (${madhira.phones[0].display}) and our sister hospital **${vijayawada.name}**, ${vijayawada.address} (${vijayawada.phones[0].display}). Online appointment requests are for Madhira; for Vijayawada please call.`,
  },
  te: {
    greeting: `నమస్కారం! నేను కేర్‌బాట్ (CareBot), మీ 24/7 AKR సూపర్ స్పెషాలిటీ హాస్పిటల్స్ సహాయకుడిని. మీకు ఎలా సహాయపడగలను?`,
    online: 'ఆన్‌లైన్ · 24/7',
    placeholder: 'కేర్‌బాట్‌ను అడగండి...',
    typing: 'కేర్‌బాట్ టైప్ చేస్తోంది...',
    qr_check_token: 'లైవ్ టోకెన్ స్థితి',
    qr_book_ambulance: 'అత్యవసరం / అంబులెన్స్',
    qr_book_appt: 'అపాయింట్‌మెంట్ బుకింగ్',
    qr_cashless_tpa: 'క్యాష్‌లెస్ TPA డెస్క్',
    qr_open_live_token: 'లైవ్ టోకెన్ తెరవండి',
    qr_star_health: 'Star Health',
    qr_icici_lombard: 'ICICI Lombard',
    qr_mediassist: 'MediAssist',
    qr_care_health: 'Care Health',
    qr_hdfc_ergo: 'HDFC ERGO',
    qr_other_tpa: 'ఇతర కార్పొరేట్ TPA',
    qr_open_full_checker: 'పూర్తి చెకర్ తెరవండి',
    qr_casualty_location: 'క్యాజువాలిటీ స్థానం',
    qr_book_ortho: 'OPD స్లాట్ బుక్ చేయండి',
    qr_call_casualty: 'క్యాజువాలిటీ కాల్',
    qr_navigate_casualty: 'క్యాజువాలిటీకి నావిగేట్',
    qr_call_reception: 'రిసెప్షన్ కాల్',
    qr_find_doctor: 'వైద్యులు',
    tb_live_queue: 'లైవ్ క్యూ',
    tb_call_reception: 'రిసెప్షన్ కాల్',
    tb_find_doctor: 'వైద్యులు',
    emergency_title: 'అత్యవసర పరిస్థితి (EMERGENCY)',
    emergency_msg: `అత్యవసర పరిస్థితి (EMERGENCY). వెంటనే మా 24/7 క్యాజువాలిటీ & ఆసుపత్రి అంబులెన్స్ +91 87492 73030 కు కాల్ చేయండి, లేదా ప్రభుత్వ అంబులెన్స్ కోసం 108 కు కాల్ చేయండి. మా అత్యవసర విభాగం దిడుగుపాడు, మధిరలో 24/7 అందుబాటులో ఉంది.`,
    emergency_btn: 'అత్యవసర కాల్ చేయండి',
    emergency_navigate: 'క్యాజువాలిటీకి నావిగేట్',
    token_response: (serving: string, paused: boolean) =>
      `రిసెప్షన్‌లో ప్రస్తుతం టోకెన్ ${serving} నడుస్తోంది.${paused ? ' క్యూ కొద్దిసేపు నిలిపివేయబడింది.' : ''} మీ కంటే ముందు ఎంత మంది ఉన్నారో చూడటానికి క్యూ ట్రాకర్ తెరిచి మీ రిసెప్షన్ స్లిప్‌లోని నంబర్ నమోదు చేయండి.`,
    token_not_live: `లైవ్ OPD క్యూ ప్రస్తుతం అందుబాటులో లేదు. మీ వంతు కోసం దయచేసి రిసెప్షన్‌లో అడగండి లేదా ${hospitalInfo.phone} కు కాల్ చేయండి.`,
    token_opening: 'మీ లైవ్ టోకెన్ ట్రాకర్‌ను తెరుస్తోంది...',
    token_currently_serving: 'ప్రస్తుతం నడుస్తున్నది',
    token_paused: 'క్యూ నిలిపివేయబడింది',
    trauma_response: `తీవ్రమైన ఎముకల గాయాలు మరియు ప్రమాదాల కోసం వెంటనే మా 24/7 క్యాజువాలిటీకి రండి. సాధారణ సమస్యల కోసం OPD అపాయింట్‌మెంట్ కోరండి.`,
    trauma_book_slot: 'స్లాట్ బుక్ చేయండి',
    trauma_casualty_loc: 'దారి',
    trauma_nav_msg: `ఇక్కడ క్లిక్ చేసి ${hospitalInfo.name} కు Google Maps ద్వారా దారి చూడండి (${hospitalInfo.landmark}).`,
    eligibility_intro: `మీ క్యాష్‌లెస్ ఇన్సూరెన్స్ అర్హతను నేను తనిఖీ చేయగలను. మా TPA డెస్క్ Star Health, ICICI Lombard, MediAssist, Care Health, మరియు HDFC ERGO తో పనిచేస్తుంది. దయచేసి మీ ఇన్సూరెన్స్ ప్రొవైడర్‌ను ఎంచుకోండి.`,
    eligibility_provider: (name: string, procedures: string, docs: string) =>
      `${name} — సాధారణంగా కవర్ అయ్యేవి: ${procedures}. కవరేజ్ మీ పాలసీపై ఆధారపడి ఉంటుంది, దయచేసి మా TPA డెస్క్ (${hospitalInfo.phone}) వద్ద నిర్ధారించుకోండి. తీసుకురావలసినవి: ${docs}.`,
    eligibility_guidance: `అనుమతించబడిన ప్రైవేట్ ఇన్సూరెన్స్ పాలసీల ద్వారా క్యాష్‌లెస్ చికిత్స అందుబాటులో ఉంది. మా TPA డెస్క్ వద్ద మీ ఇన్సూరెన్స్ కార్డ్ మరియు అడ్మిషన్ లెటర్ సమర్పించండి.`,
    eligibility_open_checker: 'పూర్తి ఎలిజిబిలిటీ చెకర్ తెరవండి',
    eligibility_not_found: `ఆ ప్రొవైడర్ కనుగొనబడలేదు. దయచేసి జాబితాలోని ప్రొవైడర్‌లలో ఒకదానిని ప్రయత్నించండి.`,
    book_appt_msg: 'అపాయింట్‌మెంట్ అభ్యర్థన ఫారమ్‌ను తెరుస్తోంది. మీ విభాగం మరియు అనుకూల సమయాన్ని ఎంచుకోండి — నిర్ధారణ కోసం రిసెప్షన్ మీకు కాల్ చేస్తుంది.',
    call_reception_msg: `మా క్యాజువాలిటీ & రిసెప్షన్‌ను ${hospitalInfo.phone} వద్ద 24 గంటలూ చేరుకోవచ్చు. విజయవాడ కోసం ${vijayawada.name} కు ${vijayawada.phones[0].display} వద్ద కాల్ చేయండి.`,
    find_doctor_msg: (docList: string) => `మా వైద్యులు: ${docList}. ఇతర విభాగాల కోసం రిసెప్షన్‌కు ${hospitalInfo.phone} కు కాల్ చేయండి. అపాయింట్‌మెంట్ కోరాలా?`,
    fallback: `క్షమించండి, అర్థం కాలేదు. నేను సహాయపడగలిగే అంశాలు: OPD టోకెన్ ట్రాకింగ్, అత్యవసర ట్రయేజ్, విభాగ మార్గదర్శనం, అపాయింట్‌మెంట్ బుకింగ్, లేదా ఇన్సూరెన్స్ అర్హత. దయచేసి మళ్లీ చెప్పండి లేదా కింది ఆప్షన్‌లను ప్రయత్నించండి.`,
    opening_checker: 'పూర్తి క్యాష్‌లెస్ ఎలిజిబిలిటీ చెకర్‌ను తెరుస్తోంది...',
    casualty_msg: `మా 24/7 క్యాజువాలిటీ & ఆసుపత్రి అంబులెన్స్ +91 87492 73030 కు లేదా ప్రభుత్వ అంబులెన్స్ కోసం 108 కు కాల్ చేయండి.`,
    casualty_loc_msg: `క్యాజువాలిటీ ${hospitalInfo.name} లో ఉంది (${hospitalInfo.landmark}) — ${hospitalInfo.address}. Google Maps కోసం "దారి" నొక్కండి.`,
    // Special offers
    qr_special_offers: '🏷️ ప్రత్యేక ఆఫర్లు & తగ్గింపులు',
    qr_call_appointment: '📞 కాల్: +91 98490 57185',
    qr_book_lab_test: '🧪 ల్యాబ్ పరీక్ష (30% తగ్గింపు)',
    offers_title: 'ప్రత్యేక ఆఫర్లు & తగ్గింపులు',
    offers_summary: 'ప్రత్యేక ఆఫర్లు: 1) డా॥ కొండల్ రావు గారి ఉచిత OP, 2) ల్యాబ్‌లో 30% తగ్గింపు, 3) మెడికల్ షాపులో 20% తగ్గింపు, 4) కేవలం ₹20/- లకే షుగర్ పరీక్ష.',
    offers_call: 'కాల్: +91 98490 57185',
    offers_lab: 'ల్యాబ్ పరీక్ష బుక్ చేయండి (30% తగ్గింపు)',
    // Q&A knowledge base
    qa_1: `మా ఆసుపత్రిని ${hospitalInfo.established} లో వ్యవస్థాపకులు & చీఫ్ ఫిజీషియన్ **డా॥ ఎ. కొండల్ రావు గారు** (మాజీ DM&HO, ఖమ్మం) స్థాపించారు.`,
    fee_msg: `డా॥ కొండల్ రావు గారి OP కన్సల్టేషన్ ఉచితం. ఇతర వైద్యుల ఫీజు వేర్వేరుగా ఉంటుంది — రిసెప్షన్ మీకు కాల్ చేసినప్పుడు ఫీజు తెలియజేస్తారు, లేదా ${hospitalInfo.phone} కు కాల్ చేయండి.`,
    qa_2: `అవును! మా ప్రత్యేక ఆఫర్ కింద **డా॥ కొండల్ రావు గారిచే ఉచిత OP కన్సల్టేషన్** అందించబడుతోంది. అపాయింట్‌మెంట్ కోసం 9849057185 నంబర్‌ను సంప్రదించండి.`,
    qa_3: `అవును, మా కంప్యూటరైజ్డ్ లేబరేటరీలో చేసే అన్ని రకాల రక్త మరియు వ్యాధి నిర్ధారణ పరీక్షలపై **30% తగ్గింపు** లభిస్తుంది.`,
    qa_4: `మా వద్ద కేవలం **₹20/- లకే షుగర్ పరీక్ష** చేయబడుతుంది.`,
    qa_5: `అవును, మా 24 గంటల మెడికల్ షాపులో ప్రిస్క్రిప్షన్ మందులపై **20% తగ్గింపు** పొందవచ్చు.`,
    qa_6: `మీరు నేరుగా మా అపాయింట్‌‌మెంట్ విభాగం నంబర్ **9849057185** కు కాల్ చేసి సమయం తీసుకోవచ్చు.`,
    qa_7: `అవును, మా ఆసుపత్రి ఎమర్జెన్సీ, ట్రామా, మెడికల్ షాప్ మరియు ఇన్-పేషెంట్ విభాగాలతో **24 గంటలు అందుబాటులో** ఉంటుంది.`,
    qa_8: `మా ఆసుపత్రి **సుశీల కళాశాల ఎదురుగా, వైరా రోడ్, మధిర** వద్ద కలదు. గూగుల్ మ్యాప్స్ కోసం 'దారి' బటన్ నొక్కండి.`,
    qa_9: `ప్రత్యేక ఆఫర్లు: 1) డా॥ కొండల్ రావు గారి ఉచిత OP, 2) ల్యాబ్‌లో 30% తగ్గింపు, 3) మెడికల్ షాపులో 20% తగ్గింపు, 4) కేవలం ₹20/- లకే షుగర్ పరీక్ష.`,
    qa_10: `మధిరలో OPD సమయాలు — ${scheduleText}. క్యాజువాలిటీ, మెడికల్ షాప్ మరియు అంబులెన్స్ 24 గంటలూ అందుబాటులో ఉంటాయి.`,
    facilities_msg: `మధిర ${hospitalInfo.name} లో అందుబాటులో ఉన్న సదుపాయాలు: ${facilityText}.`,
    branches_msg: `మాకు రెండు ఆసుపత్రులు ఉన్నాయి: మధిరలో **${madhira.name}** (${madhira.phones[0].display}) మరియు విజయవాడలో **${vijayawada.name}**, ${vijayawada.address} (${vijayawada.phones[0].display}). ఆన్‌లైన్ అపాయింట్‌మెంట్ మధిర కోసం మాత్రమే; విజయవాడ కోసం దయచేసి కాల్ చేయండి.`,
  },
} as const;

// ─── Keyword detection ─────────────────────────────────────────

const emergencyKeywordsEn = [
  'chest pain', 'cannot breathe', "can't breathe", 'breathing difficulty',
  'severe bleeding', 'unconscious', 'stroke', 'heart attack', 'suicide',
  'not breathing', 'choking', 'severe burn', 'drowning', 'seizure',
  'severe pain', 'collapsed', 'paralysis', 'poisoning', 'accident',
  'emergency', 'ambulance', 'urgent', '108',
];

const emergencyKeywordsTe = [
  'ఛాతీ నొప్పి', 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'ప్రమాదం', 'గుండెపోటు',
  'నిస్పృహ', 'రక్తస్రావం', 'మూర్ఛ', 'విషం', 'అత్యవసర', 'అంబులెన్స్',
];

const traumaKeywordsEn = [
  'broken arm', 'broken leg', 'fracture', 'fractured', 'bone injury',
  'open wound', 'deep cut', 'bleeding heavily', 'accident', 'sprain',
  'dislocation', 'trauma', 'c-arm', 'polytrauma',
];

const traumaKeywordsTe = [
  'ఎముక విరిగింది', 'గాయం', 'పగిలింది', 'దెబ్బ', 'ప్రమాదం',
];

const tokenKeywordsEn = ['token', 'queue', 'wait', 'my turn', 'where am i'];
const tokenKeywordsTe = ['టోకెన్', 'క్యూ', 'వేచి', 'స్థితి'];

const eligibilityKeywordsEn = [
  'cashless', 'insurance', 'tpa', 'star health', 'mediassist',
  'icici', 'empanelled', 'appendectomy', 'coverage', 'claim',
  'care health', 'hdfc', 'ergo',
];

const eligibilityKeywordsTe = [
  'క్యాష్‌లెస్', 'ఇన్సూరెన్స్', 'TPA', 'పాలసీ',
];

// ─── Q&A keyword groups (10 bilingual pairs) ─────────────────

const mdKeywordsEn = ['chief doctor', 'managing director', 'kondal rao', 'head doctor', 'who runs', 'who is the md', 'md of'];
const mdKeywordsTe = ['మేనేజింగ్ డైరెక్టర్', 'ముఖ్య వైద్యులు', 'కొండల్ రావు'];

const freeOpKeywordsEn = ['free consultation', 'free op', 'free checkup', 'free doctor', 'op free', 'consultation free'];
const freeOpKeywordsTe = ['ఉచిత op', 'ఉచితమేనా', 'ఉచిత కన్సల్టేషన్', 'ఉచిత'];

const sugarTestKeywordsEn = ['sugar test', 'diabetes test', 'blood sugar', 'glucose test', 'sugar check', 'sugar cost'];
const sugarTestKeywordsTe = ['షుగర్ పరీక్ష', 'గ్లూకోజ్', 'మధుమేహం', 'షుగర్'];

const labDiscountKeywordsEn = ['lab discount', 'blood test', 'diagnostic discount', 'lab test', 'lab work', 'lab test discount'];
const labDiscountKeywordsTe = ['ల్యాబ్ పరీక్షలపై', 'రక్త పరీక్ష', 'రాయితీలు', 'ల్యాబ్'];

const pharmacyKeywordsEn = ['pharmacy', 'medical shop', 'medicine discount', 'medicines', 'medical store'];
const pharmacyKeywordsTe = ['మెడికల్ షాపు', 'మందులపై', 'మందులు', 'మెడికల్ స్టోర్'];

const appointmentLineKeywordsEn = ['appointment number', 'direct phone', '9849057185', 'call for appointment', 'book kondal rao', 'kondal rao appointment'];
const appointmentLineKeywordsTe = ['అపాయింట్‌మెంట్ నంబర్', 'నేరుగా కాల్', 'నంబర్‌కు'];

const opTimingKeywordsEn = ['op timing', 'consultation time', 'op hours', 'when does op', 'op consultation timing', 'consultation timing', 'timing', 'timings', 'what time'];
const opTimingKeywordsTe = ['op సమయాలు', 'కన్సల్టేషన్ సమయాలు', 'సమయాలు'];

const hoursKeywordsEn = ['open at night', 'sunday', '24 hours', '24/7', 'operational hours', 'open today', 'open now', 'night', 'weekend'];
const hoursKeywordsTe = ['రాత్రి', 'ఆదివారం', '24 గంటలు', 'ఎప్పుడు తెరుస్తారు'];

const landmarkKeywordsEn = ['landmark', 'where is the hospital', 'how to reach', 'how do i get', 'susheela college', 'wyra road', 'address', 'location', 'directions', 'map'];
const landmarkKeywordsTe = ['ల్యాండ్‌మార్క్', 'ఎక్కడ', 'సమీప', 'సుశీల కళాశాల'];

const offersKeywordsEn = ['discounts', 'offers', 'packages', 'concessions', 'health checkup', 'special offer'];
const offersKeywordsTe = ['ఆఫర్లు', 'తగ్గింపులు', 'ప్యాకేజీలు', 'రాయితీ'];

const feeKeywordsEn = ['fee', 'fees', 'charges', 'cost', 'price'];
const feeKeywordsTe = ['ఫీజు', 'ఛార్జీ', 'ఖర్చు'];

const greetingKeywordsEn = ['hi', 'hello', 'hey', 'namaste', 'namaskaram'];
const greetingKeywordsTe = ['నమస్కారం', 'హలో'];

const facilityKeywordsEn = ['facilities', 'facility', 'equipment', 'ct', 'ct scan', 'x-ray', 'xray', 'echo', '2d echo', 'ecg', 'ultrasound', 'scan', 'laparoscopy', 'diagnostics'];
const facilityKeywordsTe = ['సదుపాయాలు', 'పరికరాలు', 'స్కాన్', 'ఎక్స్‌రే'];

const branchKeywordsEn = ['vijayawada', 'mahajan', 'branch', 'branches', 'other hospital'];
const branchKeywordsTe = ['విజయవాడ', 'మహాజన్', 'బ్రాంచ్'];

const doctorKeywords = ['doctor', 'specialist', 'consultant', 'urolog', 'kidney', 'prostate', 'cardio', 'surgeon', 'వైద్య', 'డాక్టర్'];

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => {
    const normalized = kw.toLowerCase().trim();
    // Prefer word-boundary match so short tokens like "cut" don't hit "acute"
    if (/^[a-z0-9+\-/]+$/i.test(normalized) && !normalized.includes(' ')) {
      try {
        return new RegExp(`(?:^|\\W)${normalized.replace(/[+/\\-]/g, '\\$&')}(?:$|\\W)`, 'i').test(text);
      } catch {
        return text.includes(normalized);
      }
    }
    return text.includes(normalized);
  });
}

function formatInlineBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Message factory ───────────────────────────────────────────

let messageIdCounter = 0;
function createMessage(
  sender: 'bot' | 'user',
  text: string,
  lang: Lang,
  type: Message['type'] = 'text',
  extra?: Partial<Message>
): Message {
  messageIdCounter += 1;
  return { id: `msg-${messageIdCounter}`, sender, text, lang, type, ...extra };
}

// ─── Quick reply metadata ──────────────────────────────────────

const quickReplyMeta: Record<QuickReplyKey, { icon: typeof Zap; color: string }> = {
  check_token: { icon: Zap, color: 'text-teal-700' },
  book_ambulance: { icon: Ambulance, color: 'text-rose-700' },
  book_appt: { icon: Calendar, color: 'text-emerald-700' },
  cashless_tpa: { icon: ShieldCheck, color: 'text-sky-700' },
  open_live_token: { icon: Activity, color: 'text-teal-700' },
  star_health: { icon: ShieldCheck, color: 'text-sky-700' },
  icici_lombard: { icon: ShieldCheck, color: 'text-indigo-700' },
  mediassist: { icon: ShieldCheck, color: 'text-indigo-700' },
  care_health: { icon: ShieldCheck, color: 'text-sky-700' },
  hdfc_ergo: { icon: ShieldCheck, color: 'text-indigo-700' },
  other_tpa: { icon: ShieldCheck, color: 'text-slate-600' },
  open_full_checker: { icon: Search, color: 'text-teal-700' },
  casualty_location: { icon: MapPin, color: 'text-rose-700' },
  book_ortho: { icon: Calendar, color: 'text-emerald-700' },
  call_casualty: { icon: PhoneCall, color: 'text-rose-700' },
  navigate_casualty: { icon: MapPin, color: 'text-rose-700' },
  call_reception: { icon: Phone, color: 'text-teal-700' },
  find_doctor: { icon: Stethoscope, color: 'text-teal-700' },
  special_offers: { icon: Tag, color: 'text-amber-700' },
  call_appointment: { icon: PhoneCall, color: 'text-teal-700' },
  book_lab_test: { icon: FlaskConical, color: 'text-sky-700' },
};

const initialQuickReplies: QuickReplyKey[] = [
  'check_token', 'book_ambulance', 'book_appt', 'cashless_tpa', 'special_offers',
];

const eligibilityQuickReplies: QuickReplyKey[] = [
  'star_health', 'icici_lombard', 'mediassist', 'care_health', 'hdfc_ergo', 'other_tpa',
];

// ─── Provider mapping ──────────────────────────────────────────

const providerQuickReplyMap: Record<string, QuickReplyKey> = {
  'star-health': 'star_health',
  'icici-lombard': 'icici_lombard',
  'mediassist': 'mediassist',
  'care-health': 'care_health',
  'hdfc-ergo': 'hdfc_ergo',
};

// ─── Component ─────────────────────────────────────────────────

export default function CareBot({
  onGenerateToken,
  onBookAppointment,
  onCheckEligibility,
  open: openProp,
  onOpenChange,
  hideLauncher = false,
}: CareBotProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = (value: boolean) => {
    onOpenChange?.(value);
    if (openProp === undefined) setInternalOpen(value);
  };
  const [lang, setLang] = useState<Lang>('en');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLive, currentTokenServed, isPaused } = useOpdQueue();

  const t = T[lang];

  // Initialize greeting when first opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        createMessage('bot', t.greeting, lang, 'text', { quickReplies: initialQuickReplies }),
      ]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Replies are stored as sent text, so a language switch greets again in the new language.
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const greeting = createMessage('bot', T[lang].greeting, lang, 'text', { quickReplies: initialQuickReplies });
      return prev.length === 1 ? [greeting] : [...prev, greeting];
    });
  }, [lang]);

  const addBotMessage = useCallback(
    (msg: Message) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, msg]);
      }, 600);
    },
    []
  );

  // ── Flow handlers ──────────────────────────────────────────

  const handleEmergency = useCallback(() => {
    addBotMessage(
      createMessage('bot', t.emergency_msg, lang, 'emergency', { quickReplies: [] })
    );
  }, [t, lang, addBotMessage]);

  const handleTokenQuery = useCallback(() => {
    if (!isLive) {
      addBotMessage(
        createMessage('bot', t.token_not_live, lang, 'text', {
          quickReplies: ['call_reception', 'book_appt'] as QuickReplyKey[],
        })
      );
      return;
    }
    const servingToken = `#${currentTokenServed}`;
    addBotMessage(
      createMessage('bot', t.token_response(servingToken, isPaused), lang, 'token', {
        data: { servingToken, isPaused },
        quickReplies: ['open_live_token', 'book_appt'] as QuickReplyKey[],
      })
    );
  }, [isLive, currentTokenServed, isPaused, t, lang, addBotMessage]);

  const handleTraumaQuery = useCallback(() => {
    addBotMessage(
      createMessage('bot', t.trauma_response, lang, 'department', {
        quickReplies: ['casualty_location', 'book_ortho'] as QuickReplyKey[],
      })
    );
  }, [t, lang, addBotMessage]);

  const handleEligibilityQuery = useCallback(() => {
    addBotMessage(
      createMessage('bot', t.eligibility_intro, lang, 'eligibility', {
        quickReplies: eligibilityQuickReplies,
      })
    );
  }, [t, lang, addBotMessage]);

  const handleEligibilityProvider = useCallback(
    (providerId: string) => {
      const provider = insuranceProviders.find((p) => p.id === providerId);
      if (!provider) {
        addBotMessage(createMessage('bot', t.eligibility_not_found, lang, 'text'));
        return;
      }
      const procedures = provider.coveredProcedures.join(', ');
      const docs = provider.deskRequirements.join(', ');
      addBotMessage(
        createMessage('bot', t.eligibility_provider(provider.name, procedures, docs), lang, 'eligibility', {
          quickReplies: ['open_full_checker', 'book_appt'] as QuickReplyKey[],
        })
      );
    },
    [t, lang, addBotMessage]
  );

  // ── Quick reply handler ────────────────────────────────────

  const handleQuickReply = useCallback(
    (key: QuickReplyKey) => {
      const userMsg = createMessage('user', T[lang][`qr_${key}`] as string, lang);
      setMessages((prev) => [...prev, userMsg]);

      switch (key) {
        case 'check_token':
          handleTokenQuery();
          break;
        case 'open_live_token':
          onGenerateToken();
          addBotMessage(createMessage('bot', t.token_opening, lang, 'text'));
          break;
        case 'book_ambulance':
        case 'call_casualty':
          addBotMessage(
            createMessage('bot', t.casualty_msg, lang, 'emergency', {
              quickReplies: ['navigate_casualty'] as QuickReplyKey[],
            })
          );
          break;
        case 'casualty_location':
        case 'navigate_casualty':
          addBotMessage(
            createMessage('bot', t.casualty_loc_msg, lang, 'department', {
              quickReplies: ['call_reception'] as QuickReplyKey[],
            })
          );
          break;
        case 'book_appt':
          onBookAppointment();
          addBotMessage(createMessage('bot', t.book_appt_msg, lang, 'text'));
          break;
        case 'book_ortho':
          onBookAppointment();
          addBotMessage(createMessage('bot', t.book_appt_msg, lang, 'text'));
          break;
        case 'cashless_tpa':
          handleEligibilityQuery();
          break;
        case 'star_health':
        case 'icici_lombard':
        case 'mediassist':
        case 'care_health':
        case 'hdfc_ergo': {
          const providerId = Object.entries(providerQuickReplyMap).find(
            ([, v]) => v === key
          )?.[0];
          if (providerId) handleEligibilityProvider(providerId);
          break;
        }
        case 'other_tpa':
          addBotMessage(createMessage('bot', t.eligibility_guidance, lang, 'eligibility', {
            quickReplies: ['open_full_checker', 'book_appt'] as QuickReplyKey[],
          }));
          break;
        case 'open_full_checker':
          onCheckEligibility();
          addBotMessage(createMessage('bot', t.opening_checker, lang, 'text'));
          break;
        case 'call_reception':
          addBotMessage(createMessage('bot', t.call_reception_msg, lang, 'text', {
            quickReplies: ['book_appt', 'check_token'] as QuickReplyKey[],
          }));
          break;
        case 'find_doctor': {
          const docList = doctors
            .map((d) => {
              const opd = opdSpecialties.find((s) => s.id === d.specialtyId);
              return `${d.name} (${d.specialtyName}${opd ? `, ${formatSession(opd)}` : ''})`;
            })
            .join('; ');
          addBotMessage(createMessage('bot', t.find_doctor_msg(docList), lang, 'text', {
            quickReplies: ['book_appt', 'check_token'] as QuickReplyKey[],
          }));
          break;
        }
        case 'special_offers':
          addBotMessage(
            createMessage('bot', t.offers_summary, lang, 'offers', {
              quickReplies: ['call_appointment', 'book_lab_test'] as QuickReplyKey[],
            })
          );
          break;
        case 'call_appointment':
          window.location.href = `tel:${hospitalInfo.appointmentLine.replace(/\s/g, '')}`;
          break;
        case 'book_lab_test':
          onBookAppointment();
          addBotMessage(createMessage('bot', t.book_appt_msg, lang, 'text'));
          break;
      }
    },
    [lang, t, addBotMessage, handleTokenQuery, handleEligibilityQuery, handleEligibilityProvider, onGenerateToken, onBookAppointment, onCheckEligibility]
  );

  // ── Text input handler ─────────────────────────────────────

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    const userMsg = createMessage('user', text, lang);
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const lower = text.toLowerCase();

    const isEmerg = matchesAny(lower, [...emergencyKeywordsEn, ...emergencyKeywordsTe]);
    const isTok = matchesAny(lower, [...tokenKeywordsEn, ...tokenKeywordsTe]);
    const isElig = matchesAny(lower, [...eligibilityKeywordsEn, ...eligibilityKeywordsTe]);
    const isTrauma = matchesAny(lower, [...traumaKeywordsEn, ...traumaKeywordsTe]);

    if (isEmerg) {
      handleEmergency();
    } else if (isTok) {
      handleTokenQuery();
    } else if (isElig) {
      handleEligibilityQuery();
    } else if (isTrauma) {
      handleTraumaQuery();
    } else if (matchesAny(lower, [...mdKeywordsEn, ...mdKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_1, lang, 'text', { quickReplies: ['book_appt', 'special_offers'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...freeOpKeywordsEn, ...freeOpKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_2, lang, 'text', { quickReplies: ['book_appt', 'call_appointment'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...sugarTestKeywordsEn, ...sugarTestKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_4, lang, 'text', { quickReplies: ['book_lab_test', 'special_offers'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...labDiscountKeywordsEn, ...labDiscountKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_3, lang, 'text', { quickReplies: ['book_lab_test', 'special_offers'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...pharmacyKeywordsEn, ...pharmacyKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_5, lang, 'text', { quickReplies: ['special_offers'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...appointmentLineKeywordsEn, ...appointmentLineKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_6, lang, 'text', { quickReplies: ['call_appointment', 'book_appt'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...opTimingKeywordsEn, ...opTimingKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_10, lang, 'text', { quickReplies: ['book_appt', 'check_token'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...hoursKeywordsEn, ...hoursKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_7, lang, 'text', { quickReplies: ['book_appt'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...landmarkKeywordsEn, ...landmarkKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_8, lang, 'department', { quickReplies: ['navigate_casualty', 'call_reception'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...offersKeywordsEn, ...offersKeywordsTe])) {
      addBotMessage(createMessage('bot', t.qa_9, lang, 'offers', { quickReplies: ['call_appointment', 'book_lab_test'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...branchKeywordsEn, ...branchKeywordsTe])) {
      addBotMessage(createMessage('bot', t.branches_msg, lang, 'text', { quickReplies: ['book_appt', 'call_reception'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...facilityKeywordsEn, ...facilityKeywordsTe])) {
      addBotMessage(createMessage('bot', t.facilities_msg, lang, 'text', { quickReplies: ['book_appt', 'special_offers'] as QuickReplyKey[] }));
    } else if (matchesAny(lower, [...feeKeywordsEn, ...feeKeywordsTe])) {
      addBotMessage(createMessage('bot', t.fee_msg, lang, 'text', { quickReplies: ['book_appt', 'call_reception'] as QuickReplyKey[] }));
    } else if (doctorKeywords.some((kw) => lower.includes(kw))) {
      handleQuickReply('find_doctor');
    } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('బుక్')) {
      handleQuickReply('book_appt');
    } else if (matchesAny(lower, [...greetingKeywordsEn, ...greetingKeywordsTe])) {
      addBotMessage(createMessage('bot', t.greeting, lang, 'text', { quickReplies: initialQuickReplies }));
    } else {
      addBotMessage(
        createMessage('bot', t.fallback, lang, 'text', {
          quickReplies: ['check_token', 'book_appt', 'cashless_tpa'] as QuickReplyKey[],
        })
      );
    }
  }, [input, lang, t, addBotMessage, handleEmergency, handleTokenQuery, handleEligibilityQuery, handleTraumaQuery, handleQuickReply]);

  // ─── Render ────────────────────────────────────────────────

  const receptionPhone = hospitalInfo.phone.replace(/\s/g, '');
  const emergencyPhone = hospitalInfo.ambulancePhone;
  const casualtyPhone = hospitalInfo.phone.replace(/\s/g, '');
  const mapsUrl = hospitalInfo.mapsDirectionsUrl;

  const persistentTools: { key: QuickReplyKey; label: string; icon: typeof Activity; action: () => void }[] = [
    { key: 'check_token', label: t.tb_live_queue, icon: Activity, action: () => handleQuickReply('check_token') },
    { key: 'call_reception', label: t.tb_call_reception, icon: Phone, action: () => { window.location.href = `tel:${receptionPhone}`; } },
    { key: 'find_doctor', label: t.tb_find_doctor, icon: Stethoscope, action: () => handleQuickReply('find_doctor') },
  ];

  return (
    <>
      {/* Floating launcher — skipped when FloatingDock hosts the trigger */}
      <AnimatePresence>
        {!hideLauncher && !open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-36 right-4 md:bottom-24 md:right-6 z-40 group"
            aria-label="Open CareBot"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-teal-400/35 rounded-full blur-xl animate-pulse" />
              <div className="relative w-14 h-14 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center overflow-hidden">
                <img src="/carebot-avatar.webp" alt="CareBot" width={40} height={40} className="w-full h-full object-cover" decoding="async" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-[60] w-full md:w-[400px] h-[100dvh] md:h-[600px] md:max-h-[80vh] bg-white/95 backdrop-blur-2xl border-0 md:border border-slate-200 md:rounded-2xl shadow-2xl shadow-slate-900/15 flex flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:pt-0 md:pb-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/90 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-teal-500/30">
                  <img src="/carebot-avatar.webp" alt="CareBot" width={40} height={40} className="w-full h-full object-cover" decoding="async" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div>
                  <div className="text-slate-900 font-semibold text-sm">CareBot</div>
                  <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {t.online}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language toggle */}
                <div className="inline-flex p-0.5 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-bold">
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1.5 rounded-full transition-all ${lang === 'en' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    aria-label="English"
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLang('te')}
                    className={`px-3 py-1.5 rounded-full transition-all ${lang === 'te' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    aria-label="Telugu"
                  >
                    తె
                  </button>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Close CareBot"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 scroll-smooth">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, x: lang === 'en' ? -8 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      lang={lang}
                      onQuickReply={handleQuickReply}
                      emergencyPhone={emergencyPhone}
                      casualtyPhone={casualtyPhone}
                      mapsUrl={mapsUrl}
                      onBookAppointment={onBookAppointment}
                      onCheckEligibility={onCheckEligibility}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <img src="/carebot-avatar.webp" alt="CareBot" width={40} height={40} className="w-full h-full object-cover" decoding="async" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-teal-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Persistent toolbar */}
            <div className="flex items-center justify-around px-4 py-2 border-t border-slate-200 bg-slate-50/90 shrink-0">
              {persistentTools.map((tool) => (
                <button
                  key={tool.key}
                  onClick={tool.action}
                  className="flex flex-col items-center gap-0.5 px-3 py-1 min-h-11 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <tool.icon className="w-4 h-4 text-slate-600 group-hover:text-teal-700 transition-colors" />
                  <span className="text-[11px] text-slate-600 group-hover:text-slate-900 transition-colors font-sans">{tool.label}</span>
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="px-3 py-3 border-t border-slate-200 bg-white/90 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  placeholder={t.placeholder}
                  className="flex-1 min-w-0 bg-white text-slate-900 text-base md:text-sm rounded-xl px-4 py-2.5 border border-slate-300 focus:border-teal-600 focus:outline-none transition-colors placeholder:text-slate-500 font-sans"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    input.trim()
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-teal-500/30'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Message bubble ────────────────────────────────────────────

function MessageBubble({
  message,
  lang,
  onQuickReply,
  emergencyPhone,
  casualtyPhone,
  mapsUrl,
  onBookAppointment,
  onCheckEligibility,
}: {
  message: Message;
  lang: Lang;
  onQuickReply: (key: QuickReplyKey) => void;
  emergencyPhone: string;
  casualtyPhone: string;
  mapsUrl: string;
  onBookAppointment: (specialtyId?: string) => void;
  onCheckEligibility: () => void;
}) {
  const t = T[lang];
  const isBot = message.sender === 'bot';

  if (!isBot) {
    return (
      <div className="flex justify-end">
        <div className="bg-teal-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] text-sm leading-relaxed font-sans">
          {message.text}
        </div>
      </div>
    );
  }

  // Render simple **bold** markers as <strong> (QA strings use markdown-lite)
  const displayText = formatInlineBold(message.text);

  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 shrink-0 mt-0.5">
        <img src="/carebot-avatar.webp" alt="CareBot" width={40} height={40} className="w-full h-full object-cover" decoding="async" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div
          className={`rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed font-sans ${
            message.type === 'emergency'
              ? 'bg-rose-50 border border-rose-200 text-slate-800'
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          {/* Emergency */}
          {message.type === 'emergency' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 motion-safe:animate-pulse" />
                {t.emergency_title}
              </div>
              <p>{displayText}</p>
              <a
                href={`tel:${casualtyPhone}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold bg-red-700 text-white hover:bg-red-800 transition-colors"
              >
                <PhoneCall className="w-5 h-5" />
                {t.emergency_btn} · {hospitalInfo.phone}
              </a>
              <a
                href={`tel:${emergencyPhone}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-slate-800 border border-slate-200 hover:border-rose-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-rose-600" />
                {hospitalInfo.ambulanceLabel}
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-slate-800 border border-slate-200 hover:border-rose-300 transition-colors"
              >
                <Navigation className="w-4 h-4 text-rose-600" />
                {t.emergency_navigate}
              </a>
            </div>
          )}

          {/* Token tracking */}
          {message.type === 'token' && (
            <div className="space-y-3">
              <p>{displayText}</p>
              {message.data && (
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{t.token_currently_serving}</span>
                    <span className="text-emerald-700 font-bold font-mono">{message.data.servingToken as string}</span>
                  </div>
                  {(message.data.isPaused as boolean) && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                      {t.token_paused}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Department */}
          {message.type === 'department' && (
            <div className="space-y-3">
              <p>{displayText}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 px-3 py-2 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {t.trauma_casualty_loc}
                </a>
                <button
                  onClick={() => onBookAppointment()}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {t.trauma_book_slot}
                </button>
              </div>
            </div>
          )}

          {/* Eligibility */}
          {message.type === 'eligibility' && (
            <div className="space-y-3">
              <p>{displayText}</p>
              <button
                onClick={onCheckEligibility}
                className="flex items-center gap-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 px-3 py-2 rounded-lg hover:bg-teal-100 transition-colors w-full justify-center"
              >
                <Search className="w-3.5 h-3.5" />
                {t.eligibility_open_checker}
              </button>
            </div>
          )}

          {/* Special offers */}
          {message.type === 'offers' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Tag className="w-4 h-4" />
                {t.offers_title}
              </div>
              <p>{displayText}</p>
              <a
                href={`tel:${hospitalInfo.appointmentLine.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                {t.offers_call}
              </a>
              <button
                onClick={() => onBookAppointment()}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-all"
              >
                <FlaskConical className="w-4 h-4" />
                {t.offers_lab}
              </button>
            </div>
          )}

          {/* Plain text */}
          {message.type === 'text' && (
            <p>{displayText}</p>
          )}

          {/* Quick replies */}
          {message.quickReplies && message.quickReplies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {message.quickReplies.map((key) => {
                const meta = quickReplyMeta[key] ?? { icon: ChevronRight, color: 'text-slate-600' };
                const label = T[lang][`qr_${key}`] as string;
                return (
                  <button
                    key={key}
                    onClick={() => onQuickReply(key)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-teal-400 text-slate-800 hover:text-teal-800 transition-all font-sans"
                  >
                    <meta.icon className={`w-3 h-3 ${meta.color}`} />
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
