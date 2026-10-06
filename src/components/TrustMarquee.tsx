import { ShieldCheck, Award, Ambulance, Building2, Clock, BadgeCheck } from 'lucide-react';
import { accreditation } from '@/data/compliance';

const items = [
  { icon: ShieldCheck, label: accreditation.nabh.full },
  { icon: Award, label: accreditation.iso.short },
  { icon: Ambulance, label: '24/7 Trauma & Casualty' },
  { icon: Building2, label: '250-Bed Campus' },
  { icon: Clock, label: 'OPD 9 AM – 8 PM' },
  { icon: BadgeCheck, label: 'Cashless TPA Desk' },
  { icon: ShieldCheck, label: 'Est. 2008 · Madhira' },
  { icon: Award, label: '5+ Insurance Partners' },
];

/** Continuous trust ticker — adds motion without cluttering the hero. */
export default function TrustMarquee() {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-teal-100/80 bg-gradient-to-r from-teal-50/80 via-white to-sky-50/80 py-2.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
      <div className="flex w-max animate-ticker gap-8 pr-8">
        {loop.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 whitespace-nowrap"
          >
            <item.icon className="w-3.5 h-3.5 text-teal-600" />
            {item.label}
            <span className="text-teal-300 ml-6">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
