import { motion } from 'framer-motion';
import {
  Stethoscope,
  MapPin,
  Star,
  Calendar,
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  IdCard,
} from 'lucide-react';
import { doctors, type Doctor } from '@/data/mockData';
import DoctorAvatar from '@/components/DoctorAvatar';

interface DoctorsDirectoryProps {
  onBookDoctor: (doctor: Doctor, preferNextDay?: boolean) => void;
}

function formatRegDisplay(reg: string) {
  return reg.replace(/TSMC Reg No:/i, 'TSMC Reg #').trim();
}

export default function DoctorsDirectory({ onBookDoctor }: DoctorsDirectoryProps) {
  return (
    <section id="specialists" className="relative section-pad">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl section-header"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium mb-4">
            <Stethoscope className="w-3.5 h-3.5" />
            Specialists on Duty
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Meet our consultants
          </h2>
          <p className="text-slate-600 mt-3 text-lg">
            Experienced specialists across disciplines, available for in-person and follow-up
            consultations throughout the week.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} onBook={onBookDoctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorCard({
  doctor,
  index,
  onBook,
}: {
  doctor: Doctor;
  index: number;
  onBook: (d: Doctor, preferNextDay?: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="group glass-surface p-5"
    >
      <div className="flex flex-wrap items-start justify-between mb-4 gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <DoctorAvatar name={doctor.name} size="md" />
          <div className="min-w-0">
            <h3 className="text-slate-900 font-semibold text-sm">{doctor.name}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{doctor.credentials}</p>
            {doctor.designation && (
              <p className="text-[11px] text-teal-800 font-medium mt-0.5">{doctor.designation}</p>
            )}
          </div>
        </div>
        {doctor.available ? (
          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available
          </span>
        ) : (
          <span className="shrink-0 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            Tomorrow
          </span>
        )}
      </div>

      <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg mb-3">
        <IdCard className="w-3.5 h-3.5 text-teal-600" />
        {formatRegDisplay(doctor.registrationNumber)}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-teal-700 mb-3 font-medium">
        <Stethoscope className="w-3.5 h-3.5" />
        {doctor.specialtyName}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
          <span className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {doctor.room}
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <CircleDollarSign className="w-3.5 h-3.5 text-teal-600" />
            {doctor.campWaiverEligible || doctor.fee === 0
              ? '₹0 Waiver'
              : `₹${doctor.fee}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          OPD: {doctor.opdDays.join(', ')}
        </div>
        <div className="rounded-lg bg-teal-50/70 border border-teal-100 px-2.5 py-1.5 text-[11px] text-teal-900">
          {doctor.campWaiverEligible || doctor.fee === 0
            ? 'Consultation: ₹0 OP Registration (Community Waiver)'
            : `Consultation fee: ₹${doctor.fee} · Cabin ${doctor.room.replace(/^Cabin\s*/i, '')}`}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <BadgeCheck className="w-3.5 h-3.5 text-slate-400" />
          {doctor.experience} years experience
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          {doctor.rating} / 5.0 rating
        </div>
      </div>

      <button
        type="button"
        onClick={() => onBook(doctor, !doctor.available)}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 min-h-12 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
          doctor.available
            ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/15'
            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
        }`}
      >
        {doctor.available ? (
          <>
            Book Slot
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            <span className="sm:hidden">Book Tomorrow</span>
            <span className="hidden sm:inline">Book Next Available: Tomorrow</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </motion.div>
  );
}
