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
  Users,
  Clock,
  ChevronRight,
  Search,
  Navigation,
  Tag,
  FlaskConical,
} from 'lucide-react';
import { useOpdQueue } from '@/hooks/useOpdQueue';
import { hospitalInfo, insuranceProviders, doctors } from '@/data/mockData';

type Lang = 'en' | 'te';

interface CareBotProps {
  onGenerateToken: () => void;
  onBookAppointment: () => void;
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

const T = {
  en: {
    greeting: `Hello! I am CareBot, your 24/7 AKR medical concierge. How can I assist you today?`,
    online: 'Online · 24/7',
    placeholder: 'Ask CareBot anything...',
    typing: 'CareBot is typing...',
    // Quick chips
    qr_check_token: 'Check Live Token',
    qr_book_ambulance: 'Book Ambulance',
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
    qr_book_ortho: 'Book Orthopedics Slot',
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
    emergency_msg: `CRITICAL EMERGENCY DETECTED. Call 1066 or our Emergency Casualty (+91 87492 73030) immediately. An emergency team is stationed at Didugupadu, Madhira.`,
    emergency_btn: 'Call Casualty Now',
    emergency_navigate: 'Navigate to Casualty',
    // Token flow
    token_response: (serving: string, ahead: number, wait: number, paused: boolean) =>
      `Token A-019, your status is Waiting. General Medicine (Cabin 104) is serving token ${serving}. There are ${ahead} patients ahead of you. Estimated wait: ~${wait} mins.${paused ? ' The queue is currently paused.' : ''}`,
    token_opening: 'Opening your live token tracker now...',
    token_currently_serving: 'Currently Serving',
    token_your_token: 'Your Token',
    token_ahead: 'ahead',
    token_paused: 'Queue is paused',
    // Trauma flow
    trauma_response: `For acute fractures or trauma, visit our 24/7 Level-1 Trauma unit on the Ground Floor immediately. For general orthopedic consultations, book an OPD slot.`,
    trauma_book_slot: 'Book Slot',
    trauma_casualty_loc: 'Casualty Location',
    trauma_nav_msg: `Tap here to open Google Maps directions to ${hospitalInfo.name}. The casualty entrance is Ground Floor, Wing A.`,
    // Eligibility flow
    eligibility_intro: `I can check your cashless insurance eligibility. We accept Star Health, ICICI Lombard, MediAssist, Care Health, and HDFC ERGO. Please select your insurance provider below.`,
    eligibility_provider: (name: string, procedures: string, docs: string, turnaround: string) =>
      `${name} — Empanelled. Covered procedures: ${procedures}. Pre-auth turnaround: ${turnaround}. Please present at the TPA Desk (1st Floor): ${docs}. You can also use the full eligibility checker for detailed verification.`,
    eligibility_guidance: `All planned inpatient procedures are covered under pre-authorization. Please present your insurance policy card and doctor's admission slip at the TPA Desk (1st Floor).`,
    eligibility_open_checker: 'Open Full Eligibility Checker',
    eligibility_not_found: `I couldn't find that provider. Please try one of the listed providers.`,
    // Misc
    book_appt_msg: 'Opening the OPD booking form. Choose your department, date, and time slot to schedule your consultation.',
    call_reception_msg: `You can reach reception at ${hospitalInfo.phone}. They're available 9 AM – 8 PM daily.`,
    find_doctor_msg: (docList: string) => `Here are our specialists on duty today: ${docList}. Would you like to book a slot with any of them?`,
    fallback: `I understand you're asking about that. I can help with: tracking your OPD token, emergency triage, department guidance, booking appointments, or checking insurance eligibility. Could you rephrase, or try one of the quick options below?`,
    opening_checker: 'Opening the full cashless eligibility checker...',
    casualty_msg: `Call 1066 now for ambulance dispatch. Our 24/7 emergency team will assist you immediately. The casualty entrance is on the Ground Floor.`,
    casualty_loc_msg: `Casualty is located at Ground Floor, Wing A — Emergency Block. ${hospitalInfo.address}. Tap "Navigate" to get directions.`,
    // Special offers
    qr_special_offers: '🏷️ Special Offers & Discounts',
    qr_call_appointment: '📞 Call: +91 98490 57185',
    qr_book_lab_test: '🧪 Book Lab Test (30% Off)',
    offers_title: 'Special Offers & Discounts',
    offers_summary: 'Current offers: 1) Free OP with Dr. Kondal Rao, 2) 30% off Lab tests, 3) 20% off Pharmacy, and 4) ₹20 Blood Sugar check.',
    offers_call: 'Call: +91 98490 57185',
    offers_lab: 'Book Lab Test (30% Off)',
    // Q&A knowledge base
    qa_1: `AKR Multi Speciality Hospital is headed by our Managing Director, **Dr. Kondal Rao**, offering expert clinical consultations and 24/7 care.`,
    qa_2: `Yes! We provide **Free OP Consultation** with Dr. Kondal Rao as part of our community healthcare initiative. Book via the bot or call +91 98490 57185.`,
    qa_3: `Yes, we offer a flat **30% discount on all Laboratory Tests** at our computerized diagnostic center.`,
    qa_4: `Random/Fasting Blood Sugar tests are available at just **₹20/-** with instant reporting.`,
    qa_5: `Yes, our 24/7 in-house pharmacy offers a **20% discount on medicines** on valid prescriptions.`,
    qa_6: `You can call our direct appointment desk directly at **+91 98490 57185** or book a slot right here in the app.`,
    qa_7: `Yes, Dr. AKR Hospital is operational **24 Hours (24/7)** for Casualty, Emergency Trauma, Pharmacy, and Inpatient services.`,
    qa_8: `We are located **Opposite Susheela College, Wyra Road, Madhira** (Samatha Nagar / Didugupadu). Tap 'Navigate' for Google Maps directions.`,
    qa_9: `Current offers: 1) Free OP with Dr. Kondal Rao, 2) 30% off Lab tests, 3) 20% off Pharmacy, and 4) ₹20 Blood Sugar check.`,
    qa_10: `Regular Outpatient (OP) timings are 9:00 AM to 8:00 PM daily. Emergency and casualty services remain open 24/7.`,
  },
  te: {
    greeting: `నమస్కారం! నేను కేర్‌బాట్ (CareBot), మీ 24/7 AKR హాస్పిటల్ సహాయకుడిని. మీకు ఎలా సహాయపడగలను?`,
    online: 'ఆన్‌లైన్ · 24/7',
    placeholder: 'కేర్‌బాట్‌ను అడగండి...',
    typing: 'కేర్‌బాట్ టైప్ చేస్తోంది...',
    qr_check_token: 'లైవ్ టోకెన్ స్థితి',
    qr_book_ambulance: 'అంబులెన్స్ కాల్',
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
    qr_book_ortho: 'ఆర్థో స్లాట్ బుక్ చేయండి',
    qr_call_casualty: 'క్యాజువాలిటీ కాల్',
    qr_navigate_casualty: 'క్యాజువాలిటీకి నావిగేట్',
    qr_call_reception: 'రిసెప్షన్ కాల్',
    qr_find_doctor: 'వైద్యులు',
    tb_live_queue: 'లైవ్ క్యూ',
    tb_call_reception: 'రిసెప్షన్ కాల్',
    tb_find_doctor: 'వైద్యులు',
    emergency_title: 'అత్యవసర పరిస్థితి (EMERGENCY)',
    emergency_msg: `అత్యవసర పరిస్థితి (EMERGENCY). వెంటనే మా ఎమర్జెన్సీ క్యాజువాలిటీ నంబర్ 1066 లేదా +91 87492 73030 కు కాల్ చేయండి. మా అత్యవసర విభాగం దిడుగుపాడు, మధిరలో 24/7 అందుబాటులో ఉంది.`,
    emergency_btn: 'అత్యవసర కాల్ చేయండి',
    emergency_navigate: 'క్యాజువాలిటీకి నావిగేట్',
    token_response: (serving: string, ahead: number, wait: number, paused: boolean) =>
      `టోకెన్ సంఖ్య A-019, మీ ప్రస్తుత స్థితి: వేచి ఉన్నారు (Waiting). జనరల్ మెడిసిన్ (క్యాబిన్ 104) లో ప్రస్తుత టోకెన్ ${serving} నడుస్తోంది. మీ కంటే ముందు ${ahead} గురు రోగులు ఉన్నారు. అంచనా సమయం: ~${wait} నిమిషాలు.${paused ? ' క్యూ ప్రస్తుతం నిలిపివేయబడింది.' : ''}`,
    token_opening: 'మీ లైవ్ టోకెన్ ట్రాకర్‌ను తెరుస్తోంది...',
    token_currently_serving: 'ప్రస్తుతం నడుస్తున్నది',
    token_your_token: 'మీ టోకెన్',
    token_ahead: 'ముందు ఉన్నారు',
    token_paused: 'క్యూ నిలిపివేయబడింది',
    trauma_response: `తీవ్రమైన ఎముకల గాయాలు మరియు ప్రమాదాల కోసం గ్రౌండ్ ఫ్లోర్‌లోని మా 24/7 లెవల్-1 ట్రామా కేర్ సెంటర్‌కు వెళ్లండి. సాధారణ సమస్యల కోసం ఓపీడీ (OPD) స్లాట్ బుక్ చేసుకోండి.`,
    trauma_book_slot: 'స్లాట్ బుక్ చేయండి',
    trauma_casualty_loc: 'క్యాజువాలిటీ స్థానం',
    trauma_nav_msg: `ఇక్కడ క్లిక్ చేసి ${hospitalInfo.name} కు Google Maps ద్వారా దారి చూడండి. క్యాజువాలిటీ ప్రవేశం గ్రౌండ్ ఫ్లోర్, Wing A.`,
    eligibility_intro: `మీ క్యాష్‌లెస్ ఇన్సూరెన్స్ అర్హతను నేను తనిఖీ చేయగలను. మేము Star Health, ICICI Lombard, MediAssist, Care Health, మరియు HDFC ERGO అంగీకరిస్తాము. దయచేసి మీ ఇన్సూరెన్స్ ప్రొవైడర్‌ను ఎంచుకోండి.`,
    eligibility_provider: (name: string, procedures: string, docs: string, turnaround: string) =>
      `${name} — అంగీకరించబడింది. కవర్ చేసిన విధానాలు: ${procedures}. ప్రీ-ఆథ్ సమయం: ${turnaround}. TPA డెస్క్ (1వ అంతస్తు) వద్ద సమర్పించండి: ${docs}. పూర్తి చెకర్ కోసం ఎలిజిబిలిటీ చెకర్ ఉపయోగించండి.`,
    eligibility_guidance: `అనుమతించబడిన ప్రైవేట్ ఇన్సూరెన్స్ పాలసీల ద్వారా క్యాష్‌లెస్ చికిత్స అందుబాటులో ఉంది. మొదటి అంతస్తులోని TPA డెస్క్ వద్ద మీ ఇన్సూరెన్స్ కార్డ్ మరియు అడ్మిషన్ లెటర్ సమర్పించండి.`,
    eligibility_open_checker: 'పూర్తి ఎలిజిబిలిటీ చెకర్ తెరవండి',
    eligibility_not_found: `ఆ ప్రొవైడర్ కనుగొనబడలేదు. దయచేసి జాబితాలోని ప్రొవైడర్‌లలో ఒకదానిని ప్రయత్నించండి.`,
    book_appt_msg: 'OPD బుకింగ్ ఫారమ్‌ను తెరుస్తోంది. మీ విభాగం, తేదీ, మరియు సమయ స్లాట్‌ను ఎంచుకోండి.',
    call_reception_msg: `రిసెప్షన్‌ను ${hospitalInfo.phone} వద్ద చేరుకోవచ్చు. రోజు 9 AM – 8 PM అందుబాటులో ఉంది.`,
    find_doctor_msg: (docList: string) => `ఈ రోజు విధుల్లో ఉన్న మా వైద్యులు: ${docList}. వారిలో ఎవరితోనైనా స్లాట్ బుక్ చేయాలా?`,
    fallback: `నేను అర్థం చేసుకున్నాను. నేను సహాయపడగలిగే అంశాలు: OPD టోకెన్ ట్రాకింగ్, అత్యవసర ట్రయేజ్, విభాగ మార్గదర్శనం, అపాయింట్‌మెంట్ బుకింగ్, లేదా ఇన్సూరెన్స్ అర్హత. దయచేసి మళ్లీ చెప్పండి లేదా కింది ఆప్షన్‌లను ప్రయత్నించండి.`,
    opening_checker: 'పూర్తి క్యాష్‌లెస్ ఎలిజిబిలిటీ చెకర్‌ను తెరుస్తోంది...',
    casualty_msg: `అంబులెన్స్ కోసం ఇప్పుడే 1066 కు కాల్ చేయండి. మా 24/7 అత్యవసర బృందం వెంటనే మీకు సహాయం చేస్తుంది. క్యాజువాలిటీ ప్రవేశం గ్రౌండ్ ఫ్లోర్‌లో ఉంది.`,
    casualty_loc_msg: `క్యాజువాలిటీ గ్రౌండ్ ఫ్లోర్, Wing A — ఎమర్జెన్సీ బ్లాక్‌లో ఉంది. ${hospitalInfo.address}. దారి కోసం "నావిగేట్" నొక్కండి.`,
    // Special offers
    qr_special_offers: '🏷️ ప్రత్యేక ఆఫర్లు & తగ్గింపులు',
    qr_call_appointment: '📞 కాల్: +91 98490 57185',
    qr_book_lab_test: '🧪 ల్యాబ్ పరీక్ష (30% తగ్గింపు)',
    offers_title: 'ప్రత్యేక ఆఫర్లు & తగ్గింపులు',
    offers_summary: 'ప్రత్యేక ఆఫర్లు: 1) డా॥ కొండల్ రావు గారి ఉచిత OP, 2) ల్యాబ్‌లో 30% తగ్గింపు, 3) మెడికల్ షాపులో 20% తగ్గింపు, 4) కేవలం ₹20/- లకే షుగర్ పరీక్ష.',
    offers_call: 'కాల్: +91 98490 57185',
    offers_lab: 'ల్యాబ్ పరీక్ష బుక్ చేయండి (30% తగ్గింపు)',
    // Q&A knowledge base
    qa_1: `మా ఆసుపత్రి మేనేజింగ్ డైరెక్టర్ **డా॥ కొండల్ రావు గారు**. వారి పర్యవేక్షణలో 24 గంటల నాణ్యమైన వైద్య సేవలు అందించబడుతున్నాయి.`,
    qa_2: `అవును! మా ప్రత్యేక ఆఫర్ కింద **డా॥ కొండల్ రావు గారిచే ఉచిత OP కన్సల్టేషన్** అందించబడుతోంది. అపాయింట్‌మెంట్ కోసం 9849057185 నంబర్‌ను సంప్రదించండి.`,
    qa_3: `అవును, మా కంప్యూటరైజ్డ్ లేబరేటరీలో చేసే అన్ని రకాల రక్త మరియు వ్యాధి నిర్ధారణ పరీక్షలపై **30% తగ్గింపు** లభిస్తుంది.`,
    qa_4: `మా వద్ద కేవలం **₹20/- లకే షుగర్ పరీక్ష** చేయబడుతుంది. రిపోర్టు వెంటనే ఇవ్వబడుతుంది.`,
    qa_5: `అవును, మా 24 గంటల మెడికల్ షాపులో ప్రిస్క్రిప్షన్ మందులపై **20% తగ్గింపు** పొందవచ్చు.`,
    qa_6: `మీరు నేరుగా మా అపాయింట్‌‌మెంట్ విభాగం నంబర్ **9849057185** కు కాల్ చేసి సమయం తీసుకోవచ్చు.`,
    qa_7: `అవును, మా ఆసుపత్రి ఎమర్జెన్సీ, ట్రామా, మెడికల్ షాప్ మరియు ఇన్-పేషెంట్ విభాగాలతో **24 గంటలు అందుబాటులో** ఉంటుంది.`,
    qa_8: `మా ఆసుపత్రి **సుశీల కళాశాల ఎదురుగా, వైరా రోడ్, మధిర** వద్ద కలదు. గూగుల్ మ్యాప్స్ దిశల కోసం 'దిశలు/దారి' బటన్ పై క్లిక్ చేయండి.`,
    qa_9: `ప్రత్యేక ఆఫర్లు: 1) డా॥ కొండల్ రావు గారి ఉచిత OP, 2) ల్యాబ్‌లో 30% తగ్గింపు, 3) మెడికల్ షాపులో 20% తగ్గింపు, 4) కేవలం ₹20/- లకే షుగర్ పరీక్ష.`,
    qa_10: `సాధారణ OP సమయాలు ప్రతిరోజూ ఉదయం 9:00 నుండి రాత్రి 8:00 వరకు. అత్యవసర సేవలు 24 గంటలూ అందుబాటులో ఉంటాయి.`,
  },
} as const;

// ─── Keyword detection ─────────────────────────────────────────

const emergencyKeywordsEn = [
  'chest pain', 'cannot breathe', "can't breathe", 'breathing difficulty',
  'severe bleeding', 'unconscious', 'stroke', 'heart attack', 'suicide',
  'not breathing', 'choking', 'severe burn', 'drowning', 'seizure',
  'severe pain', 'collapsed', 'paralysis', 'poisoning', 'accident',
];

const emergencyKeywordsTe = [
  'ఛాతీ నొప్పి', 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'ప్రమాదం', 'గుండెపోటు',
  'నిస్పృహ', 'రక్తస్రావం', 'మూర్ఛ', 'విషం',
];

const traumaKeywordsEn = [
  'broken arm', 'broken leg', 'fracture', 'fractured', 'bone injury',
  'open wound', 'deep cut', 'bleeding heavily', 'accident', 'sprain',
  'dislocation', 'trauma', 'c-arm', 'polytrauma',
];

const traumaKeywordsTe = [
  'ఎముక విరిగింది', 'గాయం', 'పగిలింది', 'దెబ్బ', 'ప్రమాదం',
];

const tokenKeywordsEn = ['token', 'queue', 'wait', 'my turn', 'where am i', 'a-019', 'a019'];
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

const freeOpKeywordsEn = ['free consultation', 'free op', 'free checkup', 'free doctor'];
const freeOpKeywordsTe = ['ఉచిత op', 'ఉచితమేనా', 'ఉచిత కన్సల్టేషన్', 'ఉచిత'];

const sugarTestKeywordsEn = ['sugar test', 'diabetes test', 'blood sugar', 'glucose test', 'sugar check', 'sugar cost'];
const sugarTestKeywordsTe = ['షుగర్ పరీక్ష', 'గ్లూకోజ్', 'మధుమేహం', 'షుగర్'];

const labDiscountKeywordsEn = ['lab discount', 'blood test', 'diagnostic discount', 'lab test', 'lab work', 'lab test discount'];
const labDiscountKeywordsTe = ['ల్యాబ్ పరీక్షలపై', 'రక్త పరీక్ష', 'రాయితీలు', 'ల్యాబ్'];

const pharmacyKeywordsEn = ['pharmacy', 'medical shop', 'medicine discount', 'medicines', 'medical store'];
const pharmacyKeywordsTe = ['మెడికల్ షాపు', 'మందులపై', 'మందులు', 'మెడికల్ స్టోర్'];

const appointmentLineKeywordsEn = ['appointment number', 'direct phone', '9849057185', 'call for appointment', 'book kondal rao', 'kondal rao appointment'];
const appointmentLineKeywordsTe = ['అపాయింట్‌మెంట్ నంబర్', 'నేరుగా కాల్', 'నంబర్‌కు'];

const opTimingKeywordsEn = ['op timing', 'consultation time', 'op hours', 'when does op', 'op consultation timing', 'consultation timing'];
const opTimingKeywordsTe = ['op సమయాలు', 'కన్సల్టేషన్ సమయాలు', 'సమయాలు'];

const hoursKeywordsEn = ['open at night', 'sunday', '24 hours', '24/7', 'operational hours', 'open today', 'open now', 'night', 'weekend'];
const hoursKeywordsTe = ['రాత్రి', 'ఆదివారం', '24 గంటలు', 'ఎప్పుడు తెరుస్తారు'];

const landmarkKeywordsEn = ['landmark', 'where is the hospital', 'how to reach', 'how do i get', 'susheela college', 'wyra road'];
const landmarkKeywordsTe = ['ల్యాండ్‌మార్క్', 'ఎక్కడ', 'సమీప', 'సుశీల కళాశాల'];

const offersKeywordsEn = ['discounts', 'offers', 'packages', 'concessions', 'health checkup', 'special offer'];
const offersKeywordsTe = ['ఆఫర్లు', 'తగ్గింపులు', 'ప్యాకేజీలు', 'రాయితీ'];

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
        <strong key={i} className="font-semibold text-white">
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
  check_token: { icon: Zap, color: 'text-teal-300' },
  book_ambulance: { icon: Ambulance, color: 'text-rose-300' },
  book_appt: { icon: Calendar, color: 'text-emerald-300' },
  cashless_tpa: { icon: ShieldCheck, color: 'text-sky-300' },
  open_live_token: { icon: Activity, color: 'text-teal-300' },
  star_health: { icon: ShieldCheck, color: 'text-sky-300' },
  icici_lombard: { icon: ShieldCheck, color: 'text-indigo-300' },
  mediassist: { icon: ShieldCheck, color: 'text-indigo-300' },
  care_health: { icon: ShieldCheck, color: 'text-sky-300' },
  hdfc_ergo: { icon: ShieldCheck, color: 'text-indigo-300' },
  other_tpa: { icon: ShieldCheck, color: 'text-slate-300' },
  open_full_checker: { icon: Search, color: 'text-teal-300' },
  casualty_location: { icon: MapPin, color: 'text-rose-300' },
  book_ortho: { icon: Calendar, color: 'text-emerald-300' },
  call_casualty: { icon: PhoneCall, color: 'text-rose-300' },
  navigate_casualty: { icon: MapPin, color: 'text-rose-300' },
  call_reception: { icon: Phone, color: 'text-teal-300' },
  find_doctor: { icon: Stethoscope, color: 'text-teal-300' },
  special_offers: { icon: Tag, color: 'text-amber-300' },
  call_appointment: { icon: PhoneCall, color: 'text-teal-300' },
  book_lab_test: { icon: FlaskConical, color: 'text-sky-300' },
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

const ASSIGNED_TOKEN = 'A-019';
const ASSIGNED_TOKEN_NUM = 19;
const MINUTES_PER_TOKEN = 8;

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
  const { currentTokenServed, isPaused } = useOpdQueue();

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

