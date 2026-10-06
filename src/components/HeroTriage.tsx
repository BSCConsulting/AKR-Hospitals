import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
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
import HeroCampCallout from '@/components/HeroCampCallout';

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
  onConfirmBooking: (details: {
    department: string;
    date: string;
    dateLabel: string;
    time: string;
    doctorName: string;
    doctorCredentials: string;
    room: string;
    fee: number;
    patientName?: string;
    mobile?: string;
  }) => void;
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
  const [formErrors, setFormErrors] = useState<{ name?: string; mobile?: string }>({});
  const [slotPeriod, setSlotPeriod] = useState<'morning' | 'evening'>('morning');
  const [queueTime, setQueueTime] = useState(0);
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
    const errors: { name?: string; mobile?: string } = {};
    if (!patientName.trim()) errors.name = 'Enter patient name';
    if (!/^[0-9]{10}$/.test(mobile.replace(/\s/g, ''))) errors.mobile = 'Enter a valid 10-digit mobile';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const dateTab = dateTabs.find((d) => d.id === selectedDate);
    const slot = timeSlots.find((s) => s.id === selectedSlot);
    if (!dateTab || !slot) return;
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
      mobile: mobile.replace(/\s/g, ''),
    });
  };

  const selectedSlotObj = timeSlots.find((s) => s.id === selectedSlot);

  return (
    <section id="home" className="relative overflow-hidden pb-4">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-12 gap-8 lg:gap-10"
        >
          <div className="lg:col-span-7 space-y-5">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium"
            >
              <Shield className="w-3.5 h-3.5" />
              NABH Accredited • Est. {hospitalInfo.established}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Advanced care,{' '}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  closer to you
                </span>
              </h1>
              <p className="text-slate-600 text-lg max-w-xl leading-relaxed">
                {hospitalInfo.tagline} A {hospitalInfo.beds}-bed multi-speciality hospital
                serving Madhira and the Khammam region with 24/7 trauma care, maternity,
                diagnostics, and cashless insurance — all under one roof.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-3 sm:gap-5 px-4 py-2.5 glass-surface !rounded-full">
                {[
                  { icon: HeartPulse, value: hospitalInfo.beds, label: 'Beds', color: 'text-rose-500' },
                  { divider: true },
                  { icon: Stethoscope, value: hospitalInfo.doctors, label: 'Doctors', color: 'text-teal-600' },
                  { divider: true },
                  {
                    icon: Shield,
                    value: `${insuranceProviders.length}+`,
                    label: 'Insurers',
                    color: 'text-emerald-600',
                  },
                ].map((stat, i) =>
                  'divider' in stat ? (
                    <div key={`d${i}`} className="w-px h-5 bg-slate-200" />
                  ) : (
                    <div key={stat.label} className="flex items-center gap-1.5">
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                      <span className="text-sm font-bold text-slate-900">{stat.value}</span>
                      <span className="text-[11px] text-slate-500">{stat.label}</span>
                    </div>
                  )
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <HeroCampCallout />
            </motion.div>

            {/* Single primary booking flow */}
            <motion.div
              id="appointments"
              variants={itemVariants}
              className="glass-surface p-5 sm:p-6 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <h3 className="text-slate-900 font-semibold text-sm">Book an OPD Slot</h3>
                </div>
                {freeOpActive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Free OP Consultation Active
                  </span>
                )}
              </div>

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
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="w-full bg-white/90 text-slate-900 text-sm rounded-lg pl-10 pr-3 py-2.5 border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {formErrors.mobile && <p className="text-xs text-red-600">{formErrors.mobile}</p>}
                </div>
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
                    <div className="text-[10px] text-slate-500">{period.hint}</div>
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
                      whileHover={slot.available ? { scale: 1.03 } : undefined}
                      whileTap={slot.available ? { scale: 0.97 } : undefined}
                      className={`relative px-2 py-2.5 rounded-lg text-center text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-md shadow-teal-600/25 font-bold'
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
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-600" />
                          {selectedDoctor.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <CircleDollarSign className="w-3 h-3 text-teal-600" />
                          Rs. {selectedDoctor.fee}
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
                      ? 'bg-[#0D9488] text-white shadow-md shadow-teal-600/20'
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

          {/* Live queue — privacy compliant */}
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <div className="glass-surface p-5 sm:p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <h3 className="text-slate-900 font-semibold text-sm">Live OPD Queue</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {formatClock(queueTime)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">
                Patient names are hidden for privacy. Status shown by token only.
              </p>
              <div className="space-y-2.5">
                {opdQueue.map((q) => {
                  const cfg = statusConfig[q.status];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={q.id}
                      className={`flex items-center gap-3 rounded-xl border border-slate-200/80 px-3 py-2.5 ${cfg.bg}`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-800 truncate">
                          {privacyQueueLabel(q.token, q.department, q.status)}
                        </div>
                      </div>
                      <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={onGenerateToken}
                className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-800 transition-colors"
              >
                <Ticket className="w-4 h-4 text-teal-600" />
                Open Token Tracker
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
