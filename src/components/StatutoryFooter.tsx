import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Scale, Recycle, X, Shield } from 'lucide-react';
import { clinicalEstablishment } from '@/data/compliance';
import { hospitalInfo } from '@/data/mockData';

type LegalDoc = 'privacy' | 'telemedicine' | 'bmw' | null;

const docs: {
  id: Exclude<LegalDoc, null>;
  label: string;
  icon: typeof FileText;
  title: string;
}[] = [
  {
    id: 'privacy',
    label: 'Privacy Policy (DPDP 2023)',
    icon: Shield,
    title: 'Privacy Policy — Digital Personal Data Protection Act, 2023',
  },
  {
    id: 'telemedicine',
    label: 'Telemedicine & Digital Consultation ToS',
    icon: Scale,
    title: 'Telemedicine & Digital Consultation Terms of Service',
  },
  {
    id: 'bmw',
    label: 'BMW Returns & Clinical Establishments Notice',
    icon: Recycle,
    title: 'Bio-Medical Waste & Clinical Establishments Act Notice',
  },
];

function LegalBody({ id }: { id: Exclude<LegalDoc, null> }) {
  if (id === 'privacy') {
    return (
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          {hospitalInfo.name} (“Hospital”, “we”) processes personal data of patients and attendants
          in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and applicable
          clinical record-keeping rules.
        </p>
        <p>
          <strong className="text-slate-800">Data we collect:</strong> name, mobile number, age/sex
          (when provided), appointment preferences, visit reason / triage category, and clinical
          notes generated during care. Health data and contact numbers are treated as sensitive
          personal data for operational purposes.
        </p>
        <p>
          <strong className="text-slate-800">Purpose:</strong> OPD scheduling, queue management,
          clinical continuity, billing / insurance facilitation, emergency contact, and statutory
          reporting. We do not sell patient data.
        </p>
        <p>
          <strong className="text-slate-800">Consent & rights:</strong> By submitting a booking or
          WhatsApp inquiry you consent to processing for the stated purpose. You may request access,
          correction, or erasure of non-retention-mandated data by writing to{' '}
          <a className="text-teal-700 underline" href={`mailto:${hospitalInfo.email}`}>
            {hospitalInfo.email}
          </a>{' '}
          or calling {hospitalInfo.phone}. Clinical records may be retained as required by law.
        </p>
        <p>
          <strong className="text-slate-800">Security:</strong> Demo online booking passes are
          temporary references and are not stored as full electronic medical records. Live clinical
          systems are access-controlled at the hospital.
        </p>
      </div>
    );
  }

  if (id === 'telemedicine') {
    return (
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          Digital inquiries via WhatsApp, CareBot, or the website booking form are{' '}
          <strong className="text-slate-800">not a substitute</strong> for in-person clinical
          examination unless a registered medical practitioner expressly initiates a telemedicine
          consult under the Telemedicine Practice Guidelines (Board of Governors / NMC).
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Online slot confirmation generates a temporary reference only until verified at reception.</li>
          <li>Emergency symptoms require immediate presentation to Casualty or calling {hospitalInfo.phone} / 1066.</li>
          <li>Prescriptions, diagnostics orders, and certificates are issued only after appropriate clinical assessment.</li>
          <li>Patients must provide accurate identity and contact details; misuse of booking channels may be refused.</li>
        </ul>
        <p>
          By continuing you agree that digital channels are for scheduling, triage guidance, and
          camp RSVP — not for emergency care or definitive diagnosis without clinician review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
      <p>
        <strong className="text-slate-800">Clinical Establishments Registration:</strong>{' '}
        {hospitalInfo.name} is registered under the {clinicalEstablishment.act}. Registration No:{' '}
        <span className="font-semibold text-slate-800">{clinicalEstablishment.registrationNo}</span>.
      </p>
      <p>
        <strong className="text-slate-800">Bio-Medical Waste (BMW):</strong>{' '}
        {clinicalEstablishment.bmwReturnsNote} Authorization / tracking reference:{' '}
        <span className="font-semibold text-slate-800">{clinicalEstablishment.bmwAuthorization}</span>.
      </p>
      <p>
        BMW annual returns and category-wise waste manifests are maintained at the facility and
        available for inspection by competent authorities. Segregation at source (yellow / red /
        blue / white) is enforced across clinical areas.
      </p>
      <p className="text-xs text-slate-500">
        Public notices are for transparency. Certified copies may be requested at the hospital
        administration desk during working hours.
      </p>
    </div>
  );
}

/** Statutory compliance bar with DPDP / telemedicine / BMW legal modals. */
export default function StatutoryFooter() {
  const [open, setOpen] = useState<LegalDoc>(null);
  const active = docs.find((d) => d.id === open);

  return (
    <>
      <div className="border-t border-slate-200 bg-slate-100/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Statutory notices · DPDP 2023 · Clinical Establishments Act · BMW Rules 2016
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {docs.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setOpen(doc.id)}
                className="text-[11px] font-semibold text-teal-800 hover:text-teal-600 underline underline-offset-2"
              >
                {doc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-slate-900/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="presentation"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="statutory-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto shadow-xl"
            >
              <div className="sticky top-0 flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <active.icon className="w-4 h-4 text-teal-700" />
                  </div>
                  <h3 id="statutory-modal-title" className="text-sm font-bold text-slate-900 leading-snug">
                    {active.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-5 py-4">
                <LegalBody id={open} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
