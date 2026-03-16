import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const TYPES = [
  {
    icon: '💶',
    title: 'Monetario',
    badge: 'LIQUIDEZ TOTAL',
    badgeBg: '#EFF6FF', badgeColor: '#1D4ED8',
    borderColor: '#BFDBFE',
    desc: `Invierte en deuda a muy corto plazo: letras del Tesoro, pagarés y depósitos con vencimiento inferior a 6 meses. Es el equivalente a una cuenta corriente que genera rentabilidad.\n\n<strong>Úsalo para:</strong> capital que puedes necesitar pronto, reserva de emergencia o como "sala de espera" antes de invertir.`,
    riskLabel: 'Riesgo muy bajo', riskColor: '#1D4ED8',
    dots: 1, rent: '~2–4% / año', rentColor: '#2563EB',
  },
  {
    icon: '📊',
    title: 'Renta Fija',
    badge: 'BONOS Y CUPONES',
    badgeBg: '#F0FDF4', badgeColor: '#166534',
    borderColor: '#A7F3D0',
    desc: `Invierte en bonos (préstamos a empresas o gobiernos que pagan un interés fijo llamado "cupón"). Cuanto más largo el vencimiento y más arriesgado el emisor, mayor rentabilidad potencial.\n\n<strong>Úsalo para:</strong> base estable de la cartera, generar ingresos predecibles y amortiguar la volatilidad de la bolsa.`,
    riskLabel: 'Riesgo bajo–moderado', riskColor: '#166534',
    dots: 3, dotColor: '#0D7A5F', rent: '~3–6% / año', rentColor: '#0D7A5F',
  },
  {
    icon: '⚖️',
    title: 'Mixtos y Alternativos',
    badge: 'ADAPTABILIDAD',
    badgeBg: '#FFFBEB', badgeColor: '#92400E',
    borderColor: '#FDE68A',
    desc: `Combinan distintos activos (bonos + acciones + derivados) con libertad total. Los alternativos pueden usar estrategias sofisticadas: posiciones cortas, CoCos bancarios, arbitraje. Pueden ganar en cualquier entorno.\n\n<strong>Úsalos como:</strong> bisagra flexible que se adapta al ciclo y protege cuando todo cae.`,
    riskLabel: 'Riesgo moderado', riskColor: '#92400E',
    dots: 3, dotColor: '#B45309', rent: '~3–8% / año', rentColor: '#B45309',
  },
  {
    icon: '📈',
    title: 'Renta Variable',
    badge: 'ACCIONES / BOLSA',
    badgeBg: '#FFF5F5', badgeColor: '#991B1B',
    borderColor: '#FECACA',
    desc: `Invierte en acciones de empresas. El valor sube y baja con el mercado. A corto plazo puede caer un 20–40%, pero a largo plazo (10+ años) es el activo que más rentabilidad ha generado históricamente.\n\n<strong>Úsalo para:</strong> hacer crecer el patrimonio a largo plazo. Nunca con dinero que puedas necesitar en menos de 5 años.`,
    riskLabel: 'Riesgo alto', riskColor: '#991B1B',
    dots: 6, dotColor: '#C53030', rent: '~7–12% largo plazo', rentColor: '#C53030',
  },
];

function RiskDots({ filled, color = '#2563EB' }: { filled: number; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '7px' }}>
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} style={{
          width: '11px', height: '11px', borderRadius: '50%',
          background: i < filled ? color : '#E2E8F0',
          transition: 'background 0.3s',
        }} />
      ))}
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginLeft: '6px' }}>
        {filled}/7
      </span>
    </div>
  );
}

export default function FundTypes() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="tipos" style={{ background: '#fff', padding: '88px 56px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            fontSize: '13px', fontWeight: 700, letterSpacing: '.09em',
            textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '10px',
          }}>
            PASO 1 — ENTIENDE LOS TIPOS
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(34px, 3.5vw, 52px)',
            color: 'var(--navy)', lineHeight: 1.1, marginBottom: '10px',
          }}>
            ¿Qué tipo de fondo <em style={{ fontStyle: 'italic', color: 'var(--blue)' }}>es cada uno</em>?
          </h2>
          <p style={{
            fontSize: '18px', color: 'var(--g3)', marginBottom: '48px',
            maxWidth: '820px', lineHeight: 1.75,
          }}>
            Antes de ver los fondos concretos, es importante entender a qué categoría pertenece
            cada uno y qué papel juega en una cartera diversificada.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {TYPES.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.09)' }}
              style={{
                borderRadius: '20px',
                border: `2px solid ${t.borderColor}`,
                background: '#fff',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{ padding: '32px 28px 20px' }}>
                <div style={{ fontSize: '42px', marginBottom: '14px' }}>{t.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: '26px',
                  color: 'var(--navy)', marginBottom: '8px',
                }}>
                  {t.title}
                </div>
                <span style={{
                  fontSize: '12px', fontWeight: 700, letterSpacing: '.07em',
                  textTransform: 'uppercase', padding: '5px 14px',
                  borderRadius: '24px', display: 'inline-block', marginBottom: '16px',
                  background: t.badgeBg, color: t.badgeColor,
                }}>
                  {t.badge}
                </span>
                <p
                  style={{ fontSize: '15px', color: 'var(--g3)', lineHeight: 1.75 }}
                  dangerouslySetInnerHTML={{ __html: t.desc.replace(/\n\n/g, '<br/><br/>') }}
                />
              </div>
              <div style={{ flex: 1 }} />
              <div style={{
                padding: '18px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderTop: `1px solid ${t.borderColor}`,
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: t.riskColor }}>
                    {t.riskLabel}
                  </div>
                  <RiskDots filled={t.dots} color={t.dotColor || t.rentColor} />
                </div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: t.rentColor }}>
                  {t.rent}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
