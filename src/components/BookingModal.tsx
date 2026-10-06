import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  Download,
  CalendarPlus,
  Share2,
  Info,
  CircleDollarSign,
} from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';
import { toGoogleCalendarDateTime } from '@/lib/dates';
import { generateOpdReference } from '@/lib/validation';
import { whatsappBookingConfirm } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export interface BookingDetails {
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
  reasonForVisit?: string;
  campWaiverApplied?: boolean;
  registrationNumber?: string;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  bookingDetails: BookingDetails | null;
}

/** QR encodes only public slot metadata — never patient name or mobile. */
function generateQrDataUrl(data: string): string {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encoded}`;
}

export default function BookingModal({ open, onClose, bookingDetails }: BookingModalProps) {
  const [reference, setReference] = useState('');
  const [shareHint, setShareHint] = useState<string | null>(null);

  useEffect(() => {
    if (open && bookingDetails) {
      setReference(generateOpdReference());
      setShareHint(null);
    }
  }, [open, bookingDetails]);

  const handleClose = () => {
    setReference('');
    setShareHint(null);
    onClose();
  };

  const qrData = bookingDetails
    ? JSON.stringify({
        hospital: hospitalInfo.name,
        ref: reference,
        dept: bookingDetails.department,
        date: bookingDetails.date,
        time: bookingDetails.time,
        doctor: bookingDetails.doctorName,
        room: bookingDetails.room,
        demo: true,
      })
    : '';

  const feeLabel = bookingDetails?.campWaiverApplied
    ? '₹0 OP Registration (Community Waiver)'
    : `Standard consultation: ₹${bookingDetails?.fee ?? 0}`;

  const calendarUrl = bookingDetails
    ? `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        `AKR Hospital Appointment - ${bookingDetails.department}`
      )}&details=${encodeURIComponent(
        `Reference: ${reference}\nDoctor: ${bookingDetails.doctorName}\nRoom: ${bookingDetails.room}\n${feeLabel}\n\nNote: Temporary online reference — confirm at reception.`
      )}&location=${encodeURIComponent(hospitalInfo.name + ', ' + hospitalInfo.address)}&dates=${toGoogleCalendarDateTime(
        bookingDetails.date,
        bookingDetails.time
      )}`
    : '';

  const shareText = bookingDetails
    ? `Slot Confirmed: ${reference}\n${bookingDetails.department}\n${bookingDetails.dateLabel} at ${bookingDetails.time}\n${bookingDetails.doctorName}\n${feeLabel}\n(Confirm at AKR Hospital reception)`
    : '';

  const waHref =
    bookingDetails && reference
      ? whatsappBookingConfirm({
          reference,
          patientName: bookingDetails.patientName ?? 'Patient',
          department: bookingDetails.department,
          doctorName: bookingDetails.doctorName,
          dateLabel: bookingDetails.dateLabel,
          time: bookingDetails.time,
          reason: bookingDetails.reasonForVisit,
        })
      : '#';

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
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white/95">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <div>
                  <h3 id="booking-modal-title" className="text-slate-900 font-semibold text-sm">
                    Slot Confirmed
                  </h3>
                  <p className="text-[11px] text-slate-500">Temporary reference — verify at reception</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  This is a <strong>temporary online reference</strong>. It is not yet saved to the
                  hospital EMR — please confirm at the reception desk or via WhatsApp.
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-5 text-center space-y-2"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">
                  Slot Confirmed
                </div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{reference}</div>
                <p className="text-xs text-slate-600">
                  Show this code at OPD reception
                  {bookingDetails.patientName ? ` · ${bookingDetails.patientName}` : ''}
                </p>
                <div className="flex justify-center pt-1">
                        <img
                          src={generateQrDataUrl(qrData)}
                          alt="Appointment QR Code"
                          width={128}
                          height={128}
                          className="w-32 h-32 rounded-lg bg-white p-1.5 border border-slate-200"
                          loading="lazy"
                          decoding="async"
                        />
                </div>
              </motion.div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm gap-2">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    {bookingDetails.department}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-4 h-4 text-teal-600" />
                    {bookingDetails.dateLabel}, {bookingDetails.time}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm gap-2">
                  <span className="text-slate-800 font-medium">{bookingDetails.doctorName}</span>
                  <span className="text-slate-500 text-xs text-right">{bookingDetails.doctorCredentials}</span>
                </div>
                {bookingDetails.registrationNumber && (
                  <div className="text-[11px] text-slate-500">{bookingDetails.registrationNumber}</div>
                )}
                {bookingDetails.reasonForVisit && (
                  <div className="text-xs text-slate-600">
                    Reason / Triage:{' '}
                    <span className="font-semibold text-slate-800">{bookingDetails.reasonForVisit}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    {bookingDetails.room}
                  </span>
                  <span className="flex items-center gap-1 text-teal-800 font-semibold text-xs sm:text-sm">
                    <CircleDollarSign className="w-4 h-4" />
                    {feeLabel}
                  </span>
                </div>
                {!bookingDetails.campWaiverApplied && (
                  <p className="text-[11px] text-slate-500">
                    Standard consultant fees apply (typically ₹400–₹800). Community waiver / camp
                    ₹0 OP registration is only for select doctors.
                  </p>
                )}
              </div>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors shadow-md shadow-[#25D366]/20"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Receive details via WhatsApp
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-teal-300 transition-all"
                >
                  <CalendarPlus className="w-4 h-4 text-teal-600" />
                  Calendar
                </a>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-teal-300 transition-all"
                >
                  <Share2 className="w-4 h-4 text-teal-600" />
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-teal-300 transition-all"
                >
                  <Download className="w-4 h-4 text-teal-600" />
                  Save
                </button>
              </div>
              {shareHint && <p className="text-center text-xs text-teal-700">{shareHint}</p>}

              <button
                type="button"
                onClick={handleClose}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
