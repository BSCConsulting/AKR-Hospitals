import { motion } from 'framer-motion';
import { BedDouble, HeartPulse, Microscope, Siren } from 'lucide-react';

const facilities = [
  {
    icon: Siren,
    label: 'Emergency',
    value: 72,
    unit: 'capacity',
    tone: 'bg-red-500',
    soft: 'from-red-500/15 to-transparent',
  },
  {
    icon: BedDouble,
    label: 'Inpatient',
    value: 64,
    unit: 'occupancy',
    tone: 'bg-teal-500',
    soft: 'from-teal-500/15 to-transparent',
  },
  {
    icon: HeartPulse,
    label: 'ICU / Critical',
    value: 48,
    unit: 'utilized',
    tone: 'bg-rose-500',
    soft: 'from-rose-500/15 to-transparent',
  },
  {
    icon: Microscope,
    label: 'Diagnostics',
    value: 81,
    unit: 'throughput',
    tone: 'bg-sky-500',
    soft: 'from-sky-500/15 to-transparent',
  },
];

/** Live-feeling campus capacity bars — densifies the fold with motion + data. */
export default function FacilityPulse() {
  return (
    <section className="relative pb-6 lg:pb-8" aria-label="Campus capacity snapshot">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="glass-surface p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-end justify-between gap-2 mb-4 px-0.5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-700">
                Campus pulse
              </p>
              <p className="text-sm text-slate-600 mt-0.5">
                Real-time style snapshot of how the hospital is running today
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Live view
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {facilities.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`relative overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-br ${item.soft} bg-white/80 p-3.5`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                      <item.icon className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.label}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{item.unit}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-slate-900 tabular-nums">{item.value}%</div>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/70">
                  <motion.div
                    className={`h-full rounded-full ${item.tone}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.85, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
