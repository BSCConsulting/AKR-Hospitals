import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroTriage, { type BookingPrefill } from '@/components/HeroTriage';
import TrustMarquee from '@/components/TrustMarquee';
import ImpactStats from '@/components/ImpactStats';
import CampsAndOffersSection from '@/components/CampsAndOffersSection';
import BentoGrid from '@/components/BentoGrid';
import FacilitiesSection from '@/components/FacilitiesSection';
import PatientServicesSection from '@/components/PatientServicesSection';
import FloatingDock from '@/components/FloatingDock';
import MobileStickyBar from '@/components/MobileStickyBar';
import type { BookingResult } from '@/components/BookingModal';
import DoctorsDirectory from '@/components/DoctorsDirectory';
import FounderSection from '@/components/FounderSection';
import LocationSection from '@/components/LocationSection';
import StatutoryFooter from '@/components/StatutoryFooter';
import { WHATSAPP_OPD_INQUIRE } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { Phone, MapPin, Clock } from 'lucide-react';
import { hospitalInfo, branches, opdSpecialties, familyPhysician, type Doctor } from '@/data/mockData';
import { formatSession } from '@/lib/dates';

const LiveTokenDrawer = lazy(() => import('@/components/LiveTokenDrawer'));
const BookingModal = lazy(() => import('@/components/BookingModal'));
const EligibilityChecker = lazy(() => import('@/components/EligibilityChecker'));
const CareBot = lazy(() => import('@/components/CareBot'));

