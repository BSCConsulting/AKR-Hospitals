import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Stethoscope,
  Calendar,
  ArrowRight,
  Shield,
  HeartPulse,
  User,
  Phone,
  Ticket,
  ClipboardList,
  Navigation,
  PauseCircle,
  Loader2,
} from 'lucide-react';
import { timeSlots, opdSpecialties, getDateTabs, doctors, hospitalInfo } from '@/data/mockData';
import { hasFreeOpConsultation } from '@/data/promotions';
import { accreditation } from '@/data/compliance';
import HeroCampCallout from '@/components/HeroCampCallout';
import CarePathway from '@/components/CarePathway';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import {
  VISIT_REASONS,
  isValidIndianMobile,
  normalizeMobile,
  generateOpdReference,
  type VisitReasonId,
} from '@/lib/validation';
import { submitAppointmentRequest } from '@/lib/supabase';
import { WHATSAPP_OPD_INQUIRE } from '@/lib/whatsapp';
import { useOpdQueue } from '@/hooks/useOpdQueue';
import type { BookingResult } from '@/components/BookingModal';

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

const todayHours = [
  { label: 'OPD', value: '9 AM – 8 PM daily' },
  { label: 'Casualty & pharmacy', value: '24/7' },
  { label: 'Diagnostics', value: '7 AM – 10 PM' },
];

export interface BookingPrefill {
  specialtyId: string;
  doctorId?: string;
  /** Changes on every request so re-selecting the same doctor still scrolls/focuses. */
  nonce: number;
}

interface HeroTriageProps {
  onGenerateToken: () => void;
  onBookingResult: (result: BookingResult) => void;
  prefill: BookingPrefill | null;
}

type FormErrors = { name?: string; mobile?: string; reason?: string; slot?: string };

