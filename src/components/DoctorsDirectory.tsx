import { motion } from 'framer-motion';
import { Stethoscope, Calendar, ArrowRight, CircleDollarSign, IdCard, Phone } from 'lucide-react';
import { doctors, hospitalInfo, opdSpecialties, type Doctor } from '@/data/mockData';
import { formatSession } from '@/lib/dates';
import DoctorAvatar from '@/components/DoctorAvatar';
import { getActiveCamps } from '@/data/promotions';

interface DoctorsDirectoryProps {
  onBookDoctor: (doctor: Doctor) => void;
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
            Our Clinicians
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Meet our consultants
          </h2>
          <p className="text-slate-600 mt-3 text-lg">
            Request an appointment online and our reception team will call you to confirm the
            time. For other specialties, call reception.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} onBook={onBookDoctor} />
          ))}
          <div className="glass-surface p-5 flex flex-col">
            <h3 className="text-slate-900 font-semibold text-sm">Other specialties</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Maternity, eye care and more — call reception for today's consultants
              and OPD timings.
            </p>
            <a
              href={hospitalInfo.phoneTel}
              className="mt-auto pt-4 w-full flex items-center justify-center gap-2 px-4 py-3 min-h-12 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50"
            >
              <Phone className="w-4 h-4 text-teal-700" />
              Call {hospitalInfo.phone}
            </a>
          </div>
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
  onBook: (d: Doctor) => void;
}) {
  const waived =
    doctor.fee === 0 || getActiveCamps().some((c) => c.doctors.some((d) => d.name === doctor.name));
  const opd = opdSpecialties.find((s) => s.id === doctor.specialtyId);
  const feeText = waived
    ? 'Consultation: ₹0 OP Registration (Community Waiver)'
    : doctor.fee !== undefined
      ? `Consultation fee: ₹${doctor.fee}`
      : 'Fee confirmed by reception when they call you';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="group glass-surface p-5"
    >
      <div className="flex items-center gap-3 min-w-0 mb-4">
        <DoctorAvatar name={doctor.name} photo={doctor.photo} size="md" />
        <div className="min-w-0">
          <h3 className="text-slate-900 font-semibold text-sm">{doctor.name}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{doctor.credentials}</p>
          {doctor.designation && (
            <p className="text-[11px] text-teal-800 font-medium mt-0.5">{doctor.designation}</p>
          )}
        </div>
      </div>

      {doctor.registrationNumber && (
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg mb-3">
          <IdCard className="w-3.5 h-3.5 text-teal-600" />
          {doctor.registrationNumber}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-teal-700 mb-3 font-medium">
        <Stethoscope className="w-3.5 h-3.5" />
        {doctor.specialtyName}
      </div>

      <div className="space-y-2 mb-4">
        {opd && (
          <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            OPD: {formatSession(opd)}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-lg bg-teal-50/70 border border-teal-100 px-2.5 py-1.5 text-[11px] text-teal-900">
          <CircleDollarSign className="w-3.5 h-3.5 text-teal-700" />
          {feeText}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onBook(doctor)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-12 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/15"
      >
        Request appointment
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
