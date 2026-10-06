import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Stethoscope,
  Calendar,
  CheckCircle2,
  CircleDot,
  ArrowRight,
  Shield,
  HeartPulse,
  Zap,
  MapPin,
  BadgeCheck,
  CircleDollarSign,
  User,
  Phone,
  Ticket,
  ClipboardList,
  Filter,
} from 'lucide-react';
import {
  opdQueue,
  timeSlots,
  opdSpecialties,
  getDateTabs,
  doctors,
  hospitalInfo,
  insuranceProviders,
  type TimeSlot,
  type Doctor,
} from '@/data/mockData';
import { hasFreeOpConsultation } from '@/data/promotions';
import { accreditation } from '@/data/compliance';
import HeroCampCallout from '@/components/HeroCampCallout';
import CarePathway from '@/components/CarePathway';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  VISIT_REASONS,
  isValidIndianMobile,
  normalizeMobile,
  type VisitReasonId,
} from '@/lib/validation';
import type { BookingDetails } from '@/components/BookingModal';

const statusConfig = {
  'in-consult': {
    label: 'In Consultation',
    icon: Stethoscope,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
  },
  next: {
    label: 'Next Up',
    icon: Zap,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    dot: 'bg-amber-500',
  },
  waiting: {
    label: 'Waiting',
    icon: Clock,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    dot: 'bg-slate-400',
  },
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface HeroTriageProps {
  onGenerateToken: () => void;
  onConfirmBooking: (details: BookingDetails) => void;
}

function privacyQueueLabel(token: string, department: string, status: keyof typeof statusConfig) {
  if (status === 'in-consult') return `Token ${token} (${department}) — In Consultation`;
  if (status === 'next') return `Token ${token} — Next Up`;
  return `Token ${token} (${department}) — Waiting`;
}

export default function HeroTriage({ onGenerateToken, onConfirmBooking }: HeroTriageProps) {
  const [selectedDept, setSelectedDept] = useState('general-medicine');
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [visitReason, setVisitReason] = useState<VisitReasonId | ''>('');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    mobile?: string;
    reason?: string;
  }>({});
  const [slotPeriod, setSlotPeriod] = useState<'morning' | 'evening'>('morning');
  const [queueTime, setQueueTime] = useState(0);
  const [queueDeptFilter, setQueueDeptFilter] = useState('all');
  const dateTabs = useMemo(() => getDateTabs(), []);
  const freeOpActive = hasFreeOpConsultation();

  const morningSlots = useMemo(
    () => timeSlots.filter((s) => Number(s.time.split(':')[0]) < 14),
    []
  );
  const eveningSlots = useMemo(
    () => timeSlots.filter((s) => Number(s.time.split(':')[0]) >= 14),
    []
  );
  const visibleSlots = slotPeriod === 'morning' ? morningSlots : eveningSlots;

  const queueDepartments = useMemo(() => {
    const set = new Set(opdQueue.map((q) => q.department));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredQueue = useMemo(
    () =>
      queueDeptFilter === 'all'
        ? opdQueue
        : opdQueue.filter((q) => q.department === queueDeptFilter),
    [queueDeptFilter]
  );

  const estimatedWait = useMemo(() => {
    const waiting = filteredQueue.filter((q) => q.status === 'waiting' || q.status === 'next');
    if (waiting.length === 0) {
      const inConsult = filteredQueue.find((q) => q.status === 'in-consult');
      return inConsult ? 5 : 0;
    }
    return Math.max(...waiting.map((q) => q.waitMinutes));
  }, [filteredQueue]);

  useEffect(() => {
    const interval = setInterval(() => setQueueTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatClock = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const availableSlots = useMemo(() => timeSlots.filter((s) => s.available), []);

  const deptDoctors = useMemo(
    () => doctors.filter((d) => d.specialtyId === selectedDept),
    [selectedDept]
  );

  const handleDeptChange = (deptId: string) => {
    setSelectedDept(deptId);
    setSelectedSlot(null);
    setSelectedDoctor(null);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot.id);
    const available = deptDoctors.filter((d) => d.available);
    setSelectedDoctor(available[0] ?? null);
  };

  const handleConfirm = () => {
    if (!selectedSlot || !selectedDoctor) return;
    const errors: { name?: string; mobile?: string; reason?: string } = {};
    if (!patientName.trim()) errors.name = 'Enter patient name';
    if (!isValidIndianMobile(mobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile (starts with 6–9)';
    }
    if (!visitReason) errors.reason = 'Select reason for visit / triage';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const dateTab = dateTabs.find((d) => d.id === selectedDate);
    const slot = timeSlots.find((s) => s.id === selectedSlot);
    const reasonLabel = VISIT_REASONS.find((r) => r.id === visitReason)?.label;
    if (!dateTab || !slot || !reasonLabel) return;

    const waiver =
      Boolean(selectedDoctor.campWaiverEligible) ||
      selectedDoctor.fee === 0 ||
      visitReason === 'camp-checkup';

    onConfirmBooking({
      department: opdSpecialties.find((s) => s.id === selectedDept)?.name ?? '',
      date: dateTab.date,
      dateLabel: `${dateTab.label}, ${dateTab.subLabel}`,
      time: slot.time,
      doctorName: selectedDoctor.name,
      doctorCredentials: selectedDoctor.credentials,
      room: selectedDoctor.room,
      fee: selectedDoctor.fee,
      patientName: patientName.trim(),
      mobile: normalizeMobile(mobile),
      reasonForVisit: reasonLabel,
      campWaiverApplied: waiver,
      registrationNumber: selectedDoctor.registrationNumber,
    });
  };

  const selectedSlotObj = timeSlots.find((s) => s.id === selectedSlot);

  return (
    <section id="home" className="relative overflow-hidden pb-2">
      <div className="pointer-events-none absolute top-16 right-[8%] w-40 h-40 rounded-full bg-teal-300/20 blur-3xl animate-float-slow hidden lg:block" />
      <div className="pointer-events-none absolute top-40 left-[4%] w-28 h-28 rounded-full bg-sky-300/20 blur-2xl animate-float-slow [animation-delay:1.2s] hidden lg:block" />

      <div className="relative section-shell pt-6 pb-8 md:pt-8 md:pb-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-12 gap-5 lg:gap-7"
        >
          <div className="lg:col-span-7 space-y-3.5">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium max-w-full"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate" title={accreditation.nabh.full}>
                <span className="sm:hidden">NABH Accredited</span>
                <span className="hidden sm:inline lg:hidden">
                  NABH · {accreditation.nabh.certNo}
                </span>
                <span className="hidden lg:inline">{accreditation.nabh.full}</span>
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 tracking-tight leading-[1.08]">
                Advanced care,{' '}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  closer to you
                </span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                {hospitalInfo.tagline} A {hospitalInfo.beds}-bed multi-speciality hospital
                serving Madhira and the Khammam region with 24/7 trauma care, maternity,
                diagnostics, and cashless insurance — all under one roof.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="inline-flex flex-wrap items-center gap-3 sm:gap-5 px-3.5 py-2 glass-surface !rounded-2xl sm:!rounded-full">
                <div className="flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  <AnimatedCounter
                    value={hospitalInfo.beds}
                    className="text-sm font-bold text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500">Beds</span>
                </div>
                <div className="hidden sm:block w-px h-5 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <AnimatedCounter
                    value={hospitalInfo.doctors}
                    className="text-sm font-bold text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500">Doctors</span>
                </div>
                <div className="hidden sm:block w-px h-5 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <AnimatedCounter
                    value={insuranceProviders.length}
                    suffix="+"
                    className="text-sm font-bold text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500">Insurers</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <CarePathway />
            </motion.div>

            <motion.div variants={itemVariants}>
              <HeroCampCallout />
            </motion.div>

            <motion.div
              id="appointments"
              variants={itemVariants}
              className="glass-surface p-5 sm:p-6 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <h2 className="text-slate-900 font-semibold text-sm">Book an OPD Slot</h2>
                </div>
                {freeOpActive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 max-w-full text-left">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    Special Camp / First-Visit Community Waiver: ₹0 OP Registration (Select Doctors)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 -mt-2">
                Standard consultant fees (₹400–₹800) apply unless the selected doctor is under the
                community waiver. Fee is confirmed on your appointment summary.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="hero-patient-name" className="text-xs font-medium text-slate-600">
                    Patient Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="hero-patient-name"
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Full name"
                      className="w-full bg-white/90 text-slate-900 text-sm rounded-lg pl-10 pr-3 py-2.5 border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {formErrors.name && <p className="text-xs text-red-600">{formErrors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="hero-mobile" className="text-xs font-medium text-slate-600">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="hero-mobile"
                      type="tel"
                      inputMode="numeric"
                      value={mobile}
                      onChange={(e) => setMobile(normalizeMobile(e.target.value))}
                      placeholder="10-digit Indian mobile"
                      maxLength={10}
                      className="w-full bg-white/90 text-slate-900 text-sm rounded-lg pl-10 pr-3 py-2.5 border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {formErrors.mobile && <p className="text-xs text-red-600">{formErrors.mobile}</p>}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2">
                By proceeding, you consent to Dr. AKR Hospital contacting you for appointment
                confirmations via SMS/WhatsApp under the DPDP Act. We never share patient records.
              </p>

              <div className="space-y-1.5">
                <label htmlFor="hero-visit-reason" className="text-xs font-medium text-slate-600">
                  Reason for Visit / Triage
                </label>
                <div className="relative">
                  <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    id="hero-visit-reason"
                    required
                    value={visitReason}
                    onChange={(e) => setVisitReason(e.target.value as VisitReasonId | '')}
                    className="w-full bg-white/90 text-slate-800 text-sm rounded-lg pl-10 pr-3 py-2.5 border border-slate-200 focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select reason…</option>
                    {VISIT_REASONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.reason && <p className="text-xs text-red-600">{formErrors.reason}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="hero-department" className="text-xs font-medium text-slate-600">
                  Department
                </label>
                <select
                  id="hero-department"
                  value={selectedDept}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  className="w-full bg-white/90 text-slate-800 text-sm rounded-lg px-3 py-2.5 border border-slate-200 focus:border-teal-500 focus:outline-none cursor-pointer"
                >
                  {opdSpecialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                {dateTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSelectedDate(tab.id);
                      setSelectedSlot(null);
                      setSelectedDoctor(null);
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg text-center transition-all border ${
                      selectedDate === tab.id
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'bg-white/90 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-semibold">{tab.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tab.subLabel}</div>
                  </button>
                ))}
              </div>

              <div className="inline-flex p-1 bg-slate-100/90 border border-slate-200 rounded-xl w-full sm:w-auto">
                {(
                  [
                    { id: 'morning' as const, label: 'Morning', hint: '09:00 – 13:00' },
                    { id: 'evening' as const, label: 'Evening', hint: '14:00 – 19:00' },
                  ] as const
                ).map((period) => (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => {
                      setSlotPeriod(period.id);
                      setSelectedSlot(null);
                      setSelectedDoctor(null);
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-left transition-all ${
                      slotPeriod === period.id
                        ? 'bg-white text-teal-800 shadow-sm border border-teal-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div className="text-xs font-semibold">{period.label}</div>
                    <div className="text-[10px] text-slate-600">{period.hint}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {visibleSlots.map((slot: TimeSlot) => {
                  const isSelected = selectedSlot === slot.id;
                  return (
                    <motion.button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => handleSlotClick(slot)}
                      whileHover={slot.available ? { scale: 1.04 } : undefined}
                      whileTap={slot.available ? { scale: 0.95 } : undefined}
                      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                      className={`relative px-2 py-2.5 rounded-lg text-center text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-md shadow-teal-600/25 font-bold ring-2 ring-teal-300/60'
                          : slot.available
                            ? 'bg-[rgba(255,255,255,0.9)] text-[#1E293B] border-[rgba(203,213,225,0.8)] hover:border-teal-300'
                            : 'bg-[rgba(241,245,249,0.6)] text-[#94A3B8] border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-bold">{slot.time}</div>
                      {slot.available ? (
                        <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-teal-50' : 'text-slate-500'}`}>
                          {slot.doctorCount} Dr{slot.doctorCount > 1 ? 's' : ''}
                        </div>
                      ) : (
                        <div className="text-[9px] mt-0.5 font-semibold uppercase tracking-wide">Full</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {selectedSlot && selectedDoctor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl border border-teal-200 bg-teal-50/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{selectedDoctor.name}</div>
                      <div className="text-[11px] text-slate-500">{selectedDoctor.credentials}</div>
                      {selectedDoctor.designation && (
                        <div className="text-[11px] text-teal-800 font-medium mt-0.5">
                          {selectedDoctor.designation}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 mt-1">
                        {selectedDoctor.registrationNumber}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-600" />
                          {selectedDoctor.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <CircleDollarSign className="w-3 h-3 text-teal-600" />
                          {selectedDoctor.campWaiverEligible || selectedDoctor.fee === 0
                            ? '₹0 OP Registration (Waiver)'
                            : `Standard fee ₹${selectedDoctor.fee}`}
                        </span>
                      </div>
                    </div>
                    <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                <div className="text-xs text-slate-500">
                  {selectedSlot ? (
                    <span className="flex items-center gap-1.5 text-teal-700 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      {selectedSlotObj?.time} —{' '}
                      {selectedDate === 'today'
                        ? 'Today'
                        : dateTabs.find((d) => d.id === selectedDate)?.label}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <CircleDot className="w-4 h-4 text-slate-400" />
                      {availableSlots.length} slots available
                    </span>
                  )}
                </div>
                <motion.button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!selectedSlot || !selectedDoctor}
                  whileHover={selectedSlot && selectedDoctor ? { scale: 1.02 } : undefined}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    selectedSlot && selectedDoctor
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Booking
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              <button
                type="button"
                onClick={onGenerateToken}
                className="w-full text-center text-xs text-slate-500 hover:text-teal-700 transition-colors pt-1"
              >
                Already at the hospital?{' '}
                <span className="font-semibold underline underline-offset-2">View live OPD token status</span>
              </button>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <div className="glass-surface p-4 sm:p-5 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-1 shimmer-bar" aria-hidden />
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <h2 className="text-slate-900 font-semibold text-sm">Live OPD Queue</h2>
                </div>
                <span className="text-[11px] font-mono text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md tabular-nums">
                  {formatClock(queueTime)}
                </span>
              </div>

              <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wide font-semibold text-amber-800">
                    Estimated Wait Time
                  </div>
                  <div className="text-lg font-bold text-slate-900 tabular-nums">
                    {estimatedWait > 0 ? `~${estimatedWait} mins` : 'No wait'}
                  </div>
                </div>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>

              <div className="mb-3 space-y-1.5">
                <label
                  htmlFor="queue-dept-filter"
                  className="text-[11px] font-medium text-slate-600 flex items-center gap-1"
                >
                  <Filter className="w-3 h-3" />
                  Department filter
                </label>
                <select
                  id="queue-dept-filter"
                  value={queueDeptFilter}
                  onChange={(e) => setQueueDeptFilter(e.target.value)}
                  className="w-full bg-white/90 text-slate-800 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:border-teal-500 focus:outline-none cursor-pointer"
                >
                  {queueDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d === 'all' ? 'All departments' : d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  {
                    label: 'Serving',
                    value: filteredQueue.find((q) => q.status === 'in-consult')?.token ?? '—',
                  },
                  {
                    label: 'Next',
                    value: filteredQueue.find((q) => q.status === 'next')?.token ?? '—',
                  },
                  {
                    label: 'Waiting',
                    value: String(filteredQueue.filter((q) => q.status === 'waiting').length),
                  },
                ].map((cell) => (
                  <div
                    key={cell.label}
                    className="rounded-xl bg-white/80 border border-slate-200 px-2 py-2 text-center"
                  >
                    <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                      {cell.label}
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{cell.value}</div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 mb-3">
                Privacy-safe view — token & clinical wing only. Patient names are never shown.
              </p>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-0.5 overscroll-contain">
                {filteredQueue.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500">
                    No tokens in this department right now.
                  </div>
                )}
                {filteredQueue.map((q, qi) => {
                  const cfg = statusConfig[q.status];
                  const Icon = cfg.icon;
                  const progress =
                    q.status === 'in-consult' ? 92 : q.status === 'next' ? 68 : Math.max(18, 55 - q.waitMinutes);
                  const isActive = q.status === 'in-consult' || q.status === 'next';
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + qi * 0.06 }}
                      className={`rounded-xl border border-slate-200/80 px-3 py-2.5 ${cfg.bg} ${
                        isActive ? 'ring-1 ring-emerald-200/80' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot} ${
                            isActive ? 'animate-pulse' : ''
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div
                            className="text-sm font-medium text-slate-900 truncate"
                          >
                            {privacyQueueLabel(q.token, q.department, q.status)}
                          </div>
                          <div className="mt-1.5 h-1.5 rounded-full bg-white/80 overflow-hidden border border-slate-200/60">
                            <motion.div
                              className={`h-full rounded-full ${
                                q.status === 'in-consult'
                                  ? 'bg-emerald-500'
                                  : q.status === 'next'
                                    ? 'bg-amber-400'
                                    : 'bg-teal-400'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ delay: 0.3 + qi * 0.08, duration: 0.7, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Icon className={`w-4 h-4 ml-auto ${cfg.color}`} />
                          {q.waitMinutes > 0 && (
                            <div className="text-[10px] text-slate-500 mt-1">~{q.waitMinutes}m</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={onGenerateToken}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-600 shadow-md shadow-teal-700/15 transition-colors"
              >
                <Ticket className="w-4 h-4" />
                Open Token Tracker
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
