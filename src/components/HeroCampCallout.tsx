import { motion } from 'framer-motion';
import { Phone, Stethoscope } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { getFeaturedCamp, SUPPORT_PHONE, SUPPORT_PHONE_TEL } from '@/data/promotions';
import { WHATSAPP_CAMP_RSVP } from '@/lib/whatsapp';
import CampCountdown from '@/components/CampCountdown';

const FALLBACK_PERKS = [
  'Free Consultation',
  '50% Off Ultrasound',
  '₹20 Sugar Test',
  '30% Off Lab Tests',
  '20% Off Pharmacy',
];

/** High-impact in-flow camp card for the hero fold. */
export default function HeroCampCallout() {
  const camp = getFeaturedCamp();
  if (!camp) return null;

  const perks = camp.benefits.length ? camp.benefits : FALLBACK_PERKS;
  const clinicians = camp.doctors
    .map((d) => `${d.name} (${d.qualification})`)
    .join(' & ');

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 }}
      aria-label="Upcoming community health camp"
      className="relative overflow-hidden rounded-2xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50/90 via-teal-50/80 to-white p-4 sm:p-5 shadow-md shadow-emerald-900/5"
    >
      <div className="pointer-events-none absolute -top-10 -right-8 w-40 h-40 rounded-full bg-teal-400/20 blur-2xl" />

      <div className="relative space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/80 border border-emerald-200 text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Upcoming Community Camp • Sunday, Oct 11, 2026
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Free Mega Urology Medical Camp
            </h2>
            <p className="text-sm font-semibold text-teal-800 mt-0.5">
              {camp.timeWindow ?? '10:00 AM – 2:00 PM'}
            </p>
          </div>
          <CampCountdown />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {perks.slice(0, 5).map((perk) => (
            <span
              key={perk}
              className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium bg-white border border-emerald-200/80 text-slate-700 shadow-sm"
            >
              {perk}
            </span>
          ))}
        </div>

        {clinicians && (
          <p className="flex items-start gap-1.5 text-xs text-slate-600">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
            <span>
              Led by <span className="font-semibold text-slate-800">{clinicians}</span>
            </span>
          </p>
        )}

        <p className="text-[11px] text-slate-600 leading-relaxed rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2">
          <strong className="text-slate-800">Ultrasound subsidy:</strong> 50% off ultrasound applies
          during camp hours (Sunday, Oct 11, 2026 · 10:00 AM – 2:00 PM) and notified OPD windows —
          present camp token / RSVP confirmation at the diagnostics desk. Routine scans outside these
          windows follow standard tariffs unless a separate subsidy is announced.
        </p>

        <div className="flex flex-col xs:flex-row sm:flex-row gap-2 pt-0.5">
          <a
            href={WHATSAPP_CAMP_RSVP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors shadow-sm"
          >
            <WhatsAppIcon className="w-4 h-4" />
            WhatsApp RSVP
          </a>
          <a
            href={SUPPORT_PHONE_TEL}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-teal-300 transition-colors"
          >
            <Phone className="w-4 h-4 text-teal-600" />
            Call Support ({SUPPORT_PHONE.replace('+91 ', '')})
          </a>
        </div>
      </div>
    </motion.aside>
  );
}
