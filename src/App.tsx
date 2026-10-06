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
import LiveTokenDrawer from '@/components/LiveTokenDrawer';
import BookingModal from '@/components/BookingModal';
import EligibilityChecker from '@/components/EligibilityChecker';
import DoctorsDirectory from '@/components/DoctorsDirectory';
import CareBot from '@/components/CareBot';
import FounderSection from '@/components/FounderSection';
import LocationSection from '@/components/LocationSection';
import { WHATSAPP_LINK } from '@/components/WhatsAppButton';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { Phone, Mail, MapPin, Activity, Shield, Award, Clock } from 'lucide-react';
import { hospitalInfo, type Doctor } from '@/data/mockData';
import { getTodayBookingDefaults } from '@/lib/dates';

interface BookingDetails {
  department: string;
  date: string;
  dateLabel: string;
  time: string;
  doctorName: string;
  doctorCredentials: string;
  room: string;
  fee: number;
  patientName?: string;
  mobile?: string;
}

function Footer() {
  return (
    <footer id="contact" className="relative bg-white/70 border-t border-slate-200 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-600/20">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-slate-900 font-bold text-base">
                  AKR <span className="text-teal-600">Hospital</span>
                </span>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Multi-Speciality</div>
              </div>
            </div>
            <p className="text-slate-600 text-sm max-w-md leading-relaxed">
              {hospitalInfo.tagline} Serving Madhira, Telangana since {hospitalInfo.established} with
              compassion, innovation, and unwavering commitment to patient outcomes.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Shield className="w-3.5 h-3.5" /> NABH Accredited
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
                <Award className="w-3.5 h-3.5" /> ISO 9001:2015
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-900 font-semibold text-sm mb-3">Contact</h4>
            <a
              href={`tel:${hospitalInfo.phone.replace(/\s/g, '')}`}
              className="flex items-start gap-2.5 text-sm text-slate-600 hover:text-teal-700 transition-colors"
            >
              <Phone className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
              {hospitalInfo.phone}
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-sm text-slate-600 hover:text-[#128C7E] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 mt-0.5 text-[#25D366] shrink-0" />
              <span>
                {hospitalInfo.appointmentLine}
                <span className="text-[10px] text-slate-500 ml-1">(WhatsApp)</span>
              </span>
            </a>
            <a
              href={`mailto:${hospitalInfo.email}`}
              className="flex items-start gap-2.5 text-sm text-slate-600 hover:text-teal-700 transition-colors"
            >
              <Mail className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
              {hospitalInfo.email}
            </a>
            <div className="flex items-start gap-2.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
              {hospitalInfo.address}
            </div>
            <a
              href={hospitalInfo.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-colors mt-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              View on Google Maps
            </a>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-900 font-semibold text-sm mb-3">Hours</h4>
            <a
              href="tel:1066"
              className="block rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 hover:bg-red-100/80 transition-colors"
            >
              <div className="flex items-start gap-2.5 text-sm">
                <Clock className="w-4 h-4 mt-0.5 text-red-600 shrink-0" />
                <div>
                  <div className="text-red-800 font-bold text-xs uppercase tracking-wide">
                    Emergency Hours
                  </div>
                  <div className="text-red-700 font-bold text-base mt-0.5">1066 · 24/7/365</div>
                  <div className="text-xs text-red-700/80 mt-0.5">{hospitalInfo.phone}</div>
                </div>
              </div>
            </a>
            <div className="flex items-start gap-2.5 text-sm text-slate-600">
              <Clock className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
              <div>
                <div className="text-slate-900 font-medium text-xs">OPD</div>
                <div className="text-xs text-slate-500">9 AM – 8 PM Daily</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-slate-600">
              <Clock className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
              <div>
                <div className="text-slate-900 font-medium text-xs">Diagnostics</div>
                <div className="text-xs text-slate-500">7 AM – 10 PM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {hospitalInfo.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Emergency Helpline:{' '}
            <span className="text-red-600 font-semibold">{hospitalInfo.emergencyPhone}</span>
          </p>
        </div>
      </div>
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
    });
    setBookingOpen(true);
  };

  return (
    <div className="page-canvas text-slate-700">
      <div className="relative z-[1]">
        <Navbar />
        <main>
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
              doctorName: 'Dr. R. Sharma',
              doctorCredentials: 'MD, General Medicine',
              room: 'Cabin 104',
              fee: 400,
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
