import { motion } from 'framer-motion';
import { Activity, Users, Hospital, Timer } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { hospitalInfo } from '@/data/mockData';

const stats = [
  {
    icon: Hospital,
    value: hospitalInfo.beds,
    suffix: '+',
    label: 'Inpatient beds',
    sub: 'Multi-speciality capacity',
    color: 'from-rose-500 to-orange-400',
  },
  {
    icon: Users,
    value: hospitalInfo.doctors,
    suffix: '+',
    label: 'Consultants',
    sub: 'Across clinical wings',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    icon: Timer,
    value: 8,
    suffix: ' min',
    label: 'Trauma response',
    sub: 'Target door-to-care',
    color: 'from-sky-500 to-cyan-500',
  },
  {
    icon: Activity,
    value: Number(hospitalInfo.established),
    suffix: '',
    label: 'Serving since',
    sub: 'Community healthcare',
    color: 'from-amber-500 to-orange-500',
    isYear: true,
  },
];

/** Dense animated impact band — fills visual whitespace with proof. */
export default function ImpactStats() {
  return (
    <section className="relative py-8 lg:py-10" aria-label="Hospital impact metrics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative overflow-hidden glass-surface p-4 sm:p-5 group"
            >
              <div
                className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} opacity-15 blur-xl group-hover:opacity-25 transition-opacity`}
              />
              <div
                className={`relative w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-md mb-3`}
              >
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="relative text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                {stat.isYear ? (
                  <AnimatedCounter value={stat.value} />
                ) : (
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="relative text-sm font-semibold text-slate-800 mt-1">{stat.label}</div>
              <div className="relative text-[11px] text-slate-500 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
