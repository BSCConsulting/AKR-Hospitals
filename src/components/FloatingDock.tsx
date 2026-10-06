import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { WHATSAPP_OPD_INQUIRE } from '@/lib/whatsapp';

interface FloatingDockProps {
  onOpenCareBot: () => void;
  careBotOpen: boolean;
}

/** Single expandable FAB menu — WhatsApp + CareBot. */
export default function FloatingDock({ onOpenCareBot, careBotOpen }: FloatingDockProps) {
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (careBotOpen) setExpanded(false);
  }, [careBotOpen]);

  useEffect(() => {
    if (!expanded) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setExpanded(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [expanded]);

  if (careBotOpen) return null;

  return (
    <div
      ref={rootRef}
      className="fixed z-40 right-4 md:right-6 bottom-[5.75rem] md:bottom-6 flex flex-col-reverse items-center gap-3"
      aria-label="Quick contact menu"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Close contact menu' : 'Open contact menu'}
        className="relative w-14 h-14 rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/30 flex items-center justify-center hover:bg-teal-500 transition-colors"
      >
        {expanded ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!expanded && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.a
              key="wa"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              href={WHATSAPP_OPD_INQUIRE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 pl-3 pr-4 h-12 rounded-full bg-[#25D366] text-white text-sm font-semibold shadow-lg shadow-[#25D366]/25 hover:bg-[#20bd5a]"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp
            </motion.a>
            <motion.button
              key="bot"
              type="button"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.15, delay: 0.04 }}
              onClick={() => {
                setExpanded(false);
                onOpenCareBot();
              }}
              className="flex items-center gap-2 pl-2 pr-4 h-12 rounded-full bg-white text-slate-800 text-sm font-semibold border border-slate-200 shadow-lg shadow-slate-900/10 hover:border-teal-300"
              aria-label="Open CareBot assistant"
            >
              <span className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-teal-100 shrink-0">
                <img src="/carebot-avatar.webp" alt="" className="w-full h-full object-cover" />
              </span>
              CareBot
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
