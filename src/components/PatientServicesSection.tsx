import { motion } from 'framer-motion';
import { ShieldCheck, Clock, FileText, CheckCircle2, Phone } from 'lucide-react';
import { hospitalInfo, insuranceProviders } from '@/data/mockData';
import AnimatedCounter from '@/components/AnimatedCounter';

interface PatientServicesSectionProps {
  onCheckEligibility: () => void;
}

const tatRows = [
  { metric: 'Pre-Auth TAT', value: '< 60 min', note: 'Typical cashless approval' },
  { metric: 'Discharge TAT', value: '< 90 min', note: 'After clinical clearance' },
  { metric: 'Required Docs', value: '3 items', note: 'Aadhaar · E-card · Referral' },
] as const;

const requiredDocs = [
  'Aadhaar / Photo ID (Govt-issued)',
  'Insurance E-Card / Policy Copy',
  "Doctor's Referral / Admission Advice",
];

export default function PatientServicesSection({ onCheckEligibility }: PatientServicesSectionProps) {
  return (
    <section id="cashless" className="relative section-pad scroll-mt-24">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl section-header"
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
            className="lg:col-span-3 glass-surface p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Empanelled Partners</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Private insurers & TPA partners for seamless cashless care
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-teal-700">
                  <AnimatedCounter value={insuranceProviders.length} suffix="+" />
                </div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide">Insurers</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              {insuranceProviders.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3"
                >
                  <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 capitalize">
                    {p.type} · {p.turnaround}
                  </div>
                </div>
              ))}
            </div>

            {/* Aligned TAT mini-table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden mb-5">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
                  Turnaround benchmarks
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2 font-semibold">Metric</th>
                    <th className="px-3 py-2 font-semibold">Target</th>
                    <th className="px-3 py-2 font-semibold hidden sm:table-cell">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {tatRows.map((row) => (
                    <tr key={row.metric} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-2.5 font-medium text-slate-800">{row.metric}</td>
                      <td className="px-3 py-2.5 font-bold text-teal-700 tabular-nums">{row.value}</td>
                      <td className="px-3 py-2.5 text-slate-500 text-xs hidden sm:table-cell">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onCheckEligibility}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-600 transition-colors shadow-md shadow-teal-700/15 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Check Eligibility
              </button>
              <a
                href={hospitalInfo.phoneTel}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-teal-300 transition-colors active:scale-95"
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
            className="lg:col-span-2 glass-surface p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FileText className="w-4 h-4 text-teal-600" />
              Required docs checklist
            </div>
            <ul className="space-y-2.5">
              {requiredDocs.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 text-sm text-teal-800 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4 shrink-0" />
                Pre-Auth TAT &lt; 60 min
              </div>
              <div className="text-xs text-teal-800/80 pl-6">Discharge TAT target &lt; 90 min</div>
            </div>
            <p className="text-xs text-slate-500">Location: Wing C — Administration, 1st Floor</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
