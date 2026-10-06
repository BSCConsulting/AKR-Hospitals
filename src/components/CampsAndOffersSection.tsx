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

function CampFeatureCard({ camp }: { camp: Promotion }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-slate-900/90 p-5 sm:p-7 shadow-2xl shadow-teal-950/40"
    >
      <div className="pointer-events-none absolute -top-24 -right-16 w-64 h-64 rounded-full bg-teal-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-teal-400/10" />

      <div className="relative space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-500/15 border border-rose-500/30 text-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            {camp.statusLabel ?? 'LIMITED TIME CAMP'}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-teal-500/15 border border-teal-500/30 text-teal-200">
            {camp.highlightBadge}
          </span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {camp.title}
          </h3>
          <p className="mt-2 flex items-start gap-2 text-sm text-slate-300">
            <CalendarDays className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
            {camp.date}
          </p>
        </div>

        {camp.timeWindow && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
            <Clock className="w-5 h-5 text-emerald-300" />
            <div>
              <div className="text-[10px] uppercase tracking-wide text-emerald-300/80 font-semibold">
                Camp Hours
              </div>
              <div className="text-sm sm:text-base font-bold text-white">{camp.timeWindow}</div>
            </div>
          </div>
        )}

        {camp.doctors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              Featured clinicians
            </div>
            <div className="grid gap-2">
              {camp.doctors.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/25 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4 text-teal-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{doc.name}</div>
                    <div className="text-[11px] text-teal-300">{doc.title}</div>
                    <div className="text-[11px] text-slate-400">{doc.qualification}</div>
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
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 border border-slate-700 text-slate-200"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {b}
              </span>
            ))}
          </div>
        )}

        {camp.symptoms.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-2">Common concerns we address:</p>
            <div className="flex flex-wrap gap-1.5">
              {camp.symptoms.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800/60 text-slate-300 border border-slate-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <a
            href={camp.whatsappCTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Book Camp Slot via WhatsApp
          </a>
          <a
            href={SUPPORT_PHONE_TEL}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-800 text-slate-100 border border-slate-700 hover:border-teal-500/40 transition-colors"
          >
            <Phone className="w-4 h-4 text-teal-400" />
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
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7"
    >
      <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 bg-teal-500/10 blur-3xl rounded-full" />

      <div className="relative space-y-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-teal-500/15 border border-teal-500/30 text-teal-200">
          <ShieldCheck className="w-3 h-3" />
          Always Active
        </div>

        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Routine Community Subsidies
          </h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Everyday care concessions for Madhira and surrounding communities — available
            alongside emergency triage around the clock.
          </p>
        </div>

        <ul className="space-y-2.5">
          {ROUTINE_SUBSIDIES.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3.5 py-2.5"
            >
              <span className="text-sm text-slate-200">{item.label}</span>
              <span className="text-sm font-bold text-emerald-300">{item.value}</span>
            </li>
          ))}
        </ul>

        <p className="text-[11px] text-slate-500">
          * Ultrasound subsidy applies during camp hours and selected OPD windows. Confirm at reception.
        </p>

        <a
          href="#appointments"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-500 hover:to-emerald-500 transition-all shadow-lg shadow-teal-600/20"
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
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7"
    >
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-sky-500/15 border border-sky-500/30 text-sky-200 mb-4">
        <HeartPulse className="w-3 h-3" />
        Preventative Care
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight">
        Preventative Health Packages
      </h3>
      <p className="mt-2 text-sm text-slate-300 leading-relaxed">
        No camp is scheduled right now. Explore our preventative packages — basic health
        checkups, diabetes screening, and senior wellness panels with community pricing.
      </p>
      <ul className="mt-4 space-y-2">
        {['Basic Health Checkup', 'Diabetes & Sugar Panel', 'Senior Wellness Screen'].map(
          (pkg) => (
            <li key={pkg} className="flex items-center gap-2 text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              {pkg}
            </li>
          )
        )}
      </ul>
      <a
        href={`https://wa.me/919849057185?text=${encodeURIComponent(
          'Hello AKR Hospital, I want details on preventative health packages.'
        )}`}
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
    <section id="camps" className="relative bg-slate-950 py-20 lg:py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Community Initiatives
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Special Health Camps & Care Subsidies
          </h2>
          <p className="text-slate-300 mt-3 text-lg leading-relaxed">
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
