import { useState, useEffect } from 'react';
import { Menu, X, Phone, Activity, Ambulance } from 'lucide-react';
import { navItems, hospitalInfo } from '@/data/mockData';
import { accreditation } from '@/data/compliance';
import WhatsAppButton from '@/components/WhatsAppButton';

/** Primary desktop links — keep count lean so CTAs never clip. */
const primaryNav = navItems.filter((item) =>
  ['Home', 'Book', 'Camps', 'Departments', 'Specialists', 'Contact'].includes(item.label)
);

const secondaryNav = navItems.filter((item) =>
  ['Insurance', 'Founder'].includes(item.label)
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const close = () => setMoreOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [moreOpen]);

  return (
    <>
      {/* Utility bar — same shell as main nav for edge alignment */}
      <div className="hidden lg:block bg-slate-50/90 border-b border-slate-200/80 text-xs text-slate-600">
        <div className="section-shell h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href={hospitalInfo.phoneTel}
              className="inline-flex items-center gap-1.5 shrink-0 hover:text-teal-800 transition-colors"
            >
              <Phone className="w-3 h-3 text-teal-700" aria-hidden />
              {hospitalInfo.phone}
            </a>
            <span className="w-px h-3 bg-slate-300 shrink-0" aria-hidden />
            <span className="truncate text-slate-500" title={hospitalInfo.address}>
              {hospitalInfo.address}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="text-teal-800 font-medium truncate max-w-[14rem] xl:max-w-[22rem] 2xl:max-w-none"
              title={accreditation.nabh.full}
            >
              <span className="xl:hidden">NABH · {accreditation.nabh.certNo}</span>
              <span className="hidden xl:inline">{accreditation.nabh.full}</span>
            </span>
            <WhatsAppButton variant="inline" />
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-shadow duration-300 glass-nav overflow-x-clip ${
          scrolled ? 'shadow-md shadow-slate-900/5' : ''
        }`}
      >
        <div className="section-shell">
          <div className="flex items-center h-16 gap-3 min-w-0">
            <a href="#home" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-600/20">
                <Activity className="w-4.5 h-4.5 xl:w-5 xl:h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-slate-900 font-bold text-[15px] xl:text-base tracking-tight">
                  AKR <span className="text-teal-700">Hospital</span>
                </span>
                <span className="text-[9px] xl:text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">
                  Multi-Speciality
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-1 flex-1 min-w-0 justify-end"
              aria-label="Primary"
            >
              <div className="flex items-center min-w-0">
                {primaryNav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-2 xl:px-2.5 2xl:px-3 py-2 text-[13px] xl:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-all whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                ))}

                {/* Insurance + Founder under More until xl+ room */}
                <div className="relative xl:hidden">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoreOpen((v) => !v);
                    }}
                    className="px-2 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg whitespace-nowrap"
                    aria-expanded={moreOpen}
                    aria-haspopup="true"
                  >
                    More
                  </button>
                  {moreOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-50">
                      {secondaryNav.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden xl:flex items-center">
                  {secondaryNav.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="px-2.5 2xl:px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-all whitespace-nowrap"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <a
                href={hospitalInfo.phoneTel}
                title={`24/7 Casualty ${hospitalInfo.phone} · 1066 ${hospitalInfo.emergencyDispatchLabel}`}
                aria-label={`24/7 Casualty: ${hospitalInfo.phone.replace('+91 ', '')}`}
                className="ml-1 inline-flex items-center gap-1.5 px-2.5 xl:px-3 h-9 rounded-full text-[11px] xl:text-xs font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors shrink-0 whitespace-nowrap"
              >
                <Ambulance className="w-3.5 h-3.5 shrink-0" aria-hidden />
                <span className="2xl:hidden">Casualty · {hospitalInfo.phone.replace('+91 ', '')}</span>
                <span className="hidden 2xl:inline">
                  24/7 Casualty · {hospitalInfo.phone.replace('+91 ', '')} · 1066
                </span>
              </a>

              <a
                href="#appointments"
                className="ml-1.5 inline-flex items-center justify-center h-9 px-3.5 xl:px-4 rounded-lg text-[13px] xl:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-600 transition-all shadow-md shadow-teal-700/20 shrink-0 whitespace-nowrap"
              >
                <span className="xl:hidden">Book</span>
                <span className="hidden xl:inline">Book Appointment</span>
              </a>
            </nav>

            {/* Mobile / tablet — dial 1066 (primary emergency); full desk number in menu */}
            <div className="flex lg:hidden items-center gap-2 ml-auto shrink-0">
              <a
                href="tel:1066"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 min-h-11 h-11 rounded-full text-[11px] sm:text-xs font-bold bg-red-50 text-red-700 border border-red-200 active:bg-red-100"
                aria-label="Call casualty 1066"
                title={`24/7 Casualty · 1066 · Desk ${hospitalInfo.phone}`}
              >
                <Ambulance className="w-3.5 h-3.5 shrink-0" aria-hidden />
                <span>Casualty: 1066</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
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
            <div className="section-shell py-4 space-y-1">
              <a
                href={hospitalInfo.phoneTel}
                onClick={() => setMobileOpen(false)}
                className="flex flex-col gap-0.5 px-4 py-3 text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg mb-2"
              >
                <span className="inline-flex items-center gap-2">
                  <Ambulance className="w-4 h-4" aria-hidden />
                  24/7 Casualty: {hospitalInfo.phone}
                </span>
                <span className="text-[11px] font-semibold text-red-800 pl-6">
                  1066 {hospitalInfo.emergencyDispatchLabel}
                </span>
              </a>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center min-h-12 px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#appointments"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center mt-2 min-h-12 px-4 py-3 text-base font-semibold text-center text-white bg-teal-700 rounded-xl"
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
