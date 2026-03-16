import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Fund } from '../data';
import { TC, TLB, TLT, TL, RC, RL } from '../data';

interface FundCardProps {
  fund: Fund;
  index: number;
}

export default function FundCard({ fund, index }: FundCardProps) {
  const [expanded, setExpanded] = useState(false);
  const tc = TC[fund.type];
  const isAlt = fund.name.includes('DNCA') || fund.name.includes('Dunas');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={!expanded ? { y: -4, boxShadow: '0 14px 36px rgba(0,0,0,0.1)' } : {}}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: '#fff',
        borderRadius: '18px',
        border: `2px solid ${expanded ? '#CBD5E1' : 'var(--slate2)'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: expanded ? '0 6px 24px rgba(0,0,0,0.09)' : 'none',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Stripe */}
      <div style={{ height: '7px', background: tc, width: '100%' }} />

      {/* Body */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.05em', padding: '4px 12px', borderRadius: '24px', background: TLB[fund.type], color: TLT[fund.type] }}>
            {TL[fund.type]}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>
              #{String(index + 1).padStart(2, '0')}
            </span>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ fontSize: '12px', color: '#94A3B8', display: 'inline-block' }}
            >▼</motion.span>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '21px', color: 'var(--navy)', lineHeight: 1.25 }}>
          {fund.name}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--g4)' }}>{fund.mgr}</div>

        <div style={{ height: '1px', background: 'var(--slate2)' }} />

        {/* Risk dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, background: i < fund.r ? tc : '#E2E8F0' }} />
          ))}
          <span style={{ fontSize: '13px', fontWeight: 600, color: RC[fund.r], marginLeft: '6px' }}>
            {fund.r}/7 · {RL[fund.r]}
          </span>
        </div>

        <div style={{ fontSize: '19px', fontWeight: 700, color: tc }}>{fund.rent}</div>

        {/* Mini stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {fund.d.map(([label, val]) => (
            <div key={label} style={{ background: 'var(--slate)', borderRadius: '8px', padding: '7px 9px' }}>
              <div style={{ fontSize: '11px', color: 'var(--g4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--g2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid var(--slate2)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isAlt && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '5px 13px', borderRadius: '24px', background: '#F0FDF4', color: '#065F46', border: '1px solid #BBF7D0', alignSelf: 'flex-start' }}>
                  🔬 Fondo alternativo
                </span>
              )}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--g4)', marginBottom: '6px' }}>Qué hace</div>
                <p style={{ fontSize: '14px', color: 'var(--g2)', lineHeight: 1.75 }}>{fund.desc}</p>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--g4)', marginBottom: '8px' }}>Por qué está en la cartera</div>
                {fund.pros.map(pro => (
                  <div key={pro} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '14px', color: 'var(--g2)', lineHeight: 1.65, marginTop: '6px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: tc, marginTop: '5px', flexShrink: 0 }} />
                    <span>{pro}</span>
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
