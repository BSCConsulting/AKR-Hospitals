import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, Navigation, Phone, Stethoscope, PauseCircle, MapPin } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';
import { useOpdQueue } from '@/hooks/useOpdQueue';

interface LiveTokenDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function LiveTokenDrawer({ open, onClose }: LiveTokenDrawerProps) {
  const { isLive, currentTokenServed, isPaused, isLoading } = useOpdQueue();
  const [token, setToken] = useState('');
  const myToken = Number.parseInt(token, 10);
  const ahead = Number.isFinite(myToken) ? myToken - currentTokenServed : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="token-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[440px] max-h-screen bg-white border-l border-slate-200 overflow-y-auto overscroll-contain shadow-2xl"
          >
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <Ticket className="w-[18px] h-[18px] text-teal-700" />
                </div>
                <div>
                  <h3 id="token-drawer-title" className="text-slate-900 font-semibold text-sm">
                    OPD Queue
                  </h3>
                  <p className="text-xs text-slate-600">Check your turn</p>
                </div>
              </div>
              <button
                type="button"
                autoFocus
                onClick={onClose}
                className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-6 space-y-5">
              {isLoading ? (
                <p className="text-sm text-slate-600">Loading today's queue…</p>
              ) : !isLive ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                  The live queue isn't published right now. Please call reception for your turn.
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 uppercase tracking-wide">Now serving</div>
                      <div className="text-2xl font-bold text-slate-900 tabular-nums" aria-live="polite">
                        {currentTokenServed > 0 ? `#${currentTokenServed}` : 'Not started'}
                      </div>
                    </div>
                  </div>

                  {isPaused && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <PauseCircle className="w-3.5 h-3.5" />
                      The queue is paused for a short while. It will resume shortly.
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="my-token" className="text-sm font-semibold text-slate-800">
                      Your token number (from the reception slip)
                    </label>
                    <input
                      id="my-token"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 min-h-12 rounded-xl border border-slate-300 bg-white text-slate-900 text-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. 23"
                    />
                    {ahead !== null && (
                      <p className="text-sm text-slate-700" aria-live="polite">
                        {ahead > 0
                          ? `${ahead} ${ahead === 1 ? 'patient is' : 'patients are'} ahead of you.`
                          : "It's your turn or your token has been called — please check with reception."}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2.5">
                <a
                  href={hospitalInfo.mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                >
                  <Navigation className="w-5 h-5 text-teal-700 shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-slate-900">Directions to hospital</div>
                    <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {hospitalInfo.address}
                    </div>
                  </div>
                </a>
                <a
                  href={hospitalInfo.phoneTel}
                  className="flex items-center gap-3 w-full px-4 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                >
                  <Phone className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-slate-900">Call reception</div>
                    <div className="text-xs text-slate-600 mt-0.5">{hospitalInfo.phone}</div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
