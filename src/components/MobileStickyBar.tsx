import { Ambulance, Calendar } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';

/** Compact bottom action bar for viewports &lt; 768px — primary patient CTAs. */
export default function MobileStickyBar() {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-[45] pointer-events-none">
      <div className="pointer-events-auto border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(15,23,42,0.08)] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <a
            href="tel:1066"
            className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-12 h-12 rounded-xl text-sm font-bold bg-red-50 text-red-700 border border-red-200 active:scale-[0.98] transition-transform"
            aria-label="Call casualty 1066"
          >
            <Ambulance className="w-4 h-4 shrink-0" />
            <span className="truncate">1066</span>
          </a>
          <a
            href="#appointments"
            className="flex-[1.6] inline-flex items-center justify-center gap-1.5 min-h-12 h-12 rounded-xl text-sm font-bold bg-teal-700 text-white shadow-md shadow-teal-700/20 active:scale-[0.98] transition-transform"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">Book OPD</span>
          </a>
        </div>
        <p className="text-[10px] text-center text-slate-500 mt-1 leading-tight">
          Desk{' '}
          <a href={hospitalInfo.phoneTel} className="font-semibold text-slate-600 underline-offset-2">
            {hospitalInfo.phone}
          </a>
          <span className="mx-1 text-slate-300">·</span>
          1066 emergency
        </p>
      </div>
    </div>
  );
}
