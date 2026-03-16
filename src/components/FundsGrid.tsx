import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { FUNDS, TC } from '../data';
import type { FundType } from '../data';
import FundCard from './FundCard';

type FilterType = 'all' | FundType;

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all',       label: 'Todos (15)' },
  { id: 'monetario', label: '💶 Monetario' },
  { id: 'rf',        label: '📊 Renta Fija' },
  { id: 'mixto',     label: '⚖️ Mixtos' },
  { id: 'rv',        label: '📈 Renta Variable' },
];

export default function FundsGrid() {
  const [filter, setFilter] = useState<FilterType>('all');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const filtered = FUNDS.filter(f => filter === 'all' || f.type === filter);

  return (
    <section id="fondos" style={{ background: 'var(--slate)', padding: '88px 56px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '10px' }}>
            PASO 3 — LOS FONDOS ELEGIDOS
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--navy)', marginBottom: '6px' }}>
            Los 15 fondos <em style={{ fontStyle: 'italic', color: 'var(--blue)' }}>de un vistazo</em>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--g3)', marginBottom: '32px', maxWidth: '820px', lineHeight: 1.75 }}>
            Haz clic en cada tarjeta para ver el análisis completo. Usa los filtros para explorar por categoría.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}
        >
          {FILTERS.map(f => {
            const isActive = filter === f.id;
            const col = f.id === 'all' ? 'var(--navy)' : TC[f.id as FundType];
            return (
              <motion.button
                key={f.id}
                onClick={() => setFilter(f.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontSize: '15px', fontWeight: 500,
                  padding: '9px 20px', borderRadius: '28px',
                  border: isActive ? `2px solid ${col}` : '2px solid var(--g5)',
                  background: isActive ? col : '#fff',
                  color: isActive ? '#fff' : 'var(--g3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {f.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Cards grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '18px',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((fund, i) => (
              <FundCard
                key={fund.name}
                fund={fund}
                index={i}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
