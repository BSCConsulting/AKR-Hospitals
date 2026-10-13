import { motion } from 'framer-motion';
import { Activity, Ambulance, Bone, FlaskConical, HeartPulse, ScanLine, Scissors, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { facilities, hospitalInfo } from '@/data/mockData';

const iconMap: Record<string, LucideIcon> = {
  'scan-line': ScanLine,
  scissors: Scissors,
  flask: FlaskConical,
  'heart-pulse': HeartPulse,
  waves: Waves,
  activity: Activity,
  bone: Bone,
  ambulance: Ambulance,
};

export default function FacilitiesSection() {
  return (
    <section id="facilities" className="relative section-pad scroll-mt-20">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl section-header"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium mb-4">
            <ScanLine className="w-3.5 h-3.5" />
            Diagnostics &amp; Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Full diagnostics under one roof
          </h2>
          <p className="text-slate-600 mt-3 text-lg">
            Equipment available at {hospitalInfo.name}, Madhira.
          </p>
        </motion.div>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {facilities.map((f, index) => {
            const Icon = iconMap[f.icon] ?? Activity;
            return (
              <motion.li
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.04, duration: 0.4 }}
                className="glass-surface p-4 sm:p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-indigo-700" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{f.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{f.detail}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
