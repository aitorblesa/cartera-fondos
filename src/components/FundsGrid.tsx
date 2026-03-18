import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { FUNDS, TYPE_STYLES } from '../data';
import type { FundType } from '../data';
import FundCard from './FundCard';

type Filter = 'all' | FundType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',       label: 'Todos (15)' },
  { id: 'rv',        label: '📈 Renta Variable' },
  { id: 'mixto',     label: '⚖️ Mixtos' },
  { id: 'rf',        label: '📊 Renta Fija' },
  { id: 'monetario', label: '💶 Monetario' },
];

export default function FundsGrid() {
  const [filter, setFilter] = useState<Filter>('all');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const filtered = FUNDS.filter(f => filter === 'all' || f.type === filter);

  return (
    <section id="fondos" className="bg-slate-100 px-14 py-20">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold tracking-[0.09em] uppercase text-blue-600 mb-2.5">PASO 3 — LOS FONDOS ELEGIDOS</p>
          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] text-navy leading-tight mb-2.5">
            Fondos seleccionados <em className="not-italic text-blue-600">de un vistazo</em>
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-3xl leading-relaxed">
            Haz clic en cada tarjeta para ver el análisis completo. Usa los filtros para explorar por categoría.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2.5 flex-wrap mb-7"
        >
          {FILTERS.map(f => {
            const active = filter === f.id;
            const hex = f.id !== 'all' ? TYPE_STYLES[f.id as FundType].hex : '#1B2B5B';
            return (
              <motion.button
                key={f.id}
                onClick={() => setFilter(f.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`text-sm font-medium px-5 py-2 rounded-full border-2 font-sans transition-all duration-200 ${
                  active ? 'text-white border-transparent' : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700'
                }`}
                style={active ? { background: hex, borderColor: hex } : {}}
              >
                {f.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((fund, i) => (
              <FundCard key={fund.name} fund={fund} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
