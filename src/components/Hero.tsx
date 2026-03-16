import { motion } from 'motion/react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as any },
});

const PILLS = [
  { count: '1', label: 'Monetario',      colorClass: 'text-blue-400',   bg: 'bg-blue-900/20 border border-blue-800/30' },
  { count: '7', label: 'Renta Fija',     colorClass: 'text-emerald-400',bg: 'bg-emerald-900/20 border border-emerald-800/30' },
  { count: '3', label: 'Mixtos/Alt.',    colorClass: 'text-amber-300',  bg: 'bg-amber-900/20 border border-amber-800/30' },
  { count: '4', label: 'Renta Variable', colorClass: 'text-red-300',    bg: 'bg-red-900/20 border border-red-800/30' },
];

export default function Hero() {
  return (
    <section className="relative bg-[#0B1629] px-14 pt-28 pb-20 overflow-hidden">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-violet-600" />

      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow orb */}
      <div className="absolute right-[8%] top-1/4 w-[560px] h-[560px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div {...fadeUp(0.1)}
          className="inline-flex items-center gap-2 text-[13px] font-bold tracking-widest text-blue-500 uppercase bg-blue-950/40 border border-blue-800/30 px-4 py-2 rounded-full mb-7"
        >
          📋 Guía de inversión familiar
        </motion.div>

        <motion.h1 {...fadeUp(0.2)}
          className="font-serif text-[clamp(52px,7vw,84px)] text-white leading-[1.04] tracking-tight mb-6"
        >
          Selección de<br />
          <em className="not-italic text-blue-300">fondos de inversión</em>
        </motion.h1>

        <motion.p {...fadeUp(0.3)}
          className="text-lg text-slate-400 max-w-2xl mb-12 leading-relaxed"
        >
          Entiende primero cómo funciona cada tipo de fondo, luego calcula tu cartera ideal
          y explora los 15 fondos seleccionados para la familia.
        </motion.p>

        {/* Stats */}
        <motion.div {...fadeUp(0.4)} className="flex gap-14 flex-wrap mb-12">
          {[
            { num: '15', label: 'fondos seleccionados' },
            { num: '4',  label: 'categorías' },
            { num: '€204k', label: 'capital de ejemplo' },
          ].map(s => (
            <div key={s.num}>
              <div className="font-serif text-[52px] text-white leading-none">{s.num}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Pills */}
        <div className="flex gap-3 flex-wrap">
          {PILLS.map((pill, i) => (
            <motion.div
              key={pill.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl ${pill.bg}`}
            >
              <span className={`font-serif text-3xl font-bold ${pill.colorClass}`}>{pill.count}</span>
              <span className={`text-base font-medium ${pill.colorClass}`}>{pill.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
