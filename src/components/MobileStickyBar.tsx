import { Ambulance, Calendar } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';

/** Compact bottom action bar for viewports &lt; 768px. */
export default function MobileStickyBar() {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-[45] pointer-events-none">
      <div className="pointer-events-auto border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(15,23,42,0.08)] px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <div className="section-shell !px-0 flex items-center gap-2">
          <a
            href="tel:1066"
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-bold bg-red-50 text-red-700 border border-red-200 active:scale-95 transition-transform"
            aria-label="Call casualty 1066"
          >
            <Ambulance className="w-4 h-4" />
            Casualty: 1066
          </a>
          <a
            href="#appointments"
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-bold bg-teal-700 text-white shadow-md shadow-teal-700/20 active:scale-95 transition-transform"
          >
            <Calendar className="w-4 h-4" />
            Book OPD Slot
          </a>
        </div>
        <p className="text-[9px] text-center text-slate-500 mt-1">
          Primary desk {hospitalInfo.phone} · 1066 {hospitalInfo.emergencyDispatchLabel}
        </p>
      </div>
    </div>
  );
}
