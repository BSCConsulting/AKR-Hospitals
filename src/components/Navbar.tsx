import { useState, useEffect } from 'react';
import { Menu, X, Phone, Activity } from 'lucide-react';
import { navItems, hospitalInfo } from '@/data/mockData';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden lg:block bg-slate-950 text-slate-400 text-xs border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-teal-400" />
              {hospitalInfo.phone}
            </span>
            <span className="text-slate-600">|</span>
            <span>{hospitalInfo.address}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-rose-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Emergency: {hospitalInfo.emergencyPhone}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-teal-400">NABH Accredited</span>
            <WhatsAppButton variant="inline" />
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-slate-800/50'
            : 'bg-slate-950/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-shadow">
                  <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-base tracking-tight">
                  AKR <span className="text-teal-400">Hospital</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
                  Multi-Speciality
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#appointments"
                className="ml-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-lg transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-500/30"
              >
                Book Appointment
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-950/98 backdrop-blur-xl border-t border-slate-800/50 animate-slide-up">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#appointments"
                onClick={() => setMobileOpen(false)}
                className="block mt-2 px-4 py-3 text-sm font-semibold text-center text-white bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg"
              >
                Book Appointment
              </a>
              <div className="flex items-center justify-center gap-2 pt-3 text-rose-400 text-sm font-medium">
                <Phone className="w-4 h-4" />
                Emergency: {hospitalInfo.emergencyPhone}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
