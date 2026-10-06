import { useState, useEffect } from 'react';
import { Menu, X, Phone, Activity, Ambulance } from 'lucide-react';
import { navItems, hospitalInfo } from '@/data/mockData';
import { accreditation } from '@/data/compliance';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const emergencyPill = (
    <a
      href={hospitalInfo.phoneTel}
      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors shrink-0 max-w-[min(100%,16rem)] sm:max-w-none"
      aria-label={`Call 24/7 casualty ${hospitalInfo.phone}`}
    >
      <Ambulance className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">
        <span className="hidden sm:inline">24/7 Casualty: </span>
        <span className="sm:hidden">Casualty </span>
        {hospitalInfo.phone.replace('+91 ', '')}
        <span className="hidden lg:inline text-red-600/80 font-semibold">
          {' '}
          · 1066 {hospitalInfo.emergencyDispatchLabel}
        </span>
      </span>
    </a>
  );

  return (
    <>
      <div className="hidden lg:block bg-white/70 border-b border-slate-200/80 text-slate-500 text-xs">
        <div className="section-shell py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Phone className="w-3 h-3 text-teal-600" />
              {hospitalInfo.phone}
            </span>
            <span className="text-slate-300">|</span>
            <span className="truncate max-w-md">{hospitalInfo.address}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-teal-700 font-medium truncate max-w-xs xl:max-w-md" title={accreditation.nabh.full}>
              {accreditation.nabh.full}
            </span>
            <WhatsAppButton variant="inline" />
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-shadow duration-300 glass-nav ${
          scrolled ? 'shadow-md shadow-slate-900/5' : ''
        }`}
      >
        <div className="section-shell">
          <div className="flex items-center justify-between h-16 gap-2">
            <a href="#home" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-600/20">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-slate-900 font-bold text-base tracking-tight">
                  AKR <span className="text-teal-600">Hospital</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">
                  Multi-Speciality
                </span>
              </div>
            </a>

            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-end">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-2.5 xl:px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-all"
                >
                  {item.label}
                </a>
              ))}
              {emergencyPill}
              <a
                href="#appointments"
                className="ml-1 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-all shadow-md shadow-teal-600/20"
              >
                Book Appointment
              </a>
            </div>

            {/* Mobile: emergency pill left of hamburger */}
            <div className="flex lg:hidden items-center gap-2 ml-auto">
              {emergencyPill}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-slate-600 hover:text-slate-900"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div
            id="mobile-nav-menu"
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200"
          >
            <div className="px-4 py-4 space-y-1">
              <a
                href={hospitalInfo.phoneTel}
                onClick={() => setMobileOpen(false)}
                className="flex flex-col gap-0.5 px-4 py-3 text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg mb-2"
              >
                <span className="inline-flex items-center gap-2">
                  <Ambulance className="w-4 h-4" />
                  24/7 Casualty: {hospitalInfo.phone}
                </span>
                <span className="text-[11px] font-semibold text-red-600/90 pl-6">
                  1066 {hospitalInfo.emergencyDispatchLabel}
                </span>
              </a>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#appointments"
                onClick={() => setMobileOpen(false)}
                className="block mt-2 px-4 py-3 text-sm font-semibold text-center text-white bg-teal-600 rounded-lg"
              >
                Book Appointment
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
