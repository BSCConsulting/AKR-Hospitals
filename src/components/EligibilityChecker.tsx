import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle2, ChevronDown, FileText, Stethoscope } from 'lucide-react';
import { hospitalInfo, insuranceProviders, type InsuranceProvider } from '@/data/mockData';

interface EligibilityCheckerProps {
  open: boolean;
  onClose: () => void;
}

const typeLabels: Record<InsuranceProvider['type'], string> = {
  government: 'Government Scheme',
  tpa: 'TPA Partner',
  corporate: 'Corporate Insurer',
};

const typeColors: Record<InsuranceProvider['type'], string> = {
  government: 'text-teal-800 bg-teal-50 border-teal-200',
  tpa: 'text-sky-800 bg-sky-50 border-sky-200',
  corporate: 'text-indigo-800 bg-indigo-50 border-indigo-200',
};

export default function EligibilityChecker({ open, onClose }: EligibilityCheckerProps) {
  const [selected, setSelected] = useState<InsuranceProvider | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="eligibility-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white/95 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <ShieldCheck className="w-[18px] h-[18px] text-teal-700" />
                </div>
                <div>
                  <h3 id="eligibility-title" className="text-slate-900 font-semibold text-sm">
                    Cashless Eligibility Checker
                  </h3>
                  <p className="text-xs text-slate-500">Select your insurance provider</p>
                </div>
              </div>
              <button
                type="button"
                autoFocus
                onClick={onClose}
                className="p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {insuranceProviders.map((provider) => {
                const isSelected = selected?.id === provider.id;
                return (
                  <div key={provider.id}>
                    <button
                      onClick={() => setSelected(isSelected ? null : provider)}
                      aria-expanded={isSelected}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-teal-50/60 border-teal-300'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${typeColors[provider.type]}`}>
                          {typeLabels[provider.type]}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{provider.name}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                                Commonly covered
                              </div>
                              <div className="space-y-1.5">
                                {provider.coveredProcedures.map((proc) => (
                                  <div key={proc} className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    {proc}
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-slate-500">
                                Final coverage depends on your policy terms.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                <FileText className="w-3.5 h-3.5 text-teal-700" />
                                Bring to TPA Desk
                              </div>
                              <div className="space-y-1.5">
                                {provider.deskRequirements.map((req) => (
                                  <div key={req} className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                                    {req}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <a
                              href={hospitalInfo.phoneTel}
                              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 min-h-11 rounded-lg text-sm font-semibold bg-teal-700 text-white hover:bg-teal-600 transition-colors"
                            >
                              Call TPA Desk · {hospitalInfo.phone}
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
