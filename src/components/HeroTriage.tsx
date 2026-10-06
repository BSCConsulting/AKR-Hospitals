import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Clock,
  Users,
  Stethoscope,
  Calendar,
  CheckCircle2,
  CircleDot,
  ArrowRight,
  Shield,
  HeartPulse,
  Zap,
  Ticket,
  MapPin,
  BadgeCheck,
  CircleDollarSign,
} from 'lucide-react';
import {
  opdQueue,
  timeSlots,
  opdSpecialties,
  dateTabs,
  doctors,
  hospitalInfo,
  type TimeSlot,
  type Doctor,
} from '@/data/mockData';

const statusConfig = {
  'in-consult': {
    label: 'In Consult',
    icon: Stethoscope,
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-500',
  },
  next: {
    label: 'Next Up',
    icon: Zap,
    color: 'text-amber-300',
    bg: 'bg-amber-500/10',
    dot: 'bg-amber-500',
  },
  waiting: {
    label: 'Waiting',
    icon: Clock,
    color: 'text-slate-300',
    bg: 'bg-slate-500/10',
    dot: 'bg-slate-500',
  },
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
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
  }) => void;
}

type Mode = 'book' | 'walkin';

export default function HeroTriage({ onGenerateToken, onConfirmBooking }: HeroTriageProps) {
  const [mode, setMode] = useState<Mode>('book');
  const [selectedDept, setSelectedDept] = useState('general-medicine');
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [queueTime, setQueueTime] = useState(0);

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
    });
  };

  const selectedSlotObj = timeSlots.find((s) => s.id === selectedSlot);

  return (
    <section id="home" className="relative bg-slate-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(13,148,136,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-12 gap-8 lg:gap-10"
        >
          {/* Left: headline + booking widget */}
          <div className="lg:col-span-7 space-y-5">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium"
            >
              <Shield className="w-3.5 h-3.5" />
              NABH Accredited • Est. {hospitalInfo.established}
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Advanced care,{" "}
                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  closer to you
                </span>
              </h1>
              <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                {hospitalInfo.tagline} A {hospitalInfo.beds}-bed multi-speciality hospital
                serving Madhira and the Khammam region with 24/7 trauma care,
                maternity, diagnostics, and cashless
                insurance — all under one roof.
              </p>
            </motion.div>

            {/* Compact metric strip */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-3 sm:gap-5 px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-full backdrop-blur-sm">
                {[
                  { icon: HeartPulse, value: hospitalInfo.beds, label: 'Beds', color: 'text-rose-400' },
                  { divider: true },
                  { icon: Stethoscope, value: hospitalInfo.doctors, label: 'Doctors', color: 'text-teal-400' },
                  { divider: true },
                  { icon: Shield, value: '40+', label: 'Insurers', color: 'text-emerald-400' },
                ].map((stat, i) =>
                  'divider' in stat ? (
                    <div key={`d${i}`} className="w-px h-5 bg-slate-700" />
                  ) : (
                    <div key={stat.label} className="flex items-center gap-1.5">
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                      <span className="text-sm font-bold text-white">{stat.value}</span>
                      <span className="text-[11px] text-slate-400">{stat.label}</span>
                    </div>
                  )
                )}
              </div>
            </motion.div>

            {/* Mode toggle */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex p-1 bg-slate-900/70 border border-slate-800 rounded-xl">
                <button
                  onClick={() => setMode('book')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === 'book'
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Book Future Slot
                </button>
                <button
                  onClick={() => setMode('walkin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === 'walkin'
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Instant Live Token
                </button>
              </div>
            </motion.div>

            {/* Booking widget or Walk-in panel */}
            {mode === 'book' ? (
              <motion.div
                variants={itemVariants}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-4"
              >
                {/* Department selector + date tabs */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <h3 className="text-white font-semibold text-sm">Book an OPD Slot</h3>
                  </div>
                  <select
                    value={selectedDept}
                    onChange={(e) => handleDeptChange(e.target.value)}
                    className="bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 border border-slate-700 focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    {opdSpecialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date tabs */}
                <div className="flex gap-2">
                  {dateTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedDate(tab.id);
                        setSelectedSlot(null);
                        setSelectedDoctor(null);
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-center transition-all ${
                        selectedDate === tab.id
                          ? 'bg-teal-500/15 border border-teal-500/40 text-teal-300'
                          : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-semibold">{tab.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{tab.subLabel}</div>
                    </button>
                  ))}
                </div>

                {/* Slots grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot: TimeSlot) => {
                    const isSelected = selectedSlot === slot.id;
                    return (
                      <motion.button
                        key={slot.id}
                        disabled={!slot.available}
                        onClick={() => handleSlotClick(slot)}
                        whileHover={slot.available ? { scale: 1.05 } : undefined}
                        whileTap={slot.available ? { scale: 0.95 } : undefined}
                        className={`relative px-2 py-2.5 rounded-lg text-center transition-colors text-xs font-medium ${
                          isSelected
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                            : slot.available
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                            : 'bg-slate-800/30 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        }`}
                      >
                        <div className="font-bold">{slot.time}</div>
                        {slot.available ? (
                          <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                            {slot.doctorCount} Dr{slot.doctorCount > 1 ? 's' : ''}
                          </div>
                        ) : (
                          <div className="text-[9px] mt-0.5 text-slate-500 font-semibold uppercase tracking-wide">
                            Full
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Doctor card after slot selection */}
                {selectedSlot && selectedDoctor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-slate-800/50 border border-teal-500/20 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-xs">
                          {selectedDoctor.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{selectedDoctor.name}</div>
                          <div className="text-[11px] text-slate-300">{selectedDoctor.credentials}</div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[11px] text-slate-300">
                              <MapPin className="w-3 h-3 text-teal-400" />
                              {selectedDoctor.room}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-slate-300">
                              <CircleDollarSign className="w-3 h-3 text-teal-400" />
                              Rs. {selectedDoctor.fee}
                            </span>
                          </div>
                        </div>
                      </div>
                      <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    </div>
                  </motion.div>
                )}

                {/* Action bar */}
                <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                  <div className="text-xs text-slate-300">
                    {selectedSlot ? (
                      <span className="flex items-center gap-1.5 text-teal-300">
                        <CheckCircle2 className="w-4 h-4" />
                        {selectedSlotObj?.time} — {selectedDate === 'today' ? 'Today' : dateTabs.find((d) => d.id === selectedDate)?.label}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <CircleDot className="w-4 h-4 text-slate-400" />
                        {availableSlots.length} slots available
                      </span>
                    )}
                  </div>
                  <motion.button
                    onClick={handleConfirm}
                    disabled={!selectedSlot || !selectedDoctor}
                    whileHover={selectedSlot && selectedDoctor ? { scale: 1.03 } : undefined}
                    whileTap={selectedSlot && selectedDoctor ? { scale: 0.97 } : undefined}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      selectedSlot && selectedDoctor
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Confirm Booking
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              /* Walk-in mode panel */
              <motion.div
                variants={itemVariants}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="text-white font-semibold text-sm">Walk-in Live Token</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Already at the hospital? Generate an instant token to join the live OPD
                  queue. You'll receive a token number and real-time wait tracking.
                </p>
                <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-800 rounded-xl p-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-300">{opdQueue.filter((p) => p.status === 'waiting').length} patients in queue now</span>
                </div>
                <motion.button
                  onClick={onGenerateToken}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-teal-500/30 transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  Generate Walk-in Token
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Right: OPD Queue HUD */}
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden lg:sticky lg:top-24"
            >
              {/* HUD header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/80">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
                  <span className="text-white font-semibold text-sm tracking-wide">OPD LIVE QUEUE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-ring" />
                  <span className="text-xs text-emerald-300 font-mono">{formatClock(queueTime)}</span>
                </div>
              </div>

              {/* Queue list */}
              <div className="divide-y divide-slate-800/60">
                {opdQueue.map((patient, i) => {
                  const cfg = statusConfig[patient.status];
                  return (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold ${cfg.bg} ${cfg.color} shrink-0`}>
                        {patient.token}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{patient.patientName}</div>
                        <div className="text-xs text-slate-300 truncate">{patient.department}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`flex items-center gap-1 justify-end ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${patient.status !== 'waiting' ? 'animate-pulse' : ''}`} />
                          <span className="text-xs font-medium">{cfg.label}</span>
                        </div>
                        {patient.waitMinutes > 0 && (
                          <div className="text-[11px] text-slate-300 mt-0.5">~{patient.waitMinutes} min</div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* HUD footer */}
              <div className="flex items-center justify-between px-5 py-3 bg-slate-900/80 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-200">
                  <Users className="w-3.5 h-3.5" />
                  {opdQueue.filter((p) => p.status === 'waiting').length} in queue
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  Avg wait: 14 min
                </div>
                <button onClick={onGenerateToken} className="text-xs text-teal-300 hover:text-teal-200 font-medium">
                  Join Queue →
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
