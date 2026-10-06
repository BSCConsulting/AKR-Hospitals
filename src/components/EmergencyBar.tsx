import { Phone, Ambulance, HeartPulse } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';

export default function EmergencyBar() {
  const contacts = [
    { icon: Ambulance, label: 'Ambulance', number: hospitalInfo.emergencyPhone, color: 'text-rose-400' },
    { icon: Phone, label: 'Call', number: hospitalInfo.phone, color: 'text-teal-400' },
    { icon: HeartPulse, label: 'Trauma', number: hospitalInfo.phone, color: 'text-amber-400' },
  ];

  return (
    <>
      {/* Mobile sticky bottom bar — strictly < 768px */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl shadow-black/50">
          <div className="grid grid-cols-3 gap-px bg-slate-800/50">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={`tel:${c.number.replace(/\s/g, '')}`}
                className="flex flex-col items-center justify-center py-2.5 bg-slate-950 active:bg-slate-900 transition-colors"
              >
                <c.icon className={`w-5 h-5 ${c.color} mb-1`} />
                <span className="text-[10px] text-slate-300 font-medium">{c.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop floating emergency panel */}
      <div className="hidden md:flex fixed bottom-6 left-6 z-40 flex-col gap-2">
        <a
          href={`tel:${hospitalInfo.emergencyPhone}`}
          className="group flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-rose-600 to-red-600 rounded-2xl shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-105 transition-all"
        >
          <div className="relative">
            <Ambulance className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-rose-600 animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-sm">{hospitalInfo.emergencyPhone}</span>
            <span className="text-rose-200 text-[10px] font-medium uppercase tracking-wide">24/7 Emergency</span>
          </div>
        </a>
      </div>
    </>
  );
}
