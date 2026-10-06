import { useState, useEffect } from 'react';
import { Menu, X, Phone, Activity } from 'lucide-react';
import { navItems, hospitalInfo } from '@/data/mockData';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="hidden lg:block bg-white/70 border-b border-slate-200/80 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Phone className="w-3 h-3 text-teal-600" />
              {hospitalInfo.phone}
            </span>
            <span className="text-slate-300">|</span>
            <span className="truncate max-w-md">{hospitalInfo.address}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-red-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Emergency: {hospitalInfo.emergencyPhone}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-teal-700 font-medium">NABH Accredited</span>
            <WhatsAppButton variant="inline" />
          </div>
        </div>
      </div>

      <nav
        className={`sticky top-0 z-50 transition-shadow duration-300 glass-nav ${
          scrolled ? 'shadow-md shadow-slate-900/5' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="#home" className="flex items-center gap-2.5 group">
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

            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-all"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#appointments"
                className="ml-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-all shadow-md shadow-teal-600/20"
              >
                Book Appointment
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            id="mobile-nav-menu"
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200"
          >
            <div className="px-4 py-4 space-y-1">
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
      </nav>
    </>
  );
}
