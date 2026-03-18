import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const TYPES = [
  {
    icon: '💶', title: 'Monetario', badge: 'LIQUIDEZ TOTAL',
    badgeCls: 'bg-blue-50 text-blue-700', borderCls: 'border-blue-200',
    riskColor: 'text-blue-700', dotColor: 'bg-blue-600', dotFilled: 1,
    rent: '~2–4% / año', rentCls: 'text-blue-600',
    riskLabel: 'Riesgo muy bajo',
    desc: 'Invierte en deuda a muy corto plazo: letras del Tesoro, pagarés y depósitos con vencimiento inferior a 6 meses. Es el equivalente a una cuenta corriente que genera rentabilidad.',
    usage: 'capital que puedes necesitar pronto, reserva de emergencia o como "sala de espera" antes de invertir.',
  },
  {
    icon: '📊', title: 'Renta Fija', badge: 'BONOS Y CUPONES',
    badgeCls: 'bg-emerald-50 text-emerald-800', borderCls: 'border-emerald-200',
    riskColor: 'text-emerald-800', dotColor: 'bg-teal-700', dotFilled: 3,
    rent: '~3–6% / año', rentCls: 'text-teal-700',
    riskLabel: 'Riesgo bajo–moderado',
    desc: 'Invierte en bonos (préstamos a empresas o gobiernos que pagan un interés fijo llamado "cupón"). Cuanto más largo el vencimiento y más arriesgado el emisor, mayor rentabilidad potencial.',
    usage: 'base estable de la cartera, generar ingresos predecibles y amortiguar la volatilidad de la bolsa.',
  },
  {
    icon: '⚖️', title: 'Mixtos y Alternativos', badge: 'ADAPTABILIDAD',
    badgeCls: 'bg-amber-50 text-amber-800', borderCls: 'border-amber-200',
    riskColor: 'text-amber-800', dotColor: 'bg-amber-700', dotFilled: 3,
    rent: '~3–8% / año', rentCls: 'text-amber-700',
    riskLabel: 'Riesgo moderado',
    desc: 'Combinan distintos activos (bonos + acciones + derivados) con libertad total. Los alternativos pueden usar estrategias sofisticadas: posiciones cortas, CoCos bancarios, arbitraje. Pueden ganar en cualquier entorno.',
    usage: 'bisagra flexible que se adapta al ciclo y protege cuando todo cae.',
  },
  {
    icon: '📈', title: 'Renta Variable', badge: 'ACCIONES / BOLSA',
    badgeCls: 'bg-red-50 text-red-800', borderCls: 'border-red-200',
    riskColor: 'text-red-800', dotColor: 'bg-red-700', dotFilled: 6,
    rent: '~7–12% largo plazo', rentCls: 'text-red-700',
    riskLabel: 'Riesgo alto',
    desc: 'Invierte en acciones de empresas. El valor sube y baja con el mercado. A corto plazo puede caer un 20–40%, pero a largo plazo (10+ años) es el activo que más rentabilidad ha generado históricamente.',
    usage: 'hacer crecer el patrimonio a largo plazo. Nunca con dinero que puedas necesitar en menos de 5 años.',
  },
];

export default function FundTypes() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="tipos" className="bg-white px-14 py-20">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold tracking-[0.09em] uppercase text-blue-600 mb-2.5">
            PASO 1 — ENTIENDE LOS TIPOS
          </p>
          <h2 className="font-serif text-[clamp(34px,3.5vw,52px)] text-navy leading-tight mb-3">
            ¿Qué tipo de fondo{' '}
            <em className="not-italic text-blue-600">es cada uno</em>?
          </h2>
          <p className="text-lg text-slate-500 mb-12 max-w-3xl leading-relaxed">
            Antes de ver los fondos concretos, es importante entender a qué categoría pertenece
            cada uno y qué papel juega en una cartera diversificada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {TYPES.reverse().map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] as any }}
              whileHover={{ y: -5, boxShadow: '0 18px 48px rgba(0,0,0,0.1)' }}
              className={`rounded-2xl border-2 ${t.borderCls} bg-white flex flex-col overflow-hidden`}
            >
              <div className="p-8 flex-1">
                <div className="text-4xl mb-4">{t.icon}</div>
                <h3 className="font-serif text-2xl text-navy mb-2.5">{t.title}</h3>
                <span className={`text-[11px] font-bold tracking-[0.07em] uppercase px-3 py-1.5 rounded-full inline-block mb-4 ${t.badgeCls}`}>
                  {t.badge}
                </span>
                <p className="text-sm text-slate-500 leading-relaxed mb-2">{t.desc}</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Úsalo para:</strong> {t.usage}
                </p>
              </div>
              <div className={`px-8 py-4 flex items-center justify-between border-t ${t.borderCls}`}>
                <div>
                  <div className={`text-[13px] font-semibold ${t.riskColor}`}>{t.riskLabel}</div>
                  <div className="flex gap-1.5 items-center mt-1.5">
                    {Array.from({ length: 7 }, (_, di) => (
                      <div
                        key={di}
                        className={`w-2.5 h-2.5 rounded-full ${di < t.dotFilled ? t.dotColor : 'bg-slate-200'}`}
                      />
                    ))}
                    <span className="text-xs font-semibold text-slate-400 ml-1.5">{t.dotFilled}/7</span>
                  </div>
                </div>
                <div className={`text-base font-bold ${t.rentCls}`}>{t.rent}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
