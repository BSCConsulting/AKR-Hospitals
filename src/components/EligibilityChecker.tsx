import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  FileText,
  Clock,
  Stethoscope,
} from 'lucide-react';
import { insuranceProviders, type InsuranceProvider } from '@/data/mockData';

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
  government: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
  tpa: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
  corporate: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
};

export default function EligibilityChecker({ open, onClose }: EligibilityCheckerProps) {
  const [selected, setSelected] = useState<InsuranceProvider | null>(null);

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-4.5 h-4.5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Cashless Eligibility Checker</h3>
                    <p className="text-[11px] text-slate-400">Select your insurance provider</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                {insuranceProviders.map((provider) => {
                  const isSelected = selected?.id === provider.id;
                  return (
                    <div key={provider.id}>
                      <button
                        onClick={() => setSelected(isSelected ? null : provider)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-teal-500/40'
                            : 'bg-slate-800/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${typeColors[provider.type]}`}>
                            {typeLabels[provider.type]}
                          </div>
                          <span className="text-sm font-semibold text-white">{provider.name}</span>
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
                            <div className="mt-2 bg-slate-800/30 border border-slate-800 rounded-xl p-4 space-y-4">
                              {/* Turnaround */}
                              <div className="flex items-center gap-2 text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-lg px-3 py-2">
                                <Clock className="w-3.5 h-3.5" />
                                Pre-auth turnaround: {provider.turnaround}
                              </div>

                              {/* Covered procedures */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 uppercase tracking-wide">
                                  <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                                  Covered Procedures
                                </div>
                                <div className="space-y-1.5">
                                  {provider.coveredProcedures.map((proc) => (
                                    <div key={proc} className="flex items-center gap-2 text-sm text-slate-300">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                      {proc}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Desk requirements */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 uppercase tracking-wide">
                                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                                  Bring to TPA Desk
                                </div>
                                <div className="space-y-1.5">
                                  {provider.deskRequirements.map((req) => (
                                    <div key={req} className="flex items-center gap-2 text-sm text-slate-300">
                                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                      {req}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <a
                                href={`tel:${'+919876543210'.replace(/\s/g, '')}`}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-teal-500/30 transition-all"
                              >
                                Verify Eligibility Now
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
        </>
      )}
    </AnimatePresence>
  );
}
