import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { getDateTabs } from '@/data/mockData';
import HeroTriage from '@/components/HeroTriage';
import TrustMarquee from '@/components/TrustMarquee';
import ImpactStats from '@/components/ImpactStats';
import FacilityPulse from '@/components/FacilityPulse';
import CampsAndOffersSection from '@/components/CampsAndOffersSection';
import BentoGrid from '@/components/BentoGrid';
import PatientServicesSection from '@/components/PatientServicesSection';
import FloatingDock from '@/components/FloatingDock';
import MobileStickyBar from '@/components/MobileStickyBar';
import LiveTokenDrawer from '@/components/LiveTokenDrawer';
import BookingModal, { type BookingDetails } from '@/components/BookingModal';
import EligibilityChecker from '@/components/EligibilityChecker';
import DoctorsDirectory from '@/components/DoctorsDirectory';
import CareBot from '@/components/CareBot';
import FounderSection from '@/components/FounderSection';
import LocationSection from '@/components/LocationSection';
import StatutoryFooter from '@/components/StatutoryFooter';
import { WHATSAPP_OPD_INQUIRE } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { Phone, Mail, MapPin, Activity, Shield, Award, Clock } from 'lucide-react';
import { hospitalInfo, type Doctor } from '@/data/mockData';
import { accreditation } from '@/data/compliance';
import { getTodayBookingDefaults } from '@/lib/dates';

function Footer() {
  return (
    <footer id="contact" className="relative bg-white/70 border-t border-slate-200 pb-28 md:pb-10">
      <div className="section-shell py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 — Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-600/20">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-slate-900 font-bold text-base">
                  AKR <span className="text-teal-700">Hospital</span>
                </span>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Multi-Speciality</div>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {hospitalInfo.tagline} Serving Madhira, Telangana since {hospitalInfo.established} with
              compassion and clinical excellence.
            </p>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-start gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{accreditation.nabh.full}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-teal-800 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 w-fit">
                <Award className="w-3.5 h-3.5" /> {accreditation.iso.short}
              </span>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="space-y-3">
            <h2 className="text-slate-900 font-semibold text-sm">Quick Links</h2>
            <nav className="flex flex-col gap-2 text-sm">
              {[
                { href: '#departments', label: 'Specialties / Clinical Wings' },
                { href: '#camps', label: 'Health Camps & Offers' },
                { href: '#cashless', label: 'TPA / Cashless Desk' },
                { href: '#specialists', label: 'Doctor Schedules' },
                { href: '#appointments', label: 'Book OPD Slot' },
                { href: '#founder', label: 'Meet Our Founder' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-teal-700 transition-colors"
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
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Google Maps Directions
            </a>
            <a
              href={hospitalInfo.phoneTel}
              className="flex items-start gap-2.5 text-sm text-slate-600 hover:text-teal-700 transition-colors"
            >
              <Phone className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
              Desk · {hospitalInfo.phone}
            </a>
            <a
              href={WHATSAPP_OPD_INQUIRE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-sm text-slate-600 hover:text-[#0B6E62] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 mt-0.5 text-[#25D366] shrink-0" />
              {hospitalInfo.appointmentLine} (WhatsApp)
            </a>
            <a
              href={`mailto:${hospitalInfo.email}`}
              className="flex items-start gap-2.5 text-sm text-slate-600 hover:text-teal-700 transition-colors"
            >
              <Mail className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
              {hospitalInfo.email}
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
                  <div className="text-xs text-red-800 mt-0.5">24/7 trauma & emergency desk</div>
                </div>
              </a>
              <div className="pl-6 border-t border-red-200/80 pt-2">
                <a href="tel:1066" className="text-red-800 font-bold text-base hover:underline">
                  1066
                </a>
                <div className="text-[11px] text-red-700/90">
                  {hospitalInfo.emergencyDispatchLabel}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>
                <span className="font-semibold text-slate-800">OPD:</span> 9 AM – 8 PM Daily
              </div>
              <div>
                <span className="font-semibold text-slate-800">Diagnostics:</span> 7 AM – 10 PM
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {hospitalInfo.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 text-center sm:text-right">
            Casualty:{' '}
            <a href={hospitalInfo.phoneTel} className="text-red-600 font-semibold hover:underline">
              {hospitalInfo.phone}
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            1066 {hospitalInfo.emergencyDispatchLabel}
          </p>
        </div>
      </div>
      <StatutoryFooter />
    </footer>
  );
}

function App() {
  const [tokenOpen, setTokenOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [eligibilityOpen, setEligibilityOpen] = useState(false);
  const [careBotOpen, setCareBotOpen] = useState(false);

  const handleConfirmBooking = (details: BookingDetails) => {
    setBookingDetails(details);
    setBookingOpen(true);
  };

  const handleBookDoctor = (doctor: Doctor, preferNextDay = false) => {
    const tabs = getDateTabs();
    const tab = preferNextDay
      ? tabs.find((t) => t.id === 'tomorrow') ?? tabs[1] ?? tabs[0]
      : tabs[0];
    const defaults = getTodayBookingDefaults();
    setBookingDetails({
      department: doctor.specialtyName,
      date: tab.date,
      dateLabel: `${tab.label}, ${tab.subLabel}`,
      time: defaults.time,
      doctorName: doctor.name,
      doctorCredentials: doctor.credentials,
      room: doctor.room,
      fee: doctor.fee,
      campWaiverApplied: Boolean(doctor.campWaiverEligible) || doctor.fee === 0,
      registrationNumber: doctor.registrationNumber,
      reasonForVisit: 'Routine OPD',
    });
    setBookingOpen(true);
  };

  return (
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
            onConfirmBooking={handleConfirmBooking}
          />
          <TrustMarquee />
          <ImpactStats />
          <FacilityPulse />
          <CampsAndOffersSection />
          <BentoGrid />
          <PatientServicesSection onCheckEligibility={() => setEligibilityOpen(true)} />
          <FounderSection />
          <DoctorsDirectory onBookDoctor={handleBookDoctor} />
          <LocationSection />
        </main>
        <Footer />
        <MobileStickyBar />
        <FloatingDock onOpenCareBot={() => setCareBotOpen(true)} careBotOpen={careBotOpen} />
        <LiveTokenDrawer open={tokenOpen} onClose={() => setTokenOpen(false)} />
        <BookingModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          bookingDetails={bookingDetails}
        />
        <EligibilityChecker
          open={eligibilityOpen}
          onClose={() => setEligibilityOpen(false)}
        />
        <CareBot
          hideLauncher
          open={careBotOpen}
          onOpenChange={setCareBotOpen}
          onGenerateToken={() => setTokenOpen(true)}
          onBookAppointment={() => {
            const today = getTodayBookingDefaults();
            setBookingDetails({
              department: 'General Medicine',
              date: today.date,
              dateLabel: today.dateLabel,
              time: today.time,
              doctorName: 'Dr. A. Kondal Rao',
              doctorCredentials: 'MBBS | Ex-DM&HO (Khammam)',
              room: 'Cabin 101',
              fee: 0,
              campWaiverApplied: true,
              registrationNumber: hospitalInfo.mdRegistration,
              reasonForVisit: 'Routine OPD',
            });
            setBookingOpen(true);
          }}
          onCheckEligibility={() => setEligibilityOpen(true)}
        />
      </div>
    </div>
  );
}

export default App;
