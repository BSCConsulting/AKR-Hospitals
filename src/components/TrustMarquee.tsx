import { ShieldCheck, Ambulance, ScanLine, BadgeCheck, TestTube, Building2, Stethoscope } from 'lucide-react';

const items = [
  { icon: Ambulance, label: '24/7 Casualty & Ambulance' },
  { icon: Stethoscope, label: 'Family physician on duty 24/7' },
  { icon: ScanLine, label: 'CT · 2D Echo · X-Ray · Ultrasound' },
  { icon: BadgeCheck, label: 'Cashless TPA Desk' },
  { icon: TestTube, label: '30% off lab tests' },
  { icon: Building2, label: 'Madhira · Vijayawada' },
  { icon: ShieldCheck, label: 'Est. 2008 · Madhira' },
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
            aria-hidden={i >= items.length || undefined}
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
