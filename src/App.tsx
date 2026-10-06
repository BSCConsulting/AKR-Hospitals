import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroTriage from '@/components/HeroTriage';
import BentoGrid from '@/components/BentoGrid';
import EmergencyBar from '@/components/EmergencyBar';
import LiveTokenDrawer from '@/components/LiveTokenDrawer';
import BookingModal from '@/components/BookingModal';
import EligibilityChecker from '@/components/EligibilityChecker';
import DoctorsDirectory from '@/components/DoctorsDirectory';
import CareBot from '@/components/CareBot';
import LocationSection from '@/components/LocationSection';
import WhatsAppButton, { WHATSAPP_LINK } from '@/components/WhatsAppButton';
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
}

function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-800 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-white font-bold text-base">
                  AKR <span className="text-teal-400">Hospital</span>
                </span>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">Multi-Speciality</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm max-w-md leading-relaxed">
              {hospitalInfo.tagline} Serving Madhira, Telangana since {hospitalInfo.established} with
              compassion, innovation, and unwavering commitment to patient outcomes.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <Shield className="w-3.5 h-3.5" /> NABH Accredited
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-teal-300 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
                <Award className="w-3.5 h-3.5" /> ISO 9001:2015
              </span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
            <a href="tel:+918749273030" className="flex items-start gap-2.5 text-sm text-slate-300 hover:text-teal-300 transition-colors">
              <Phone className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              {hospitalInfo.phone}
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-sm text-slate-300 hover:text-[#25D366] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 mt-0.5 text-[#25D366] shrink-0" />
              <span>
                +91 9849057185
                <span className="text-[10px] text-slate-500 ml-1">(WhatsApp)</span>
              </span>
            </a>
            <a href={`mailto:${hospitalInfo.email}`} className="flex items-start gap-2.5 text-sm text-slate-300 hover:text-teal-300 transition-colors">
              <Mail className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              {hospitalInfo.email}
            </a>
            <div className="flex items-start gap-2.5 text-sm text-slate-300">
              <MapPin className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              {hospitalInfo.address}
            </div>
            <a
              href={hospitalInfo.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-300 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full hover:bg-teal-500/20 transition-colors mt-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              View on Google Maps
            </a>
          </div>

          {/* Hours */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm mb-3">Hours</h4>
            <div className="flex items-start gap-2.5 text-sm text-slate-300">
              <Clock className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
              <div>
                <div className="text-white font-medium text-xs">Emergency</div>
                <div className="text-xs text-slate-300">24 / 7 / 365</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-slate-300">
              <Clock className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <div>
                <div className="text-white font-medium text-xs">OPD</div>
                <div className="text-xs text-slate-300">9 AM – 8 PM Daily</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-slate-300">
              <Clock className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <div>
                <div className="text-white font-medium text-xs">Diagnostics</div>
                <div className="text-xs text-slate-300">7 AM – 10 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {hospitalInfo.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Emergency Helpline: <span className="text-rose-400 font-semibold">{hospitalInfo.emergencyPhone}</span>
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

  const handleConfirmBooking = (details: BookingDetails) => {
    setBookingDetails(details);
    setBookingOpen(true);
  };

  const handleBookDoctor = (doctor: Doctor) => {
    const today = getTodayBookingDefaults();
    setBookingDetails({
      department: doctor.specialtyName,
      date: today.date,
      dateLabel: today.dateLabel,
      time: today.time,
      doctorName: doctor.name,
      doctorCredentials: doctor.credentials,
      room: doctor.room,
      fee: doctor.fee,
    });
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <Navbar />
      <main>
        <HeroTriage
          onGenerateToken={() => setTokenOpen(true)}
          onConfirmBooking={handleConfirmBooking}
        />
        <BentoGrid onCheckEligibility={() => setEligibilityOpen(true)} />
        <DoctorsDirectory onBookDoctor={handleBookDoctor} />
      </main>
      <LocationSection />
      <Footer />
      <EmergencyBar />
      <WhatsAppButton />
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
  );
}

export default App;