  // Re-translate existing bot messages when language changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.sender === 'user') return msg;
        return { ...msg, lang };
      })
    );
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
    const tokensAhead = Math.max(ASSIGNED_TOKEN_NUM - currentTokenServed, 0);
    const waitMinutes = tokensAhead * MINUTES_PER_TOKEN;
    const servingToken = `A-${String(currentTokenServed).padStart(3, '0')}`;

    addBotMessage(
      createMessage('bot', t.token_response(servingToken, tokensAhead, waitMinutes, isPaused), lang, 'token', {
        data: { tokensAhead, waitMinutes, servingToken, isPaused },
        quickReplies: ['open_live_token', 'book_appt'] as QuickReplyKey[],
      })
    );
  }, [currentTokenServed, isPaused, t, lang, addBotMessage]);

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
        createMessage('bot', t.eligibility_provider(provider.name, procedures, docs, provider.turnaround), lang, 'eligibility', {
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
          const availableDoctors = doctors.filter((d) => d.available);
          const docList = availableDoctors.map((d) => `${d.name} (${d.specialtyName}, ${d.room})`).join('; ');
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
    } else if (lower.includes('doctor') || lower.includes('specialist') || lower.includes('వైద్య')) {
      handleQuickReply('find_doctor');
    } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('బుక్')) {
      handleQuickReply('book_appt');
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
  const emergencyPhone = '1066';
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
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
                </div>
                <div>
                  <div className="text-slate-900 font-semibold text-sm flex items-center gap-1.5">
                    CareBot
                    <span className="text-[9px] font-medium text-teal-300 bg-teal-500/10 px-1.5 py-0.5 rounded-full border border-teal-500/20">AI</span>
                  </div>
                  <div className="text-[11px] text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {t.online}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language toggle */}
                <div className="inline-flex p-0.5 bg-slate-800 border border-slate-700 rounded-full text-[11px] font-bold">
                  <button
                    onClick={() => setLang('en')}
                    className={`px-2.5 py-1 rounded-full transition-all ${lang === 'en' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    aria-label="English"
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLang('te')}
                    className={`px-2.5 py-1 rounded-full transition-all ${lang === 'te' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    aria-label="Telugu"
                  >
                    తె
                  </button>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Close CareBot"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
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
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 shrink-0">
                    <img src="/carebot-avatar.webp" alt="CareBot" width={40} height={40} className="w-full h-full object-cover" decoding="async" />
                  </div>
                  <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1">
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
                  className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg hover:bg-slate-800/50 transition-colors group"
                >
                  <tool.icon className="w-4 h-4 text-slate-400 group-hover:text-teal-300 transition-colors" />
                  <span className="text-[9px] text-slate-400 group-hover:text-slate-200 transition-colors font-sans">{tool.label}</span>
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
                  className="flex-1 bg-slate-800 text-slate-100 text-sm rounded-xl px-4 py-2.5 border border-slate-700 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-slate-500 font-sans"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    input.trim()
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-teal-500/30'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
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
  onBookAppointment: () => void;
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
      <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 shrink-0 mt-0.5">
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
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                {t.emergency_title}
              </div>
              <p className="text-slate-100">{displayText}</p>
              <a
                href={`tel:${emergencyPhone}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-rose-600 to-red-600 text-white hover:shadow-lg hover:shadow-rose-600/40 transition-all animate-pulse"
              >
                <PhoneCall className="w-5 h-5" />
                {t.emergency_btn}
              </a>
              <a
                href={`tel:${casualtyPhone}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:border-rose-500/40 transition-all"
              >
                <Phone className="w-4 h-4 text-rose-400" />
                +91 87492 73030
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:border-rose-500/40 transition-all"
              >
                <Navigation className="w-4 h-4 text-rose-400" />
                {t.emergency_navigate}
              </a>
            </div>
          )}

          {/* Token tracking */}
          {message.type === 'token' && (
            <div className="space-y-3">
              <p className="text-slate-100">{displayText}</p>
              {message.data && (
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{t.token_currently_serving}</span>
                    <span className="text-emerald-300 font-bold font-mono">{message.data.servingToken as string}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{t.token_your_token}</span>
                    <span className="text-teal-300 font-bold font-mono">{ASSIGNED_TOKEN}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                      style={{ width: `${Math.min(((19 - (message.data.tokensAhead as number)) / 19) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3 h-3" />
                      {message.data.tokensAhead as number} {t.token_ahead}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3" />
                      ~{message.data.waitMinutes as number} min
                    </span>
                  </div>
                  {(message.data.isPaused as boolean) && (
                    <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1">
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
              <p className="text-slate-100">{displayText}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-teal-300 bg-teal-500/10 border border-teal-500/20 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {t.trauma_casualty_loc}
                </a>
                <button
                  onClick={onBookAppointment}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors"
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
              <p className="text-slate-100">{displayText}</p>
              <button
                onClick={onCheckEligibility}
                className="flex items-center gap-1.5 text-xs font-medium text-teal-300 bg-teal-500/10 border border-teal-500/20 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition-colors w-full justify-center"
              >
                <Search className="w-3.5 h-3.5" />
                {t.eligibility_open_checker}
              </button>
            </div>
          )}

          {/* Special offers */}
          {message.type === 'offers' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Tag className="w-4 h-4" />
                {t.offers_title}
              </div>
              <p className="text-slate-100">{displayText}</p>
              <a
                href={`tel:${hospitalInfo.appointmentLine.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-teal-600/20 text-teal-200 border border-teal-500/30 hover:bg-teal-600/30 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                {t.offers_call}
              </a>
              <button
                onClick={onBookAppointment}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-sky-600/20 text-sky-200 border border-sky-500/30 hover:bg-sky-600/30 transition-all"
              >
                <FlaskConical className="w-4 h-4" />
                {t.offers_lab}
              </button>
            </div>
          )}

          {/* Plain text */}
          {message.type === 'text' && (
            <p className="text-slate-100">{displayText}</p>
          )}

          {/* Quick replies */}
          {message.quickReplies && message.quickReplies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {message.quickReplies.map((key) => {
                const meta = quickReplyMeta[key] ?? { icon: ChevronRight, color: 'text-slate-300' };
                const label = T[lang][`qr_${key}`] as string;
                return (
                  <button
                    key={key}
                    onClick={() => onQuickReply(key)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-teal-500/40 text-slate-200 hover:text-teal-300 transition-all font-sans"
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
