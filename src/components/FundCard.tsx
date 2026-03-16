import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Fund } from '../data';
import { TYPE_STYLES, RISK_LABEL, RISK_COLOR } from '../data';

interface Props { fund: Fund; index: number; }

export default function FundCard({ fund, index }: Props) {
  const [open, setOpen] = useState(false);
  const s = TYPE_STYLES[fund.type];
  const isAlt = fund.name.includes('DNCA') || fund.name.includes('Dunas');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] as any }}
      whileHover={!open ? { y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' } : {}}
      onClick={() => setOpen(!open)}
      className={`bg-white rounded-2xl border-2 overflow-hidden cursor-pointer flex flex-col transition-colors duration-200 ${open ? 'border-slate-300 shadow-lg' : 'border-slate-200'}`}
    >
      {/* Stripe */}
      <div className={`h-1.5 w-full ${s.stripe}`} />

      {/* Body */}
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold tracking-[0.05em] px-3 py-1 rounded-full ${s.badgeBg} ${s.badgeText}`}>
            {s.badgeLabel}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-slate-200">#{String(index + 1).padStart(2, '0')}</span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] text-slate-400 inline-block"
            >▼</motion.span>
          </div>
        </div>

        <h3 className="font-serif text-[21px] text-navy leading-snug">{fund.name}</h3>
        <p className="text-[13px] text-slate-400">{fund.mgr}</p>

        <div className="h-px bg-slate-100" />

        {/* Risk dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${i < fund.r ? s.riskDot : 'bg-slate-200'}`} />
          ))}
          <span className={`text-[12px] font-semibold ml-1.5 ${RISK_COLOR[fund.r]}`}>
            {fund.r}/7 · {RISK_LABEL[fund.r]}
          </span>
        </div>

        <div className={`text-[19px] font-bold ${s.rentText}`}>{fund.rent}</div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-1.5">
          {fund.d.map(([label, val]) => (
            <div key={label} className="bg-slate-50 rounded-lg px-2.5 py-2">
              <div className="text-[10px] text-slate-400 truncate">{label}</div>
              <div className="text-[12px] font-semibold text-slate-700 truncate">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] as any }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 p-5 flex flex-col gap-4">
              {isAlt && (
                <span className="self-start text-[11px] font-semibold px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🔬 Fondo alternativo
                </span>
              )}
              <div>
                <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-slate-400 mb-1.5">Qué hace</div>
                <p className="text-[14px] text-slate-600 leading-relaxed">{fund.desc}</p>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-slate-400 mb-2">Por qué está en la cartera</div>
                {fund.pros.map(pro => (
                  <div key={pro} className="flex items-start gap-2.5 mt-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${s.riskDot}`} />
                    <span className="text-[14px] text-slate-600 leading-relaxed">{pro}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
