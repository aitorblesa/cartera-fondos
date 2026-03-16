import { motion } from 'motion/react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

const PILLS = [
  { count: '1', label: 'Monetario',      bg: '#1E3A8A20', border: '#2563EB30', color: '#60A5FA' },
  { count: '7', label: 'Renta Fija',     bg: '#04342C20', border: '#0D7A5F30', color: '#34D399' },
  { count: '3', label: 'Mixtos/Alt.',    bg: '#78350F20', border: '#B4530930', color: '#FCD34D' },
  { count: '4', label: 'Renta Variable', bg: '#7F1D1D20', border: '#C5303030', color: '#FCA5A5' },
];

export default function Hero() {
  return (
    <section
      style={{
        background: 'var(--navy3)',
        padding: '120px 56px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: 'linear-gradient(90deg, var(--blue), #60A5FA, var(--purple))',
      }} />

      {/* Background grid decoration */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Glowing orb */}
      <div style={{
        position: 'absolute', right: '10%', top: '20%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        <motion.div {...fadeUp(0.1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', fontWeight: 700, letterSpacing: '.08em',
            color: 'var(--blue)', textTransform: 'uppercase',
            background: '#1E3A8A18', border: '1px solid rgba(37,99,235,0.25)',
            padding: '8px 18px', borderRadius: '24px', marginBottom: '28px',
          }}
        >
          📋 Guía de inversión familiar
        </motion.div>

        <motion.h1 {...fadeUp(0.2)}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(52px, 7vw, 88px)',
            color: '#fff',
            lineHeight: 1.05,
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}
        >
          Selección de<br />
          <em style={{ fontStyle: 'italic', color: '#60A5FA' }}>fondos de inversión</em>
        </motion.h1>

        <motion.p {...fadeUp(0.3)}
          style={{
            fontSize: '19px', color: '#94A3B8', maxWidth: '700px',
            marginBottom: '52px', lineHeight: 1.75,
          }}
        >
          Entiende primero cómo funciona cada tipo de fondo, luego calcula tu cartera ideal
          y explora los 15 fondos seleccionados para la familia.
        </motion.p>

        {/* Stats */}
        <motion.div {...fadeUp(0.4)}
          style={{ display: 'flex', gap: '56px', flexWrap: 'wrap', marginBottom: '52px' }}
        >
          {[
            { num: '15', label: 'fondos seleccionados' },
            { num: '4', label: 'categorías' },
            { num: '€204k', label: 'capital de ejemplo' },
          ].map(stat => (
            <div key={stat.num}>
              <div style={{
                fontFamily: 'var(--font-serif)', fontSize: '54px',
                color: '#fff', lineHeight: 1,
              }}>{stat.num}</div>
              <div style={{ fontSize: '15px', color: '#475569', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Category pills */}
        <motion.div {...fadeUp(0.5)}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
        >
          {PILLS.map((pill, i) => (
            <motion.div
              key={pill.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 22px', borderRadius: '14px',
                background: pill.bg, border: `1px solid ${pill.border}`,
                color: pill.color,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-serif)', fontSize: '30px',
                fontWeight: 700, color: pill.color,
              }}>{pill.count}</span>
              <span style={{ fontSize: '16px', fontWeight: 500 }}>{pill.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