export default function HeroTriage({ onGenerateToken, onBookingResult, prefill }: HeroTriageProps) {
  const nowHour = useMemo(() => new Date().getHours(), []);
  const lastSlotHour = Number(timeSlots[timeSlots.length - 1].time.slice(0, 2));
  const [selectedDept, setSelectedDept] = useState('general-medicine');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(nowHour >= lastSlotHour ? 'tomorrow' : 'today');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [visitReason, setVisitReason] = useState<VisitReasonId | ''>('');
  const [honeypot, setHoneypot] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [slotPeriod, setSlotPeriod] = useState<'morning' | 'evening'>(nowHour >= 12 ? 'evening' : 'morning');
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const dateTabs = useMemo(() => getDateTabs(), []);
  const freeOpActive = hasFreeOpConsultation();
  const { isLive, currentTokenServed, isPaused } = useOpdQueue();

  const visibleSlots = timeSlots.filter((s) =>
    slotPeriod === 'morning' ? Number(s.time.slice(0, 2)) < 14 : Number(s.time.slice(0, 2)) >= 14
  );
  const deptDoctors = doctors.filter((d) => d.specialtyId === selectedDept);
  const isPastSlot = (time: string, dateId = selectedDate) =>
    dateId === 'today' && Number(time.slice(0, 2)) <= nowHour;

  useEffect(() => {
    if (!prefill) return;
    setSelectedDept(prefill.specialtyId);
    setSelectedDoctorId(prefill.doctorId ?? '');
    document.getElementById('appointments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nameRef.current?.focus({ preventScroll: true });
  }, [prefill]);

  const handleConfirm = async () => {
    if (submitting) return;
    const errors: FormErrors = {};
    if (patientName.trim().length < 2) errors.name = 'Enter patient name';
    if (!isValidIndianMobile(mobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile (starts with 6–9)';
    }
    if (!visitReason) errors.reason = 'Select reason for visit';
    const chosen = timeSlots.find((s) => s.id === selectedSlot);
    if (!chosen) errors.slot = 'Choose a preferred time';
    else if (isPastSlot(chosen.time)) errors.slot = 'That time has passed — pick a later slot or another day';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const dateTab = dateTabs.find((d) => d.id === selectedDate);
    const slot = timeSlots.find((s) => s.id === selectedSlot);
    const reasonLabel = VISIT_REASONS.find((r) => r.id === visitReason)?.label;
    if (!dateTab || !slot || !reasonLabel) return;

    const details = {
      patientName: patientName.trim(),
      mobile: normalizeMobile(mobile),
      department: opdSpecialties.find((s) => s.id === selectedDept)?.name ?? '',
      doctorName: doctors.find((d) => d.id === selectedDoctorId)?.name,
      date: dateTab.date,
      dateLabel: `${dateTab.label}, ${dateTab.subLabel}`,
      time: slot.time,
      reason: reasonLabel,
    };
    const reference = generateOpdReference();

    // Bots fill hidden fields; show them a normal success without storing anything.
    if (honeypot) {
      onBookingResult({ details, reference, sent: true });
      return;
    }

    setSubmitting(true);
    const sent = await submitAppointmentRequest({
      patient_name: details.patientName,
      mobile: details.mobile,
      department: details.department,
      doctor_name: details.doctorName ?? null,
      preferred_date: details.date,
      preferred_slot: details.time,
      reason: details.reason,
      reference,
    });
    setSubmitting(false);
    onBookingResult({ details, reference, sent });
  };

  return (
    <section id="home" className="relative overflow-hidden pb-2">
      <div className="pointer-events-none absolute top-16 right-[8%] w-40 h-40 rounded-full bg-teal-300/20 blur-3xl animate-float-slow hidden lg:block" />
      <div className="pointer-events-none absolute top-40 left-[4%] w-28 h-28 rounded-full bg-sky-300/20 blur-2xl animate-float-slow [animation-delay:1.2s] hidden lg:block" />

      <div className="relative section-shell pt-4 pb-6 sm:pt-6 sm:pb-8 md:pt-8 md:pb-10">
        <motion.div
          variants={containerVariants}
          initial={false}
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-7"
        >
          <div className="lg:col-span-7 min-w-0 flex flex-col gap-3 sm:gap-3.5">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium w-fit max-w-full order-1"
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{accreditation.nabh.short}</span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5 sm:space-y-2 order-2">
              <h1 className="text-[1.75rem] leading-[1.12] sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 tracking-tight sm:leading-[1.08]">
                Advanced care,{' '}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  closer to you
                </span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-lg max-w-xl leading-relaxed">
                <span className="sm:hidden">
                  Multi-speciality care in Madhira — 24/7 casualty, OPD appointments, diagnostics
                  &amp; cashless TPA.
                </span>
                <span className="hidden sm:inline">
                  {hospitalInfo.tagline} A multi-speciality hospital serving Madhira and the
                  Khammam region since {hospitalInfo.established} with 24/7 trauma care,
                  maternity, diagnostics, and cashless insurance — all under one roof.
                </span>
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="order-3">
              <div className="inline-flex flex-wrap items-center gap-3 sm:gap-5 px-3.5 py-2 glass-surface !rounded-2xl sm:!rounded-full text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                  24/7 Casualty
                </span>
                <span className="hidden sm:block w-px h-5 bg-slate-200" />
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  Cashless TPA desk
                </span>
                <span className="hidden sm:block w-px h-5 bg-slate-200" />
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                  Since {hospitalInfo.established}
                </span>
              </div>
            </motion.div>

            {/* Mobile: book first. Desktop: pathway → camp → book. */}
            <motion.div variants={itemVariants} className="order-5 sm:order-4">
              <CarePathway />
            </motion.div>

            <motion.div variants={itemVariants} className="order-6 sm:order-5">
              <HeroCampCallout />
            </motion.div>

            <motion.form
              id="appointments"
              variants={itemVariants}
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void handleConfirm();
              }}
              className="glass-surface p-4 sm:p-6 space-y-3.5 sm:space-y-4 scroll-mt-24 sm:scroll-mt-28 order-4 sm:order-6"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <h2 className="text-slate-900 font-semibold text-sm">Request an OPD Appointment</h2>
                </div>
                {freeOpActive && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 w-fit max-w-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="sm:hidden">₹0 OP waiver (select doctors)</span>
                    <span className="hidden sm:inline">
                      Special Camp / First-Visit Community Waiver: ₹0 OP Registration (Select
                      Doctors)
                    </span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 -mt-1 sm:-mt-2 leading-snug">
                Pick a preferred time — our reception team will call you to confirm the slot and
                consultation fee.
              </p>

              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="hero-website">Website</label>
                <input
                  id="hero-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="hero-patient-name" className="text-xs font-medium text-slate-700">
                    Patient Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      ref={nameRef}
                      id="hero-patient-name"
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      aria-invalid={Boolean(formErrors.name)}
                      aria-describedby={formErrors.name ? 'err-name' : undefined}
                      placeholder="Full name"
                      className="w-full bg-white/90 text-slate-900 text-base sm:text-sm rounded-lg pl-10 pr-3 py-3 sm:py-2.5 min-h-12 sm:min-h-0 border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                  {formErrors.name && <p id="err-name" className="text-xs text-red-700">{formErrors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="hero-mobile" className="text-xs font-medium text-slate-700">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="hero-mobile"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={mobile}
                      onChange={(e) => setMobile(normalizeMobile(e.target.value))}
                      aria-invalid={Boolean(formErrors.mobile)}
                      aria-describedby={formErrors.mobile ? 'err-mobile' : undefined}
                      placeholder="10-digit Indian mobile"
                      className="w-full bg-white/90 text-slate-900 text-base sm:text-sm rounded-lg pl-10 pr-3 py-3 sm:py-2.5 min-h-12 sm:min-h-0 border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                  {formErrors.mobile && <p id="err-mobile" className="text-xs text-red-700">{formErrors.mobile}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="hero-visit-reason" className="text-xs font-medium text-slate-700">
                  Reason for Visit
                </label>
                <div className="relative">
                  <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <select
                    id="hero-visit-reason"
                    value={visitReason}
                    onChange={(e) => setVisitReason(e.target.value as VisitReasonId | '')}
                    aria-invalid={Boolean(formErrors.reason)}
                    aria-describedby={formErrors.reason ? 'err-reason' : undefined}
                    className="w-full bg-white/90 text-slate-800 text-base sm:text-sm rounded-lg pl-10 pr-3 py-3 sm:py-2.5 min-h-12 sm:min-h-0 border border-slate-300 focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select reason…</option>
                    {VISIT_REASONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.reason && <p id="err-reason" className="text-xs text-red-700">{formErrors.reason}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="hero-department" className="text-xs font-medium text-slate-700">
                    Department
                  </label>
                  <select
                    id="hero-department"
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      setSelectedDoctorId('');
                    }}
                    className="w-full bg-white/90 text-slate-800 text-base sm:text-sm rounded-lg px-3 py-3 sm:py-2.5 min-h-12 sm:min-h-0 border border-slate-300 focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    {opdSpecialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="hero-doctor" className="text-xs font-medium text-slate-700">
                    Doctor
                  </label>
                  <select
                    id="hero-doctor"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-white/90 text-slate-800 text-base sm:text-sm rounded-lg px-3 py-3 sm:py-2.5 min-h-12 sm:min-h-0 border border-slate-300 focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">Any available doctor</option>
                    {deptDoctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-xs font-medium text-slate-700 mb-1.5">Preferred day</legend>
                <div className="flex gap-1.5 sm:gap-2">
                  {dateTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={selectedDate === tab.id}
                      disabled={tab.id === 'today' && nowHour >= lastSlotHour}
                      onClick={() => {
                        setSelectedDate(tab.id);
                        const slot = timeSlots.find((s) => s.id === selectedSlot);
                        if (slot && isPastSlot(slot.time, tab.id)) setSelectedSlot(null);
                      }}
                      className={`flex-1 min-h-12 sm:min-h-0 px-2 sm:px-3 py-2 rounded-lg text-center transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
                        selectedDate === tab.id
                          ? 'bg-teal-50 border-teal-300 text-teal-800'
                          : 'bg-white/90 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold leading-tight">{tab.label}</div>
                      <div className="text-xs text-slate-600 mt-0.5 leading-tight">{tab.subLabel}</div>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-xs font-medium text-slate-700 mb-1.5">Preferred time</legend>
                <div className="inline-flex p-1 bg-slate-100/90 border border-slate-200 rounded-xl w-full sm:w-auto">
                  {(
                    [
                      { id: 'morning', label: 'Morning', hint: '09:00 – 12:00' },
                      { id: 'evening', label: 'Evening', hint: '14:00 – 19:00' },
                    ] as const
                  ).map((period) => (
                    <button
                      key={period.id}
                      type="button"
                      aria-pressed={slotPeriod === period.id}
                      onClick={() => {
                        setSlotPeriod(period.id);
                        setSelectedSlot(null);
                      }}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-left transition-all ${
                        slotPeriod === period.id
                          ? 'bg-white text-teal-800 shadow-sm border border-teal-200'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <div className="text-xs font-semibold">{period.label}</div>
                      <div className="text-xs text-slate-600">{period.hint}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
                  {visibleSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        aria-pressed={isSelected}
                        disabled={isPastSlot(slot.time)}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`px-1.5 sm:px-2 py-2.5 min-h-12 rounded-lg text-center text-xs font-bold border transition-colors disabled:opacity-40 disabled:line-through disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/25'
                            : 'bg-white/90 text-slate-800 border-slate-300 hover:border-teal-400'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
                {formErrors.slot && <p className="text-xs text-red-700">{formErrors.slot}</p>}
              </fieldset>

              <p className="text-xs text-slate-600 leading-relaxed rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2">
                By submitting, you consent to Dr. AKR Hospital storing these details and contacting
                you by phone/WhatsApp about this appointment (DPDP Act, 2023). We never share
                patient records.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-12 rounded-xl text-sm font-semibold bg-teal-700 text-white shadow-md shadow-teal-700/20 hover:bg-teal-600 disabled:opacity-70 disabled:cursor-wait transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending request…
                  </>
                ) : (
                  <>
                    Request Appointment
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {isLive && (
                <button
                  type="button"
                  onClick={onGenerateToken}
                  className="w-full text-center text-xs text-slate-600 hover:text-teal-700 transition-colors min-h-11"
                >
                  Already at the hospital?{' '}
                  <span className="font-semibold underline underline-offset-2">Check your OPD token</span>
                </button>
              )}
            </motion.form>
          </div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 min-w-0 lg:sticky lg:top-24 self-start order-last lg:order-none"
          >
            <div className="glass-surface p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700" />
                <h2 className="text-slate-900 font-semibold text-sm">Today at the hospital</h2>
              </div>

              <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white/80">
                {todayHours.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
                    <dt className="text-slate-600">{row.label}</dt>
                    <dd className="font-semibold text-slate-900 text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {isLive && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-3 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide font-semibold text-emerald-800">
                        OPD now serving
                      </div>
                      <div className="text-xl font-bold text-slate-900 tabular-nums" aria-live="polite">
                        {currentTokenServed > 0 ? `Token #${currentTokenServed}` : 'Not started'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onGenerateToken}
                      className="inline-flex items-center gap-1.5 px-3 py-2 min-h-11 rounded-lg text-xs font-semibold bg-white border border-emerald-200 text-emerald-900 hover:bg-emerald-50"
                    >
                      <Ticket className="w-4 h-4" />
                      Check my turn
                    </button>
                  </div>
                  {isPaused && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-900">
                      <PauseCircle className="w-3.5 h-3.5" />
                      Queue paused briefly
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2">
                <a
                  href={hospitalInfo.phoneTel}
                  className="flex items-center justify-center gap-2 px-4 py-3 min-h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call casualty · {hospitalInfo.phone}
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={WHATSAPP_OPD_INQUIRE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-3 min-h-12 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#0B6E62]" />
                    WhatsApp
                  </a>
                  <a
                    href={hospitalInfo.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-3 min-h-12 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50"
                  >
                    <Navigation className="w-4 h-4 text-teal-700" />
                    Directions
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-slate-600">
                {hospitalInfo.landmark}. In a life-threatening emergency, come straight to
                casualty or dial {hospitalInfo.ambulancePhone}.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
