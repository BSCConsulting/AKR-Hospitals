import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  HeartPulse,
  Phone,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import {
  getFeaturedCamp,
  getActiveCamps,
  ROUTINE_SUBSIDIES,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
  type Promotion,
} from '@/data/promotions';
import { WHATSAPP_OPD_INQUIRE } from '@/lib/whatsapp';

function CampFeatureCard({ camp }: { camp: Promotion }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden glass-surface p-5 sm:p-7 ring-1 ring-teal-100"
    >
      <div className="pointer-events-none absolute -top-24 -right-16 w-64 h-64 rounded-full bg-teal-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-50 border border-rose-200 text-rose-700">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {camp.statusLabel ?? 'LIMITED TIME CAMP'}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-teal-50 border border-teal-200 text-teal-800">
            {camp.highlightBadge}
          </span>
        </div>

        {/* Relocated offer pills — static inline (not floating FABs) */}
        <div className="flex flex-wrap gap-2">
          {['Free Consultation', '₹20 Sugar Test', '30% Off Lab Tests', 'Ultrasound Scan 50% Off', '20% Off Pharmacy'].map(
            (pill) => (
              <span
                key={pill}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white border border-slate-200 text-slate-700 shadow-sm"
              >
                {pill}
              </span>
            )
          )}
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{camp.title}</h3>
          <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
            <CalendarDays className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            {camp.date}
          </p>
        </div>

        {camp.timeWindow && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <Clock className="w-5 h-5 text-emerald-700" />
            <div>
              <div className="text-[10px] uppercase tracking-wide text-emerald-700/80 font-semibold">
                Camp Hours
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900">{camp.timeWindow}</div>
            </div>
          </div>
        )}

        {camp.doctors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              Featured clinicians
            </div>
            <div className="grid gap-2">
              {camp.doctors.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4 text-teal-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{doc.name}</div>
                    <div className="text-[11px] text-teal-700">{doc.title}</div>
                    <div className="text-[11px] text-slate-500">{doc.qualification}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {camp.benefits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {camp.benefits.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-700"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {b}
              </span>
            ))}
          </div>
        )}

        {camp.symptoms.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">Common concerns we address:</p>
            <div className="flex flex-wrap gap-1.5">
              {camp.symptoms.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-white text-slate-600 border border-slate-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-600 leading-relaxed rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2">
          <strong className="text-slate-800">Ultrasound subsidy condition:</strong> 50% off ultrasound
          is valid only during camp hours ({camp.timeWindow ?? 'see schedule'}) on the camp date, or
          other windows notified by the hospital. Bring your WhatsApp RSVP / camp token to diagnostics.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <a
            href={camp.whatsappCTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors shadow-md shadow-[#25D366]/20"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Book Camp Slot via WhatsApp
          </a>
          <a
            href={SUPPORT_PHONE_TEL}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-teal-300 transition-colors"
          >
            <Phone className="w-4 h-4 text-teal-600" />
            Call Support ({SUPPORT_PHONE.replace('+91 ', '')})
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function RoutineSubsidiesCard() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="relative overflow-hidden glass-surface p-5 sm:p-7"
    >
      <div className="relative space-y-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-teal-50 border border-teal-200 text-teal-800">
          <ShieldCheck className="w-3 h-3" />
          Always Active
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Routine Community Subsidies
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Everyday care concessions for Madhira and surrounding communities — available
            alongside emergency triage around the clock.
          </p>
        </div>

        <ul className="space-y-2.5">
          {ROUTINE_SUBSIDIES.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5"
            >
              <span className="text-sm text-slate-700">{item.label}</span>
              <span className="text-sm font-bold text-emerald-700">{item.value}</span>
            </li>
          ))}
        </ul>

        <p className="text-[11px] text-slate-500">
          * Ultrasound subsidy applies during camp hours and selected OPD windows. Confirm at reception.
        </p>

        <a
          href="#appointments"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-500 transition-all shadow-md shadow-teal-600/15"
        >
          <CalendarDays className="w-4 h-4" />
          Check OPD Timings & Book
        </a>
      </div>
    </motion.article>
  );
}

function PreventativePackagesFallback() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden glass-surface p-5 sm:p-7"
    >
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-sky-50 border border-sky-200 text-sky-800 mb-4">
        <HeartPulse className="w-3 h-3" />
        Preventative Care
      </div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight">Preventative Health Packages</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        No camp is scheduled right now. Explore our preventative packages — basic health
        checkups, diabetes screening, and senior wellness panels with community pricing.
      </p>
      <ul className="mt-4 space-y-2">
        {['Basic Health Checkup', 'Diabetes & Sugar Panel', 'Senior Wellness Screen'].map((pkg) => (
          <li key={pkg} className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            {pkg}
          </li>
        ))}
      </ul>
      <a
        href={WHATSAPP_OPD_INQUIRE}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
      >
        <WhatsAppIcon className="w-4 h-4" />
        Enquire on WhatsApp
      </a>
    </motion.article>
  );
}

export default function CampsAndOffersSection() {
  const featuredCamp = getFeaturedCamp();
  const hasCamp = getActiveCamps().length > 0;

  return (
    <section id="camps" className="relative py-12 lg:py-14 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-7 sm:mb-7"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Community Initiatives
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Special Health Camps & Care Subsidies
          </h2>
          <p className="text-slate-600 mt-3 text-lg leading-relaxed">
            Recurring mega camps and everyday discounts — free OP, lab & pharmacy
            subsidies, and specialist outreach for our community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {hasCamp && featuredCamp ? (
            <CampFeatureCard camp={featuredCamp} />
          ) : (
            <PreventativePackagesFallback />
          )}
          <RoutineSubsidiesCard />
        </div>
      </div>
    </section>
  );
}
