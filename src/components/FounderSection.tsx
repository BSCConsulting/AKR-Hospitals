import { motion } from 'framer-motion';
import { Award, Building2, HeartPulse, Landmark, Quote } from 'lucide-react';

const highlights = [
  {
    icon: Landmark,
    title: 'Public Health Governance',
    body: 'Served as District Medical & Health Officer (DM&HO), Khammam.',
  },
  {
    icon: HeartPulse,
    title: 'Clinical Stewardship',
    body: '30+ years institutional medicine & acute care management.',
  },
  {
    icon: Building2,
    title: 'Institutional Trust',
    body: 'Founded in 2008; scaled to 250 beds with NABH accreditation.',
  },
];

export default function FounderSection() {
  return (
    <section id="founder" className="relative section-pad overflow-hidden">
      <div className="relative section-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch"
        >
          {/* Left — visual anchor */}
          <div className="relative glass-surface p-4 sm:p-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-teal-300/50 via-emerald-200/40 to-sky-200/40 blur-sm" />
              <div className="relative rounded-2xl overflow-hidden border border-white shadow-lg shadow-slate-900/10 bg-slate-100 aspect-[3/4] max-h-[28rem] mx-auto">
                <img
                  src="/founder-dr-kondal-rao.png"
                  alt="Dr. A. Kondal Rao, Founder & Chief Physician"
                  className="w-full h-full object-cover object-[center_15%]"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md border border-teal-200 px-3.5 py-2 shadow-md text-xs sm:text-sm font-semibold text-teal-900">
                  <Award className="w-4 h-4 text-teal-600 shrink-0" />
                  Ex-DM&amp;HO, Khammam • 30+ Years Clinical Leadership
                </div>
              </div>
            </div>
          </div>

          {/* Right — structured authority card */}
          <div className="glass-surface p-6 sm:p-8 flex flex-col">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-teal-700 mb-3">
              Founder & Chief Physician
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Dr. A. Kondal Rao
            </h2>
            <p className="mt-1 text-base font-medium text-slate-600">MBBS</p>
            <p className="mt-1 text-xs font-semibold text-teal-800">TSMC Reg No: TSMC/04218/1992</p>

            <blockquote className="mt-6 relative rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-4">
              <Quote className="absolute top-3 right-3 w-5 h-5 text-teal-300" />
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic pr-6">
                Bringing tertiary-grade trauma and diagnostic infrastructure directly to rural
                and semi-urban communities across Khammam.
              </p>
            </blockquote>

            <ul className="mt-6 space-y-4 flex-1">
              {highlights.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-600 mt-0.5 leading-relaxed">{item.body}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-5 border-t border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-600/20">
                AKR
              </div>
              <div>
                <div className="text-xs font-bold tracking-wide text-slate-900 uppercase">
                  Institutional Seal
                </div>
                <div className="text-[11px] text-slate-500">
                  Dr. AKR&apos;s Multispeciality Hospital · Est. 2008
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
