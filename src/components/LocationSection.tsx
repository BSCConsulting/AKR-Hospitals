import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Activity, Building2 } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';

export default function LocationSection() {
  const { coordinates, mapsDirectionsUrl, phone, address } = hospitalInfo;
  const embedSrc = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=en&z=15&output=embed`;
  const casualtyPhone = phone.replace(/\s/g, '');

  return (
    <section id="location" className="bg-slate-950 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Find & Reach Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Located in the heart of Madhira
          </h2>
          <p className="text-slate-300 mt-3 text-lg">
            Samatha Nagar, Didugupadu — easily accessible from Khammam and surrounding
            villages. Our 24/7 casualty entrance is on the ground floor.
          </p>
        </motion.div>

        {/* Grid: Map + Action card */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Embedded Google Maps iframe */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/30 h-[360px] lg:h-full min-h-[360px]">
              <iframe
                src={embedSrc}
                title="Hospital Location Map"
                className="w-full h-full"
                style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) contrast(0.85) saturate(0.5)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 shadow-lg pointer-events-none">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-semibold text-white">{hospitalInfo.name}</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">{address}</div>
              </div>
            </div>
          </motion.div>

          {/* Quick-action card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5 h-full">
              {/* Landmark details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Landmark</div>
                    <div className="text-xs text-slate-300 mt-0.5">Samatha Nagar, Didugupadu</div>
                    <div className="text-xs text-slate-300">Madhira, Khammam, Telangana 507203</div>
                  </div>
                </div>

                {/* 24/7 casualty indicator */}
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <div className="relative">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-300">24/7 Casualty Entrance</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Ground Floor — always open</div>
                  </div>
                </div>

                {/* Hours summary */}
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>OPD: 9 AM – 8 PM Daily · Diagnostics: 7 AM – 10 PM</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5 pt-1">
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-teal-500/30 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  Open Google Maps Directions
                </a>
                <a
                  href={`tel:${casualtyPhone}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/40 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Call Casualty ({phone})
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
