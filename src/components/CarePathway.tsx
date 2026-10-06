import { motion } from 'framer-motion';
import { PhoneCall, CalendarCheck2, MapPinned, HeartPulse } from 'lucide-react';

const steps = [
  {
    icon: PhoneCall,
    title: 'Call / WhatsApp',
    desc: 'Reach reception in one tap',
    href: 'tel:+918749273030',
  },
  {
    icon: CalendarCheck2,
    title: 'Book OPD Slot',
    desc: 'Pick date & doctor online',
    href: '#appointments',
  },
  {
    icon: MapPinned,
    title: 'Arrive & Token',
    desc: 'Track live queue privately',
    href: '#appointments',
  },
  {
    icon: HeartPulse,
    title: 'Consult & Care',
    desc: 'Specialist-led treatment',
    href: '#specialists',
  },
];

/** Compact patient-journey infographic for first-impression density. */
export default function CarePathway() {
  return (
    <div className="glass-surface p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-700">
          Your care pathway
        </p>
        <span className="text-[10px] text-slate-500">4 simple steps</span>
      </div>
      <ol className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {steps.map((step, i) => (
          <motion.li key={step.title} className="relative">
            {i < steps.length - 1 && (
              <div
                className="hidden lg:block absolute top-7 left-[calc(50%+28px)] right-[-12px] h-px overflow-hidden"
                aria-hidden
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-transparent"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                />
              </div>
            )}
            <motion.a
              href={step.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className="flex flex-col items-center text-center rounded-xl border border-slate-200/80 bg-white/80 px-2 py-3 hover:border-teal-300 hover:shadow-md hover:shadow-teal-600/10 transition-all"
            >
              <span className="relative mb-2">
                <span className="absolute inset-0 rounded-full bg-teal-400/20 animate-pulse-ring" />
                <span className="relative w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                  <step.icon className="w-5 h-5" />
                </span>
                <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </span>
              <span className="text-xs font-bold text-slate-900">{step.title}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 leading-snug">{step.desc}</span>
            </motion.a>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
