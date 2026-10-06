import { motion } from 'framer-motion';
import {
  Stethoscope,
  MapPin,
  Star,
  Calendar,
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
} from 'lucide-react';
import { doctors, type Doctor } from '@/data/mockData';
import DoctorAvatar from '@/components/DoctorAvatar';

interface DoctorsDirectoryProps {
  onBookDoctor: (doctor: Doctor, preferNextDay?: boolean) => void;
}

export default function DoctorsDirectory({ onBookDoctor }: DoctorsDirectoryProps) {
  return (
    <section id="specialists" className="relative py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-7"
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
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <DoctorAvatar name={doctor.name} size="md" />
          <div>
            <h3 className="text-slate-900 font-semibold text-sm">{doctor.name}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{doctor.credentials}</p>
          </div>
        </div>
        {doctor.available ? (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available
          </span>
        ) : (
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            Off today
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-teal-700 mb-3 font-medium">
        <Stethoscope className="w-3.5 h-3.5" />
        {doctor.specialtyName}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {doctor.room}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          OPD: {doctor.opdDays.join(', ')}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CircleDollarSign className="w-3.5 h-3.5 text-slate-400" />
          Rs. {doctor.fee} consultation
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
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
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
            Book Next Available: Tomorrow
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </motion.div>
  );
}
