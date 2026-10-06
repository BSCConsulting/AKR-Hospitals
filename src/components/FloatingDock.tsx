import WhatsAppIcon from '@/components/WhatsAppIcon';
import { WHATSAPP_LINK } from '@/components/WhatsAppButton';

interface FloatingDockProps {
  onOpenCareBot: () => void;
  careBotOpen: boolean;
}

/** Vertically stacked WhatsApp + CareBot dock — avoids FAB collision. */
export default function FloatingDock({ onOpenCareBot, careBotOpen }: FloatingDockProps) {
  if (careBotOpen) return null;

  return (
    <div
      className="fixed z-40 flex flex-col-reverse gap-4 items-center right-4 md:right-6 bottom-20 md:bottom-6"
      aria-label="Quick contact tools"
    >
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <div className="absolute inset-0 bg-[#25D366]/35 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
          <WhatsAppIcon className="w-7 h-7 text-white" />
        </div>
      </a>

      <button
        type="button"
        onClick={onOpenCareBot}
        className="group relative"
        aria-label="Open CareBot assistant"
        title="CareBot"
      >
        <div className="absolute inset-0 bg-teal-400/30 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white border border-white shadow-lg shadow-slate-900/10 ring-2 ring-teal-100 group-hover:scale-105 transition-transform">
          <img src="/carebot-avatar.webp" alt="" className="w-full h-full object-cover" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
      </button>
    </div>
  );
}
