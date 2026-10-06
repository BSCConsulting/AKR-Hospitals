import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Activity, Building2 } from 'lucide-react';
import { hospitalInfo } from '@/data/mockData';

export default function LocationSection() {
  const { coordinates, mapsDirectionsUrl, phone, address } = hospitalInfo;
  const embedSrc = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=en&z=15&output=embed`;
  const casualtyPhone = phone.replace(/\s/g, '');

  return (
    <section id="location" className="relative section-pad">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl section-header"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Find & Reach Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Located in the heart of Madhira
          </h2>
          <p className="text-slate-600 mt-3 text-lg">
            Samatha Nagar, Didugupadu — easily accessible from Khammam and surrounding
            villages. Our 24/7 casualty entrance is on the ground floor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-900/5 h-[360px] lg:h-full min-h-[360px] bg-white">
              <iframe
                src={embedSrc}
                title="Hospital Location Map"
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="absolute top-4 left-4 glass-surface !rounded-xl px-4 py-2.5 pointer-events-none">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-semibold text-slate-900">{hospitalInfo.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{address}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-surface p-6 space-y-5 h-full">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Landmark</div>
                    <div className="text-xs text-slate-600 mt-0.5">{hospitalInfo.landmark}</div>
                    <div className="text-xs text-slate-500">Madhira, Khammam, Telangana 507203</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                  <div className="relative">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-800">24/7 Casualty Entrance</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Ground Floor — always open</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>OPD: 9 AM – 8 PM Daily · Diagnostics: 7 AM – 10 PM</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-600 transition-all shadow-md shadow-teal-700/15"
                >
                  <Navigation className="w-4 h-4" />
                  Open Google Maps Directions
                </a>
                <a
                  href={`tel:${casualtyPhone}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-teal-300 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
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
