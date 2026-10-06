import { motion } from 'framer-motion';
import {
  Ambulance,
  Baby,
  ShieldCheck,
  Eye,
  ScanLine,
  ArrowUpRight,
  MapPin,
  CheckCircle2,
  Activity,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { departments, type Department } from '@/data/mockData';

const iconMap: Record<string, LucideIcon> = {
  ambulance: Ambulance,
  baby: Baby,
  'shield-check': ShieldCheck,
  eye: Eye,
  'scan-line': ScanLine,
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface BentoGridProps {
  onCheckEligibility: () => void;
}

export default function BentoGrid({ onCheckEligibility }: BentoGridProps) {
  return (
    <section id="departments" className="bg-slate-900 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium mb-4">
            <Activity className="w-3.5 h-3.5" />
            Clinical Wings
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Five centers of excellence
          </h2>
          <p className="text-slate-300 mt-3 text-lg">
            From emergency trauma surgery to advanced eye care — each wing is purpose-built
            with dedicated specialists, equipment, and support staff.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          {departments.map((dept, index) => (
            <BentoCard
              key={dept.id}
              dept={dept}
              index={index}
              onCheckEligibility={onCheckEligibility}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  dept,
  index,
  onCheckEligibility,
}: {
  dept: Department;
  index: number;
  onCheckEligibility: () => void;
}) {
  const Icon = iconMap[dept.icon] ?? Activity;
  const isHighlighted = dept.highlight;
  const isCashless = dept.id === 'cashless-tpa';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08 }}
      whileHover={{
        y: -6,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      className={`group relative overflow-hidden rounded-2xl border transition-colors duration-300 ${
        dept.bentoSpan
      } ${
        isHighlighted
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-teal-500/50'
          : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
      }`}
    >
      {/* Accent glow */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: dept.accent }}
      />

      {/* Scan line for highlighted card */}
      {isHighlighted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 right-0 h-px opacity-30 animate-scan"
            style={{ background: `linear-gradient(90deg, transparent, ${dept.accent}, transparent)` }}
          />
        </div>
      )}

      <div className={`relative h-full p-5 flex flex-col ${isHighlighted ? 'lg:p-7' : ''}`}>
        {/* Icon + wing */}
        <div className="flex items-start justify-between mb-3">
          <div
            className={`rounded-xl flex items-center justify-center ${
              isHighlighted ? 'w-14 h-14' : 'w-11 h-11'
            }`}
            style={{
              backgroundColor: `${dept.accent}15`,
              border: `1px solid ${dept.accent}30`,
            }}
          >
            <Icon className="w-5 h-5" strokeWidth={2} style={{ color: dept.accent }} />
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${dept.accent}15`, color: dept.accent }}
          >
            {dept.shortName}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-white tracking-tight mb-1.5 ${
            isHighlighted ? 'text-xl lg:text-2xl' : 'text-base'
          }`}
        >
          {dept.name}
        </h3>

        {/* Description */}
        <p
          className={`text-slate-300 leading-relaxed mb-4 ${
            isHighlighted ? 'text-sm lg:text-base' : 'text-xs'
          } ${isHighlighted ? 'line-clamp-3' : 'line-clamp-2'}`}
        >
          {dept.description}
        </p>

        {/* Stats */}
        {isHighlighted && (
          <div className="grid grid-cols-3 gap-3 mb-4 mt-auto">
            {dept.stats.map((stat) => (
              <div key={stat.label} className="bg-slate-900/50 rounded-lg p-2.5 text-center border border-slate-800">
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wide mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        {(isHighlighted || dept.bentoSpan.includes('col-span-2')) && (
          <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
            {dept.features.map((feat) => (
              <span
                key={feat}
                className="inline-flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800"
              >
                <CheckCircle2 className="w-3 h-3" style={{ color: dept.accent }} />
                {feat}
              </span>
            ))}
          </div>
        )}

        {/* Footer: location + link */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5" />
            <span>{dept.floor}</span>
          </div>
          {isCashless ? (
            <button
              onClick={onCheckEligibility}
              className="flex items-center gap-1 text-xs font-medium transition-all hover:gap-2"
              style={{ color: dept.accent }}
            >
              <Search className="w-3.5 h-3.5" style={{ color: dept.accent }} />
              Check Eligibility
            </button>
          ) : (
            <a
              href="#home"
              className="flex items-center gap-1 text-xs font-medium transition-all hover:gap-2"
              style={{ color: dept.accent }}
            >
              Book
              <ArrowUpRight className="w-3.5 h-3.5" style={{ color: dept.accent }} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
