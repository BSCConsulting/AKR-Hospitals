import { motion } from 'framer-motion';
import { ShieldCheck, Clock, FileText, CheckCircle2, Phone } from 'lucide-react';
import { hospitalInfo, insuranceProviders } from '@/data/mockData';

interface PatientServicesSectionProps {
  onCheckEligibility: () => void;
}

export default function PatientServicesSection({ onCheckEligibility }: PatientServicesSectionProps) {
  return (
    <section id="cashless" className="relative py-12 lg:py-14 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-7"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Patient Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Cashless Insurance & TPA Desk
          </h2>
          <p className="text-slate-600 mt-3 text-lg leading-relaxed">
            Dedicated administrative support for cashless admissions, pre-authorization, and
            claim facilitation — separate from our clinical centers of excellence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 glass-surface p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Empanelled Partners</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Private insurers & TPA partners for seamless cashless care
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-teal-700">{insuranceProviders.length}+</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide">Insurers</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {insuranceProviders.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3"
                >
                  <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 capitalize">{p.type} · {p.turnaround}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onCheckEligibility}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-500 transition-colors shadow-md shadow-teal-600/15"
              >
                <CheckCircle2 className="w-4 h-4" />
                Check Eligibility
              </button>
              <a
                href={`tel:${hospitalInfo.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-teal-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                Call TPA Desk · {hospitalInfo.phone}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-2 glass-surface p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FileText className="w-4 h-4 text-teal-600" />
              Bring to the desk
            </div>
            <ul className="space-y-2.5">
              {[
                'Insurance E-Card / Policy Copy',
                "Doctor's Admission Advice",
                'Photo ID (Voter ID / Govt ID)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 flex items-center gap-2 text-sm text-teal-800">
              <Clock className="w-4 h-4 shrink-0" />
              Typical pre-auth turnaround under 60 minutes
            </div>
            <p className="text-xs text-slate-500">
              Location: Wing C — Administration, 1st Floor
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
