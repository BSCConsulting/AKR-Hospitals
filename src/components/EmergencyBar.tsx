import { Ambulance } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';

export default function EmergencyBar() {
  return (
    <>
      {/* Mobile: compact high-contrast emergency strip above home indicator */}
      <a
        href={`tel:${hospitalInfo.emergencyPhone}`}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-3 bg-[#DC2626] text-white font-semibold text-sm shadow-[0_-4px_20px_rgba(220,38,38,0.25)]"
        aria-label="Call 1066 emergency hotline"
      >
        <Ambulance className="w-4 h-4" />
        {hospitalInfo.emergencyPhone} · 24/7 EMERGENCY
      </a>

      {/* Desktop / tablet: pinned bottom-left, no collision with right dock */}
      <a
        href={`tel:${hospitalInfo.emergencyPhone}`}
        className="hidden md:flex fixed bottom-6 left-6 z-50 items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#DC2626] text-white shadow-xl shadow-red-600/25 hover:bg-red-700 hover:scale-[1.02] transition-all"
        aria-label="Call 1066 emergency hotline"
      >
        <div className="relative">
          <Ambulance className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-red-600 animate-pulse" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-sm tracking-wide">{hospitalInfo.emergencyPhone}</span>
          <span className="text-red-100 text-[10px] font-semibold uppercase tracking-wide mt-0.5">
            24/7 Emergency
          </span>
        </div>
      </a>
    </>
  );
}
