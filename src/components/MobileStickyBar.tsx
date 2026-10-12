import { Ambulance, Calendar, MessageCircle } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';
import { WHATSAPP_OPD_INQUIRE } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const secondary =
  'flex-1 min-w-0 inline-flex flex-col items-center justify-center gap-0.5 h-12 rounded-xl text-xs font-semibold border active:scale-[0.98] transition-transform';

/** Bottom action bar for viewports &lt; 768px — replaces the floating contact button so nothing covers content. */
export default function MobileStickyBar({ onOpenCareBot }: { onOpenCareBot: () => void }) {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-[45] border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(15,23,42,0.08)] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-1.5 max-w-lg mx-auto">
        <a
          href={hospitalInfo.phoneTel}
          className={`${secondary} bg-red-50 text-red-700 border-red-200`}
          aria-label={`Call 24/7 casualty ${hospitalInfo.phone}`}
        >
          <Ambulance className="w-4 h-4" />
          Casualty
        </a>
        <a
          href={WHATSAPP_OPD_INQUIRE}
          target="_blank"
          rel="noopener noreferrer"
          className={`${secondary} bg-white text-slate-800 border-slate-200`}
        >
          <WhatsAppIcon className="w-4 h-4 text-[#0B6E62]" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={onOpenCareBot}
          className={`${secondary} bg-white text-slate-800 border-slate-200`}
        >
          <MessageCircle className="w-4 h-4 text-teal-700" />
          CareBot
        </button>
        <a
          href="#appointments"
          className="flex-[1.4] min-w-0 inline-flex items-center justify-center gap-1.5 h-12 rounded-xl text-sm font-bold bg-teal-700 text-white shadow-md shadow-teal-700/20 active:scale-[0.98] transition-transform"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          Book OPD
        </a>
      </div>
    </div>
  );
}
