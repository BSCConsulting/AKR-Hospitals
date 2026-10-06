import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Ticket,
  Navigation,
  Phone,
  Clock,
  CheckCircle2,
  Activity,
  MapPin,
  Stethoscope,
  PauseCircle,
  Volume2,
  Bell,
  MessageCircle,
} from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';
import { useOpdQueue } from '@/hooks/useOpdQueue';

interface LiveTokenDrawerProps {
  open: boolean;
  onClose: () => void;
}

const assignedTokenNumber = 19;
const assignedToken = 'A-019';
const MINUTES_PER_TOKEN = 8;

export default function LiveTokenDrawer({ open, onClose }: LiveTokenDrawerProps) {
  const { currentTokenServed, isPaused, isLoading } = useOpdQueue();

  const tokensAhead = Math.max(assignedTokenNumber - currentTokenServed, 0);
  const totalWaitSeconds = tokensAhead * MINUTES_PER_TOKEN * 60;
  const [waitSeconds, setWaitSeconds] = useState(totalWaitSeconds);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [whatsappNotify, setWhatsappNotify] = useState(false);
  const announcementTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setWaitSeconds(totalWaitSeconds);
    const interval = setInterval(() => {
      setWaitSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [open, totalWaitSeconds]);

  const triggerAnnouncement = () => {
    const msg = `Now calling Token ${assignedToken} to Room 3`;
    setAnnouncement(msg);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Now calling token A-019 to Room 3. Please proceed to the consultation room.`
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
    if (announcementTimer.current) clearTimeout(announcementTimer.current);
    announcementTimer.current = setTimeout(() => setAnnouncement(null), 5000);
  };

  useEffect(() => {
    return () => {
      if (announcementTimer.current) clearTimeout(announcementTimer.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatWait = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const waitProgress = totalWaitSeconds > 0 ? ((totalWaitSeconds - waitSeconds) / totalWaitSeconds) * 100 : 0;
  const servingDisplay = `#${currentTokenServed}`;
  const mapsUrl = hospitalInfo.mapsDirectionsUrl;
  const receptionPhone = hospitalInfo.phone.replace(/\s/g, '');

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Announcement banner */}
          <AnimatePresence>
            {announcement && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-[75] bg-teal-600 text-white px-5 py-3 rounded-xl shadow-2xl shadow-teal-600/40 flex items-center gap-2.5"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-semibold">{announcement}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[440px] bg-slate-900 border-l border-slate-800 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                  <Ticket className="w-4.5 h-4.5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Your Live Token</h3>
                  <p className="text-[11px] text-slate-300">OPD Queue Status</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-6 space-y-5">
              {/* Token number card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="relative bg-gradient-to-br from-teal-600/20 to-emerald-600/10 border border-teal-500/30 rounded-2xl p-6 text-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50" />
                <div className="text-xs text-teal-300 font-medium uppercase tracking-wider mb-2">
                  Your Token Number
                </div>
                <div className="text-5xl font-bold text-white tracking-tight mb-3">
                  {assignedToken}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Token Confirmed
                </div>
              </motion.div>

              {/* Currently serving */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="bg-slate-800/50 border border-slate-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-300 uppercase tracking-wide">
                        Now Serving
                      </div>
                      <div className="text-lg font-bold text-white">
                        {isLoading ? '—' : servingDisplay}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-300 uppercase tracking-wide">
                      You are
                    </div>
                    <div className="text-lg font-bold text-amber-400">
                      {isLoading ? '—' : `${tokensAhead} ahead`}
                    </div>
                  </div>
                </div>
                {isPaused && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                    <PauseCircle className="w-3.5 h-3.5" />
                    Queue is temporarily paused. Please wait for it to resume.
                  </div>
                )}
              </motion.div>

              {/* Wait-time countdown */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="bg-slate-800/50 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <Clock className="w-4 h-4 text-teal-400" />
                    Estimated Wait
                  </div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">
                    {formatWait(waitSeconds)}
                  </div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${waitProgress}%` }}
                    transition={{ duration: 0.5, ease: 'linear' }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Activity className="w-3 h-3 text-teal-400 animate-pulse" />
                  {isPaused
                    ? 'Queue is paused. Wait time is estimated and may change.'
                    : 'Queue is moving in real-time. Please be in the waiting area 10 min before your turn.'}
                </div>
              </motion.div>

              {/* Audio announcement + WhatsApp toggle */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="space-y-2.5"
              >
                <div className="text-xs text-slate-300 font-medium uppercase tracking-wide">
                  Notifications
                </div>

                {/* Audio announcement sim */}
                <button
                  onClick={triggerAnnouncement}
                  className="group flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-teal-500/40 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0 group-hover:bg-teal-500/25 transition-colors">
                    <Volume2 className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-white">Simulate Audio Announcement</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Hear "Now calling Token A-019 to Room 3"
                    </div>
                  </div>
                </button>

                {/* WhatsApp notify toggle */}
                <button
                  onClick={() => setWhatsappNotify(!whatsappNotify)}
                  className={`group flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border transition-all ${
                    whatsappNotify
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    whatsappNotify ? 'bg-emerald-500/25' : 'bg-slate-700'
                  }`}>
                    <MessageCircle className={`w-5 h-5 ${whatsappNotify ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-white">
                      WhatsApp Alert {whatsappNotify && '— On'}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Notify me when 2 patients remain
                    </div>
                  </div>
                  <div className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    whatsappNotify ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}>
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                      animate={{ left: whatsappNotify ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </button>
                {whatsappNotify && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    You'll receive a WhatsApp message when your token is 2 patients away.
                  </motion.div>
                )}
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="space-y-2.5"
              >
                <div className="text-xs text-slate-300 font-medium uppercase tracking-wide mb-1">
                  Quick Actions
                </div>

                {/* Google Maps navigation */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-teal-500/40 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0 group-hover:bg-teal-500/25 transition-colors">
                    <Navigation className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-white">Navigate to Hospital</div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {hospitalInfo.address}
                    </div>
                  </div>
                  <Navigation className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                </a>

                {/* Reception dialer */}
                <a
                  href={`tel:${receptionPhone}`}
                  className="group flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/40 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-white">Call Reception</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">{hospitalInfo.phone}</div>
                  </div>
                  <Phone className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </a>
              </motion.div>

              {/* Info note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="text-[11px] text-slate-400 text-center pt-2"
              >
                Show this token at the reception desk. Your slot will be held for 15 minutes
                after your token is called.
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
