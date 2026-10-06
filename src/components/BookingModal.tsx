import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Stethoscope,
  User,
  Phone,
  MapPin,
  Download,
  CalendarPlus,
  Share2,
  Info,
} from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';
import { toGoogleCalendarDateTime } from '@/lib/dates';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  bookingDetails: {
    department: string;
    date: string;
    dateLabel: string;
    time: string;
    doctorName: string;
    doctorCredentials: string;
    room: string;
    fee: number;
  } | null;
}

function generateToken(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `AKR-${num}`;
}

/** QR encodes only public slot metadata — never patient name or mobile. */
function generateQrDataUrl(data: string): string {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encoded}`;
}

export default function BookingModal({ open, onClose, bookingDetails }: BookingModalProps) {
  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [patientName, setPatientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [token, setToken] = useState('');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});
  const [shareHint, setShareHint] = useState<string | null>(null);

  const handleConfirm = () => {
    const newErrors: { name?: string; mobile?: string } = {};
    if (!patientName.trim()) newErrors.name = 'Please enter patient name';
    if (!/^[0-9]{10}$/.test(mobile.replace(/\s/g, ''))) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setToken(generateToken());
    setStep('confirmed');
  };

  const handleClose = () => {
    setStep('form');
    setPatientName('');
    setMobile('');
    setToken('');
    setErrors({});
    setShareHint(null);
    onClose();
  };

  // Public pass data only — no patient PII in third-party QR requests
  const qrData = bookingDetails
    ? JSON.stringify({
        hospital: hospitalInfo.name,
        token,
        dept: bookingDetails.department,
        date: bookingDetails.date,
        time: bookingDetails.time,
        doctor: bookingDetails.doctorName,
        room: bookingDetails.room,
        demo: true,
      })
    : '';

  const calendarUrl = bookingDetails
    ? `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        `AKR Hospital Appointment - ${bookingDetails.department}`
      )}&details=${encodeURIComponent(
        `Token: ${token}\nDoctor: ${bookingDetails.doctorName}\nRoom: ${bookingDetails.room}\nFee: Rs. ${bookingDetails.fee}\n\nNote: Demo booking pass — confirm at reception.`
      )}&location=${encodeURIComponent(hospitalInfo.name + ', ' + hospitalInfo.address)}&dates=${toGoogleCalendarDateTime(
        bookingDetails.date,
        bookingDetails.time
      )}`
    : '';

  const shareText = bookingDetails
    ? `Token: ${token}\n${bookingDetails.department}\n${bookingDetails.dateLabel} at ${bookingDetails.time}\n${bookingDetails.doctorName}\n(Demo pass — confirm at AKR Hospital reception)`
    : '';

  const handleShare = async () => {
    if (!bookingDetails) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AKR Hospital Appointment',
          text: shareText,
        });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShareHint('Copied to clipboard');
        setTimeout(() => setShareHint(null), 2500);
        return;
      }
      setShareHint('Sharing is not supported on this device');
      setTimeout(() => setShareHint(null), 2500);
    } catch {
      // User cancelled share sheet — ignore
    }
  };

  return (
    <AnimatePresence>
      {open && bookingDetails && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-[80] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-modal-title"
              className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white/95">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                    <Calendar className="w-4.5 h-4.5 text-teal-400" />
                  </div>
                  <div>
                    <h3 id="booking-modal-title" className="text-slate-900 font-semibold text-sm">
                      {step === 'form' ? 'Confirm Your Appointment' : 'Demo Appointment Pass'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {step === 'form' ? 'Enter patient details' : 'Confirm this slot at reception'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-slate-500 hover:text-white hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-200">
                  <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    This is a <strong>demo pass</strong> for preview. It is not saved to the hospital
                    system — please confirm your appointment at the reception desk or by phone.
                  </span>
                </div>

                {/* Booking summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Stethoscope className="w-4 h-4 text-teal-400" />
                      {bookingDetails.department}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-4 h-4 text-teal-400" />
                      {bookingDetails.dateLabel}, {bookingDetails.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{bookingDetails.doctorName}</span>
                    <span className="text-slate-500 text-xs">{bookingDetails.doctorCredentials}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      {bookingDetails.room}
                    </span>
                    <span className="text-teal-300 font-semibold">Rs. {bookingDetails.fee}</span>
                  </div>
                </div>

                {step === 'form' ? (
                  <>
                    <div className="space-y-1.5">
                      <label htmlFor="patient-name" className="text-xs font-medium text-slate-600">
                        Patient Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          id="patient-name"
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Enter full name"
                          aria-invalid={Boolean(errors.name)}
                          className="w-full bg-slate-100 text-slate-800 text-sm rounded-lg pl-10 pr-4 py-2.5 border border-slate-200 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-slate-400"
                        />
                      </div>
                      {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="patient-mobile" className="text-xs font-medium text-slate-600">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          id="patient-mobile"
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          aria-invalid={Boolean(errors.mobile)}
                          className="w-full bg-slate-100 text-slate-800 text-sm rounded-lg pl-10 pr-4 py-2.5 border border-slate-200 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-slate-400"
                        />
                      </div>
                      {errors.mobile && <p className="text-xs text-rose-400">{errors.mobile}</p>}
                    </div>

                    <button
                      onClick={handleConfirm}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-teal-500/30 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Generate Demo Pass
                    </button>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-teal-600/20 to-emerald-600/10 border border-teal-500/30 rounded-xl p-5 text-center space-y-3"
                    >
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-200 text-xs font-medium">
                        <Info className="w-3.5 h-3.5" />
                        Demo Pass Ready
                      </div>
                      <div className="text-3xl font-bold text-white tracking-tight">{token}</div>
                      <p className="text-xs text-slate-600">
                        Show this reference at reception to complete booking
                      </p>
                      <div className="flex justify-center pt-1">
                        <img
                          src={generateQrDataUrl(qrData)}
                          alt="Appointment QR Code"
                          className="w-32 h-32 rounded-lg bg-white p-1.5"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500">
                        QR contains slot details only (no patient phone or name)
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-teal-500/40 transition-all"
                      >
                        <CalendarPlus className="w-4 h-4 text-teal-400" />
                        Calendar
                      </a>
                      <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-teal-500/40 transition-all"
                      >
                        <Share2 className="w-4 h-4 text-teal-400" />
                        Share
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-teal-500/40 transition-all"
                      >
                        <Download className="w-4 h-4 text-teal-400" />
                        Save
                      </button>
                    </div>
                    {shareHint && <p className="text-center text-xs text-teal-300">{shareHint}</p>}

                    <button
                      onClick={handleClose}
                      className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-white hover:bg-slate-100 transition-colors"
                    >
                      Done
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
