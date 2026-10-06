import { motion } from 'framer-motion';
import { Award, Stethoscope } from 'lucide-react';

export default function FounderSection() {
  return (
    <section id="founder" className="relative bg-slate-950 py-20 lg:py-28 overflow-hidden">
      {/* Soft medical atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium mb-4">
            <Stethoscope className="w-3.5 h-3.5" />
            Leadership
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Meet Our Founder
          </h2>
          <p className="text-slate-300 mt-3 text-lg leading-relaxed">
            A dedicated and experienced professional committed to your health.
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-6 sm:p-10 shadow-2xl shadow-black/40"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-teal-400 via-emerald-500 to-teal-700 opacity-80 blur-[2px]" />
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[3px] bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/20">
                <img
                  src="/founder-dr-kondal-rao.png"
                  alt="Dr. A. Kondal Rao, Founder & Chief Physician"
                  className="w-full h-full rounded-full object-cover object-[center_18%] bg-slate-800 ring-4 ring-slate-900"
                  loading="lazy"
                />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Dr. A. Kondal Rao
            </h3>
            <p className="mt-1.5 text-sm sm:text-base font-medium text-teal-300">
              Founder & Chief Physician
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-teal-200">
              <Award className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>MBBS | Ex-DM&amp;HO (Khammam)</span>
            </div>

            <p className="mt-6 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              With over three decades of distinguished clinical and public healthcare
              leadership, Dr. A. Kondal Rao serves as the Founder and Chief Physician of
              AKR Super Speciality Hospital. Formerly the District Medical &amp; Health
              Officer (DM&amp;HO) for Khammam, Dr. Rao brings seasoned clinical acumen
              and strategic healthcare governance to the institution. Under his
              stewardship, the hospital delivers patient-centered, compassionate care
              guided by multidisciplinary clinical excellence and rigorous medical
              standards.
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
