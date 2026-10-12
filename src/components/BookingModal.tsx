import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Phone, Clock, Stethoscope } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';
import { whatsappBookingConfirm } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export interface BookingDetails {
  patientName: string;
  mobile: string;
  department: string;
  doctorName?: string;
  date: string;
  dateLabel: string;
  time: string;
  reason: string;
}

export interface BookingResult {
  details: BookingDetails;
  reference: string;
  /** False when the request could not be stored online — patient must use WhatsApp/call. */
  sent: boolean;
}

interface BookingModalProps {
  result: BookingResult | null;
  onClose: () => void;
}

export default function BookingModal({ result, onClose }: BookingModalProps) {
  useEffect(() => {
    if (!result) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [result, onClose]);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
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
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <ModalBody result={result} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalBody({ result, onClose }: { result: BookingResult; onClose: () => void }) {
  const { details, reference, sent } = result;
  const waHref = whatsappBookingConfirm({ ...details, reference: sent ? reference : undefined });

  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
              sent ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
            }`}
          >
            {sent ? (
              <CheckCircle2 className="w-[18px] h-[18px] text-emerald-700" />
            ) : (
              <AlertTriangle className="w-[18px] h-[18px] text-amber-700" />
            )}
          </div>
          <h3 id="booking-modal-title" className="text-slate-900 font-semibold text-base">
            {sent ? 'Request received' : "Couldn't submit online"}
          </h3>
        </div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {sent ? (
          <>
            <p className="text-sm text-slate-700">
              We'll call you on <strong>{details.mobile}</strong> to confirm your appointment time.
              This is a request, not a confirmed slot yet.
            </p>
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-teal-800">
                Your reference
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-wider mt-1">{reference}</div>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-700">
            Your request couldn't be sent online. Please send it on WhatsApp (your details are filled
            in) or call reception.
          </p>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-700 shrink-0" />
            {details.department} · {details.doctorName ?? 'Any available doctor'}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-700 shrink-0" />
            Preferred: {details.dateLabel}, {details.time}
          </div>
          <div className="text-xs text-slate-600">
            {details.patientName} · {details.reason}
          </div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 min-h-12 rounded-xl text-sm font-semibold transition-colors ${
            sent
              ? 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50'
              : 'bg-[#0B6E62] text-white hover:bg-[#095c52]'
          }`}
        >
          <WhatsAppIcon className="w-4 h-4" />
          {sent ? 'Also send on WhatsApp' : 'Send on WhatsApp'}
        </a>
        {!sent && (
          <a
            href={hospitalInfo.phoneTel}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-12 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50"
          >
            <Phone className="w-4 h-4 text-teal-700" />
            Call reception · {hospitalInfo.phone}
          </a>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-2.5 min-h-11 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          {sent ? 'Done' : 'Back to form'}
        </button>
      </div>
    </>
  );
}