function Footer() {
  return (
    <footer id="contact" className="relative bg-white/70 border-t border-slate-200 pb-24 md:pb-10">
      <div className="section-shell py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 — Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src={hospitalInfo.logo} alt="" width={40} height={40} className="w-10 h-10 rounded-xl" />
              <div>
                <span className="text-slate-900 font-bold text-base">
                  AKR <span className="text-teal-700">Super Speciality</span>
                </span>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Hospitals · Madhira</div>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {hospitalInfo.tagline} Serving Madhira, Telangana since {hospitalInfo.established} with
              compassion and clinical excellence.
            </p>
            <a
              href="#branches"
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 hover:border-teal-300 transition-colors"
            >
              <img src={branches[1].logo} alt="" width={32} height={32} className="w-8 h-8 rounded-lg" />
              <span className="text-xs text-slate-600 leading-snug">
                Sister hospital in {branches[1].city}:{' '}
                <span className="font-semibold text-slate-900">{branches[1].name}</span>
              </span>
            </a>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="space-y-3">
            <h2 className="text-slate-900 font-semibold text-sm">Quick Links</h2>
            <nav className="flex flex-col text-sm">
              {[
                { href: '#departments', label: 'Specialties / Clinical Wings' },
                { href: '#facilities', label: 'Facilities & Diagnostics' },
                { href: '#camps', label: 'Health Camps & Offers' },
                { href: '#cashless', label: 'TPA / Cashless Desk' },
                { href: '#specialists', label: 'Our Consultants' },
                { href: '#appointments', label: 'Request an Appointment' },
                { href: '#founder', label: 'Meet Our Founder' },
                { href: '#branches', label: 'Our Hospitals (Madhira & Vijayawada)' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center min-h-11 md:min-h-0 md:py-1 text-slate-600 hover:text-teal-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3 — Address & contact */}
          <div className="space-y-3">
            <h2 className="text-slate-900 font-semibold text-sm">Visit & Contact</h2>
            <div className="flex items-start gap-2.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
              <span>{hospitalInfo.address}</span>
            </div>
            <a
              href={hospitalInfo.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 px-3 min-h-11 rounded-full hover:bg-teal-100 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Google Maps Directions
            </a>
            <a
              href={hospitalInfo.phoneTel}
              className="flex items-center gap-2.5 min-h-11 text-sm text-slate-600 hover:text-teal-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-teal-600 shrink-0" />
              Desk · {hospitalInfo.phone}
            </a>
            <a
              href={WHATSAPP_OPD_INQUIRE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 min-h-11 text-sm text-slate-600 hover:text-[#0B6E62] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#0B6E62] shrink-0" />
              {hospitalInfo.appointmentLine} (WhatsApp)
            </a>
          </div>

          {/* Col 4 — Emergency */}
          <div className="space-y-3">
            <h2 className="text-slate-900 font-semibold text-sm">Emergency Helpline</h2>
            <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3.5 space-y-2.5">
              <a
                href={hospitalInfo.phoneTel}
                className="flex items-start gap-2.5 text-sm hover:opacity-90 transition-opacity"
              >
                <Clock className="w-4 h-4 mt-0.5 text-red-600 shrink-0" />
                <div>
                  <div className="text-red-800 font-bold text-xs uppercase tracking-wide">
                    Casualty · Primary
                  </div>
                  <div className="text-red-700 font-bold text-lg mt-0.5">{hospitalInfo.phone}</div>
                  <div className="text-xs text-red-800 mt-0.5">24/7 casualty, family physician & ambulance</div>
                </div>
              </a>
              <div className="pl-6 border-t border-red-200/80 pt-2">
                <a href={hospitalInfo.ambulanceTel} className="inline-flex items-center min-h-11 text-red-800 font-bold text-sm hover:underline">
                  {hospitalInfo.ambulanceLabel}
                </a>
              </div>
            </div>
            <dl className="text-xs text-slate-600 space-y-1">
              <div>
                <dt className="inline font-semibold text-slate-800">Family physician: </dt>
                <dd className="inline">{formatSession(familyPhysician)}</dd>
              </div>
              {opdSpecialties.map((s) => (
                <div key={s.id}>
                  <dt className="inline font-semibold text-slate-800">{s.name}: </dt>
                  <dd className="inline">{formatSession(s)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {hospitalInfo.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 text-center sm:text-right">
            Casualty:{' '}
            <a href={hospitalInfo.phoneTel} className="inline-block py-2 text-red-600 font-semibold hover:underline">
              {hospitalInfo.phone}
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            {hospitalInfo.ambulanceLabel}
          </p>
        </div>
      </div>
      <StatutoryFooter />
    </footer>
  );
}

function App() {
  const [tokenOpen, setTokenOpen] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [eligibilityOpen, setEligibilityOpen] = useState(false);
  const [careBotOpen, setCareBotOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill | null>(null);

  const requestBooking = (specialtyId: string, doctorId?: string) =>
    setPrefill({ specialtyId, doctorId, nonce: Date.now() });

  const closeToken = useCallback(() => setTokenOpen(false), []);
  const closeBooking = useCallback(() => setBookingResult(null), []);
  const closeEligibility = useCallback(() => setEligibilityOpen(false), []);

  const dialogOpen = tokenOpen || bookingResult !== null || eligibilityOpen;
  useEffect(() => {
    // CareBot is a full-screen sheet only on phones; on desktop it's a side panel the page can scroll under.
    if (!dialogOpen && !(careBotOpen && window.matchMedia('(max-width: 767px)').matches)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [dialogOpen, careBotOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="page-canvas text-slate-700">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[300] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-teal-600 focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <div className="relative z-[1]">
          <Navbar />
          <main id="main-content">
            <HeroTriage
              onGenerateToken={() => setTokenOpen(true)}
              onBookingResult={setBookingResult}
              prefill={prefill}
            />
            <TrustMarquee />
            <ImpactStats />
            <CampsAndOffersSection />
            <BentoGrid />
            <FacilitiesSection />
            <PatientServicesSection onCheckEligibility={() => setEligibilityOpen(true)} />
            <FounderSection />
            <DoctorsDirectory
              onBookDoctor={(doctor: Doctor) => requestBooking(doctor.specialtyId, doctor.id)}
            />
            <LocationSection />
          </main>
          <Footer />
          <MobileStickyBar onOpenCareBot={() => setCareBotOpen(true)} />
          <FloatingDock onOpenCareBot={() => setCareBotOpen(true)} careBotOpen={careBotOpen} />
          <Suspense fallback={null}>
            {tokenOpen && <LiveTokenDrawer open onClose={closeToken} />}
            {bookingResult && <BookingModal result={bookingResult} onClose={closeBooking} />}
            {eligibilityOpen && <EligibilityChecker open onClose={closeEligibility} />}
            {careBotOpen && (
              <CareBot
                hideLauncher
                open
                onOpenChange={setCareBotOpen}
                onGenerateToken={() => setTokenOpen(true)}
                onBookAppointment={(specialtyId = 'general-medicine') => {
                  setCareBotOpen(false);
                  requestBooking(specialtyId);
                }}
                onCheckEligibility={() => setEligibilityOpen(true)}
              />
            )}
          </Suspense>
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
