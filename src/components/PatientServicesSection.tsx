import { motion } from 'framer-motion';
import { ShieldCheck, Clock, FileText, CheckCircle2, Phone } from 'lucide-react';
import { hospitalInfo, insuranceProviders } from '@/data/mockData';

interface PatientServicesSectionProps {
  onCheckEligibility: () => void;
}

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 glass-surface p-5 sm:p-6"
          >
            <div className="mb-5">
              <h3 className="text-xl font-bold text-slate-900">Insurance partners</h3>
              <p className="text-sm text-slate-500 mt-1">
                Coverage depends on your policy — call the TPA desk to confirm before admission.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {insuranceProviders.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3"
                >
                  <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{{ tpa: 'TPA', corporate: 'Corporate insurer', government: 'Government scheme' }[p.type]}</div>
                </div>
              ))}
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
            <div className="flex items-start gap-2 rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 text-sm text-teal-800">
              <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              Bring these documents at admission so the TPA desk can start pre-authorisation
              straight away.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
