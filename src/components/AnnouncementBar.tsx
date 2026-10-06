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
      setVisible(sessionStorage.getItem(DISMISS_KEY) !== '1');
    } catch {
      setVisible(true);
    }
  }, [active]);

  if (!active || !visible || !featured) return null;

  const alertText =
    featured.announcementText ?? `${featured.title} — ${featured.highlightBadge}`;
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
      className="relative z-[60] bg-teal-50/90 border-b border-teal-200/80 text-teal-900 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center gap-2 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
          <span className="relative mt-1 sm:mt-0 shrink-0 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-snug min-w-0">
            <span className="font-semibold text-slate-900">Active Camp:</span>{' '}
            <span className="line-clamp-2 sm:line-clamp-1">{alertText}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={featured.whatsappCTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ctaLabel}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-teal-100/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
