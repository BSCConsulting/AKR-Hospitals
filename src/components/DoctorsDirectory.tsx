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

interface DoctorsDirectoryProps {
  onBookDoctor: (doctor: Doctor) => void;
}

export default function DoctorsDirectory({ onBookDoctor }: DoctorsDirectoryProps) {
  return (
    <section id="specialists" className="bg-slate-900 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium mb-4">
            <Stethoscope className="w-3.5 h-3.5" />
            Specialists on Duty
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Meet our consultants
          </h2>
          <p className="text-slate-300 mt-3 text-lg">
            Experienced specialists across disciplines, available for in-person and follow-up
            consultations throughout the week.
          </p>
        </motion.div>

        {/* Doctor cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} onBook={onBookDoctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorCard({ doctor, index, onBook }: { doctor: Doctor; index: number; onBook: (d: Doctor) => void }) {
  const initials = doctor.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-colors"
    >
      {/* Top row: avatar + availability */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-sm">
            {initials}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{doctor.name}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{doctor.credentials}</p>
          </div>
        </div>
        {doctor.available ? (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available
          </span>
        ) : (
          <span className="text-[10px] font-medium text-slate-400 bg-slate-700/50 border border-slate-700 px-2 py-0.5 rounded-full">
            Off today
          </span>
        )}
      </div>

      {/* Specialty */}
      <div className="flex items-center gap-1.5 text-xs text-teal-300 mb-3">
        <Stethoscope className="w-3.5 h-3.5" />
        {doctor.specialtyName}
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {doctor.room}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          OPD: {doctor.opdDays.join(', ')}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <CircleDollarSign className="w-3.5 h-3.5 text-slate-400" />
          Rs. {doctor.fee} consultation
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <BadgeCheck className="w-3.5 h-3.5 text-slate-400" />
          {doctor.experience} years experience
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          {doctor.rating} / 5.0 rating
        </div>
      </div>

      {/* Book button */}
      <button
        onClick={() => onBook(doctor)}
        disabled={!doctor.available}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
          doctor.available
            ? 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 hover:border-teal-500/50'
            : 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
        }`}
      >
        {doctor.available ? (
          <>
            Book Slot
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          'Not Available Today'
        )}
      </button>
    </motion.div>
  );
}
