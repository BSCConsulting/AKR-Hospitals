import { motion } from 'framer-motion';
import { Activity, Ambulance, TestTube, Droplet } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';

const stats = [
  {
    icon: Ambulance,
    value: '24/7',
    label: 'Casualty & pharmacy',
    sub: 'Open round the clock',
    color: 'from-rose-500 to-orange-400',
  },
  {
    icon: TestTube,
    value: '30% off',
    label: 'Laboratory tests',
    sub: 'Flat discount on all lab tests',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    icon: Droplet,
    value: '₹20',
    label: 'Sugar test',
    sub: 'Routine blood glucose',
    color: 'from-sky-500 to-cyan-500',
  },
  {
    icon: Activity,
    value: hospitalInfo.established,
    label: 'Serving since',
    sub: 'Community healthcare in Madhira',
    color: 'from-amber-500 to-orange-500',
  },
];

/** Dense impact band — only facts the hospital advertises itself. */
export default function ImpactStats() {
  return (
    <section className="relative py-6 sm:py-8 md:py-10" aria-label="Hospital highlights">
      <div className="section-shell">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative overflow-hidden glass-surface p-3 sm:p-5 group min-h-[7.5rem] sm:min-h-0"
            >
              <div
                className={`absolute -right-4 -top-4 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br ${stat.color} opacity-15 blur-xl group-hover:opacity-25 transition-opacity`}
              />
              <div
                className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-md mb-2 sm:mb-3`}
              >
                <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="relative text-xl sm:text-3xl font-bold text-slate-900 tracking-tight tabular-nums leading-none">
                {stat.value}
              </div>
              <div className="relative text-xs sm:text-sm font-semibold text-slate-800 mt-1.5 leading-snug">
                {stat.label}
              </div>
              <div className="relative text-xs text-slate-500 mt-0.5 leading-snug">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
