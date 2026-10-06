import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import {
  getActivePromotions,
  getFeaturedCamp,
  hasActivePromotion,
} from '@/data/promotions';

const DISMISS_KEY = 'akr-announcement-dismissed';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  const featured = getFeaturedCamp() ?? getActivePromotions()[0];
  const active = hasActivePromotion() && Boolean(featured);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    try {
      const dismissed = sessionStorage.getItem(DISMISS_KEY);
      setVisible(dismissed !== '1');
    } catch {
      setVisible(true);
    }
  }, [active]);

  if (!active || !visible || !featured) return null;

  const alertText =
    featured.announcementText ??
    `${featured.title} — ${featured.highlightBadge}`;

  const ctaHref = featured.whatsappCTA;
  const ctaLabel = featured.type === 'camp' ? 'RSVP via WhatsApp' : 'Claim Free Token';

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Active health camp and offers"
      className="relative z-[60] bg-teal-950/80 border-b border-teal-500/30 text-teal-200 backdrop-blur-md"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-teal-500/10 via-transparent to-emerald-500/10" />
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center gap-2 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
          <span className="relative mt-1 sm:mt-0 shrink-0 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-rose-400/40" />
          </span>
          <p className="text-xs sm:text-sm text-teal-100 leading-snug min-w-0">
            <span className="font-semibold text-white">Active Camp:</span>{' '}
            <span className="line-clamp-2 sm:line-clamp-1">{alertText}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">{ctaLabel}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="p-1.5 rounded-lg text-teal-300/80 hover:text-white hover:bg-teal-800/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
