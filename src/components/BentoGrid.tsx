import { motion } from 'framer-motion';
import {
  Ambulance,
  Baby,
  Eye,
  HeartPulse,
  Scissors,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { departments, type Department } from '@/data/mockData';

const iconMap: Record<string, LucideIcon> = {
  ambulance: Ambulance,
  baby: Baby,
  eye: Eye,
  'heart-pulse': HeartPulse,
  scissors: Scissors,
  activity: Activity,
};

export default function BentoGrid() {
  return (
    <section id="departments" className="relative section-pad">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl section-header"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium mb-4">
            <Activity className="w-3.5 h-3.5" />
            Clinical Wings
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Our clinical departments
          </h2>
          <p className="text-slate-600 mt-3 text-lg">
            24/7 emergency care, cardiology, laparoscopic surgery, urology, maternity and eye care
            — under one roof in Madhira.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-6">
          {departments.map((dept, index) => (
            <BentoCard
              key={dept.id}
              dept={dept}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  dept,
  index,
}: {
  dept: Department;
  index: number;
}) {
  const Icon = iconMap[dept.icon] ?? Activity;
  const isHighlighted = dept.highlight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden glass-surface md:col-span-3 lg:col-span-4 p-5 ${
        isHighlighted ? 'lg:p-6' : ''
      }`}
    >
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
        style={{ backgroundColor: dept.accent }}
      />

      <div className="relative h-full flex flex-col min-h-[200px]">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`rounded-xl flex items-center justify-center ${
              isHighlighted ? 'w-12 h-12' : 'w-11 h-11'
            }`}
            style={{
              backgroundColor: `${dept.accent}14`,
              border: `1px solid ${dept.accent}33`,
            }}
          >
            <Icon className="w-5 h-5" strokeWidth={2} style={{ color: dept.accent }} />
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${dept.accent}12`, color: dept.accent }}
          >
            {dept.shortName}
          </span>
        </div>

        <h3 className={`font-bold text-slate-900 tracking-tight ${isHighlighted ? 'text-lg' : 'text-base'}`}>
          {dept.name}
        </h3>
        <p className="text-slate-600 mt-2 leading-relaxed text-sm line-clamp-3">
          {dept.description}
        </p>

        <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
          {dept.features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {f}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
