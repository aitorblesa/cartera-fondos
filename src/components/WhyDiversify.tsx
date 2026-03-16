import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const PILLARS = [
  { icon: '🛡', title: 'Protección', titleColor: '#60A5FA', bg: '#1E3A8A20', border: '#2563EB', desc: 'El monetario y la renta fija forman la base. Capital seguro, cupones predecibles y liquidez en cualquier momento.' },
  { icon: '⚖️', title: 'Equilibrio', titleColor: '#FCD34D', bg: '#78350F20', border: '#B45309', desc: 'Los fondos mixtos y alternativos se adaptan a cualquier entorno. Pueden ganar incluso cuando la bolsa y los bonos caen a la vez.' },
  { icon: '📈', title: 'Crecimiento', titleColor: '#FCA5A5', bg: '#7F1D1D20', border: '#C53030', desc: 'La renta variable value es el motor a largo plazo. Mayor volatilidad a corto, pero mayor rentabilidad en horizontes de 5+ años.' },
];

export default function WhyDiversify() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="por-que" style={{ background: 'var(--navy3)', padding: '88px 56px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '.08em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '10px' }}>
            DIVERSIFICACIÓN
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(34px, 3.5vw, 52px)', color: '#fff', marginBottom: '10px' }}>
            ¿Por qué 15 fondos distintos?
          </h2>
          <p style={{ fontSize: '19px', color: '#64748B', marginBottom: '44px', maxWidth: '760px', lineHeight: 1.75 }}>
            No pongas todos los huevos en la misma cesta. Cuando la bolsa cae, los bonos aguantan. Cuando los tipos suben, los alternativos protegen.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', marginBottom: '56px' }}>
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              style={{
                borderRadius: '18px', padding: '30px 26px',
                background: p.bg, borderLeft: `5px solid ${p.border}`,
              }}
            >
              <div style={{ fontSize: '38px', marginBottom: '14px' }}>{p.icon}</div>
              <div style={{ fontSize: '21px', fontWeight: 600, color: p.titleColor, marginBottom: '8px' }}>{p.title}</div>
              <div style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.7 }}>{p.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Alternativas section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div style={{ height: '1px', background: '#1E3A6E', marginBottom: '48px' }} />
          <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '.08em', color: '#065F46', textTransform: 'uppercase', marginBottom: '10px' }}>
            FONDOS ALTERNATIVOS
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3vw, 42px)', color: '#fff', marginBottom: '12px' }}>
            ¿Qué es un fondo alternativo?
          </h3>
          <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '860px', lineHeight: 1.75, marginBottom: '36px' }}>
            Son fondos que usan herramientas más sofisticadas que comprar acciones o bonos. Pueden apostar a que algo <strong style={{ color: '#94A3B8' }}>baje</strong> (posiciones cortas), usar derivados de cobertura y acceder a instrumentos especiales.{' '}
            <strong style={{ color: '#94A3B8' }}>La complejidad la gestiona el equipo profesional, no tú.</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', borderLeft: '5px solid var(--teal)', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--navy)', marginBottom: '8px' }}>Dunas Valor Equilibrado</div>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.06em', background: '#D1FAE5', color: '#065F46', padding: '5px 14px', borderRadius: '24px', display: 'inline-block', marginBottom: '14px' }}>
                INSTRUMENTO: CoCos Bancarios
              </span>
              <p style={{ fontSize: '16px', color: 'var(--g3)', lineHeight: 1.75 }}>
                Los CoCos son bonos emitidos por bancos con cupones muy altos. En condiciones normales pagan ese cupón. Solo se convierten en acciones si el banco tiene una crisis grave. A pesar de usar estos instrumentos sofisticados, su riesgo oficial es <strong>2/7 (bajo)</strong> gracias a una gestión muy rigurosa del riesgo.
              </p>
            </div>
            <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', borderLeft: '5px solid #7C3AED', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--navy)', marginBottom: '8px' }}>DNCA Alpha Bonds</div>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.06em', background: '#EDE9FE', color: '#5B21B6', padding: '5px 14px', borderRadius: '24px', display: 'inline-block', marginBottom: '14px' }}>
                ESTRATEGIA: Posiciones cortas en tipos
              </span>
              <p style={{ fontSize: '16px', color: 'var(--g3)', lineHeight: 1.75 }}>
                Este fondo puede apostar a que los tipos de interés van a <strong>subir</strong>, y ganar dinero cuando lo hacen. En 2022, cuando el BCE subió tipos agresivamente y toda la renta fija tradicional perdía un 10–15%, DNCA Alpha Bonds ganó <strong>+5,99%</strong> porque había anticipado esas subidas.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
