import { useRef } from "react";
import { motion, useInView } from "motion/react";

const PILLARS = [
  {
    icon: "🛡",
    title: "Protección",
    titleCls: "text-blue-300",
    bg: "bg-blue-900/20",
    border: "border-l-blue-500",
    desc: "El monetario y la renta fija forman la base. Capital seguro, cupones predecibles y liquidez en cualquier momento.",
  },
  {
    icon: "⚖️",
    title: "Equilibrio",
    titleCls: "text-amber-300",
    bg: "bg-amber-900/20",
    border: "border-l-amber-600",
    desc: "Los fondos mixtos y alternativos se adaptan a cualquier entorno. Pueden ganar incluso cuando la bolsa y los bonos caen a la vez.",
  },
  {
    icon: "📈",
    title: "Crecimiento",
    titleCls: "text-red-300",
    bg: "bg-red-900/20",
    border: "border-l-red-600",
    desc: "La renta variable value es el motor a largo plazo. Mayor volatilidad a corto, pero mayor rentabilidad en horizontes de 5+ años.",
  },
];

export default function WhyDiversify() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="por-que" className="bg-[#0B1629] px-14 py-20">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-2.5">
            DIVERSIFICACIÓN
          </p>
          <h2 className="font-serif text-[clamp(34px,3.5vw,52px)] text-white leading-tight mb-3">
            ¿Por qué 15 fondos distintos?
          </h2>
          <p className="text-lg text-slate-500 mb-11 max-w-2xl leading-relaxed">
            No pongas todos los huevos en la misma cesta. Cuando la bolsa cae,
            los bonos aguantan. Cuando los tipos suben, los alternativos
            protegen.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.12,
                ease: [0.16, 1, 0.3, 1] as any,
              }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl p-8 border-l-4 ${p.bg} ${p.border}`}
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <div className={`text-xl font-semibold mb-2 ${p.titleCls}`}>
                {p.title}
              </div>
              <div className="text-[15px] text-slate-400 leading-relaxed">
                {p.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alternatives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="h-px bg-[#1E3A6E] mb-12" />
          <p className="text-xs font-bold tracking-widest uppercase text-emerald-700 mb-2.5">
            FONDOS ALTERNATIVOS
          </p>
          <h3 className="font-serif text-[clamp(28px,3vw,42px)] text-white mb-4">
            ¿Qué es un fondo alternativo?
          </h3>
          <p className="text-lg text-slate-500 max-w-3xl leading-relaxed mb-9">
            Son fondos que usan herramientas más sofisticadas que comprar
            acciones o bonos. Pueden apostar a que algo{" "}
            <strong className="text-slate-300">baje</strong> (posiciones
            cortas), usar derivados de cobertura y acceder a instrumentos
            especiales.{" "}
            <strong className="text-slate-300">
              La complejidad la gestiona el equipo profesional, no tú.
            </strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-7 border-l-4 border-l-teal-600 shadow-xl shadow-black/20">
              <h4 className="font-serif text-[22px] text-navy mb-2">
                Dunas Valor Equilibrado
              </h4>
              <span className="text-[11px] font-bold tracking-widest uppercase bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full inline-block mb-4">
                INSTRUMENTO: CoCos Bancarios
              </span>
              <p className="text-[15px] text-slate-500 leading-relaxed">
                Los CoCos son bonos emitidos por bancos con cupones muy altos.
                En condiciones normales pagan ese cupón. Solo se convierten en
                acciones si el banco tiene una crisis grave. A pesar de usar
                estos instrumentos sofisticados, su riesgo oficial es{" "}
                <strong className="text-slate-700">2/7 (bajo)</strong> gracias a
                una gestión muy rigurosa del riesgo.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-7 border-l-4 border-l-violet-600 shadow-xl shadow-black/20">
              <h4 className="font-serif text-[22px] text-navy mb-2">
                DNCA Alpha Bonds
              </h4>
              <span className="text-[11px] font-bold tracking-widest uppercase bg-violet-100 text-violet-800 px-3.5 py-1.5 rounded-full inline-block mb-4">
                ESTRATEGIA: Posiciones cortas en tipos
              </span>
              <p className="text-[15px] text-slate-500 leading-relaxed">
                Este fondo puede apostar a que los tipos de interés van a{" "}
                <strong className="text-slate-700">subir</strong>, y ganar
                dinero cuando lo hacen. En 2022, cuando el BCE subió tipos
                agresivamente y toda la renta fija tradicional perdía un 10–15%,
                DNCA Alpha Bonds ganó{" "}
                <strong className="text-slate-700">+5,99%</strong> porque había
                anticipado esas subidas.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
