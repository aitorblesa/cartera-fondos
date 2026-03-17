import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  createChart,
  AreaSeries,
  LineSeries,
  LineStyle,
  CrosshairMode,
} from "lightweight-charts";
import { CATS } from "../data";

/* ─── helpers ─── */
const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n) + " €";
const fmtS = (v: number) =>
  v >= 1e6 ? (v / 1e6).toFixed(2) + "M€" : (v / 1000).toFixed(0) + "k€";
const fmtP = (n: number) => n.toFixed(2) + "%";

function fv(capital: number, rate: number, years: number, dca: number) {
  const r = rate / 100;
  const cg = capital * Math.pow(1 + r, years);
  if (!dca || !r) return cg + dca * 12 * years;
  const rm = r / 12,
    m = years * 12;
  return cg + dca * ((Math.pow(1 + rm, m) - 1) / rm);
}

function profile(ret: number) {
  if (ret < 3)
    return {
      name: "Perfil Conservador",
      color: "text-teal-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      badges: ["Baja volatilidad", "Capital seguro", "Liquidez alta"],
      bCls: "bg-emerald-100 text-emerald-800",
    };
  if (ret < 4.5)
    return {
      name: "Perfil Moderado-Conservador",
      color: "text-teal-700",
      bg: "bg-emerald-50",
      border: "border-green-300",
      badges: ["Riesgo controlado", "RF dominante", "Horizonte 3–5A"],
      bCls: "bg-emerald-100 text-emerald-800",
    };
  if (ret < 6)
    return {
      name: "Perfil Moderado",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      badges: ["Equilibrio RF/RV", "Volatilidad media", "Largo plazo"],
      bCls: "bg-amber-100 text-amber-800",
    };
  if (ret < 8)
    return {
      name: "Perfil Moderado-Agresivo",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      badges: ["RV dominante", "Alta rentabilidad", "Horizonte 7–15A"],
      bCls: "bg-red-100 text-red-800",
    };
  return {
    name: "Perfil Agresivo / Largo Plazo",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-300",
    badges: ["Máximo potencial", "Alta volatilidad", "Solo 10+ años"],
    bCls: "bg-red-100 text-red-800",
  };
}

/* ─── Donut ─── */
function DonutChart({
  weights,
  rets,
  totalRet,
}: {
  weights: number[];
  rets: number[];
  totalRet: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width,
      H = c.height,
      cx = W / 2,
      cy = H / 2,
      R = 94,
      r = 54;
    ctx.clearRect(0, 0, W, H);
    const tot = weights.reduce((a, b) => a + b, 0) || 1;
    let ang = -Math.PI / 2;
    CATS.forEach((cat, i) => {
      const sl = (weights[i] / tot) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, ang, ang + sl);
      ctx.closePath();
      ctx.fillStyle = cat.color;
      ctx.fill();
      ang += sl;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.fillStyle = "#1B2B5B";
    ctx.font = "bold 13px 'DM Sans',sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(totalRet.toFixed(2) + "%", cx, cy - 7);
    ctx.font = "10px 'DM Sans',sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("retorno esp.", cx, cy + 9);
  }, [weights, rets, totalRet]);

  return (
    <div>
      <canvas ref={ref} width={236} height={236} className="block mx-auto" />
      <div className="mt-3 flex flex-col gap-1.5">
        {CATS.map((c, i) => (
          <div key={c.id} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: c.color }}
              />
              <span className="text-sm text-slate-700">{c.label}</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: c.color }}>
              {weights[i].toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Growth chart ─── */
function GrowthChart({
  capital,
  totalRet,
  years,
  dca,
}: {
  capital: number;
  totalRet: number;
  years: number;
  dca: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dcaOn = dca > 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      height: 260,
      layout: {
        background: { color: "transparent" },
        textColor: "#94A3B8",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "rgba(226,232,240,0.7)", style: LineStyle.Dashed },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.08, bottom: 0.08 },
        ticksVisible: false,
      },
      timeScale: {
        borderVisible: false,
        tickMarkFormatter: (time: number) => {
          const y =
            new Date(time * 1000).getUTCFullYear() -
            new Date().getUTCFullYear();
          return "A" + y;
        },
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#CBD5E1",
          width: 1,
          style: LineStyle.Dashed,
          labelVisible: false,
        },
        horzLine: {
          color: "#CBD5E1",
          width: 1,
          style: LineStyle.Dashed,
          labelVisible: false,
        },
      },
      handleScroll: false,
      handleScale: false,
    });

    const now = new Date();
    const startYear = now.getUTCFullYear();

    const toTime = (i: number): number => Date.UTC(startYear + i, 0, 1) / 1000;

    const lineColor = dcaOn ? "#059669" : "#7C3AED";
    const topColor = dcaOn ? "rgba(5,150,105,0.22)" : "rgba(124,58,237,0.22)";
    const bottomColor = dcaOn ? "rgba(5,150,105,0)" : "rgba(124,58,237,0)";

    // Primary area series
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor,
      topColor,
      bottomColor,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 5,
      crosshairMarkerBorderColor: lineColor,
      crosshairMarkerBackgroundColor: "#fff",
      priceFormat: {
        type: "custom",
        formatter: (v: number) =>
          v >= 1e6 ? (v / 1e6).toFixed(2) + "M€" : (v / 1000).toFixed(0) + "k€",
        minMove: 1,
      },
    });

    const primaryData = Array.from({ length: years + 1 }, (_, i) => ({
      time: toTime(i) as unknown as string,
      value: fv(capital, totalRet, i, dcaOn ? dca : 0),
    }));
    areaSeries.setData(primaryData);

    // Secondary dashed line when DCA is on
    if (dcaOn) {
      const lineSeries = chart.addSeries(LineSeries, {
        color: "rgba(124,58,237,0.45)",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        priceFormat: {
          type: "custom",
          formatter: (v: number) =>
            v >= 1e6
              ? (v / 1e6).toFixed(2) + "M€"
              : (v / 1000).toFixed(0) + "k€",
          minMove: 1,
        },
      });
      lineSeries.setData(
        Array.from({ length: years + 1 }, (_, i) => ({
          time: toTime(i) as unknown as string,
          value: fv(capital, totalRet, i, 0),
        })),
      );
    }

    chart.timeScale().fitContent();

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth });
      chart.timeScale().fitContent();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, [capital, totalRet, years, dca]);

  const eMain = fv(capital, totalRet, years, 0);
  const eDca = fv(capital, totalRet, years, dca);

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full" />
      <div className="flex gap-5 mt-2 flex-wrap text-sm">
        {dcaOn ? (
          <>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-4 h-0.5 bg-emerald-600 rounded" />
              Con DCA {dca}€/mes →{" "}
              <strong className="text-emerald-600">{fmtS(eDca)}</strong> en{" "}
              {years}A
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-4 border-t border-dashed border-violet-400" />
              Solo capital →{" "}
              <strong className="text-violet-500">{fmtS(eMain)}</strong>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-4 h-0.5 bg-violet-600 rounded" />
            Tu cartera ({totalRet.toFixed(2)}%/año) →{" "}
            <strong className="text-violet-600">{fmtS(eMain)}</strong> en{" "}
            {years}A
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Liquidity Bar ─── */
function LiquidityBar({ weights }: { weights: number[] }) {
  // weights[0] = Monetarios (< 48h), weights[1] = RF Corto (< 1 semana)
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const pctMon = (weights[0] / total) * 100;
  const pctRfC = (weights[1] / total) * 100;
  const pctLong = Math.max(0, 100 - pctMon - pctRfC);
  const pctAvail = pctMon + pctRfC;

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            ANÁLISIS DE DISPONIBILIDAD
          </p>
          <h3 className="text-lg font-bold text-slate-900">
            Semáforo de liquidez de la cartera
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            TOTAL DISPONIBLE &lt; 1 SEMANA:{" "}
          </span>
          <span className="ml-1 text-lg font-bold text-emerald-600">
            {pctAvail.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Segmented bar */}
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex mb-5">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${pctMon}%` }}
          title="< 48h"
        />
        <div
          className="h-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${pctRfC}%` }}
          title="< 1 semana"
        />
        <div
          className="h-full bg-slate-300 transition-all duration-500"
          style={{ width: `${pctLong}%` }}
          title="Largo plazo"
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            dot: "bg-emerald-500",
            title: "Inmediata (< 48h)",
            pct: pctMon,
            desc: "Fondos Monetarios",
          },
          {
            dot: "bg-yellow-400",
            title: "Rápida (< 1 semana)",
            pct: pctRfC,
            desc: "RF Corto Plazo",
          },
          {
            dot: "bg-slate-300",
            title: "Largo Plazo (5+ años)",
            pct: pctLong,
            desc: "RF Medio, RV y Alt.",
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <div
              className={`w-3 h-3 rounded-full mt-0.5 shrink-0 ${item.dot}`}
            />
            <div>
              <p className="text-[10px] font-bold text-slate-900 uppercase">
                {item.title}
              </p>
              <p className="text-xs text-slate-500">
                {item.pct.toFixed(0)}% – {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function Calculator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [capital, setCapital] = useState(204000);
  const [years, setYears] = useState(20);
  const [dcaOn, setDcaOn] = useState(true);
  const [dcaAmt, setDcaAmt] = useState(500);
  const [inflation, setInflation] = useState(2.5);
  const [weights, setWeights] = useState<number[]>(() =>
    CATS.map((c) => c.peso),
  );
  const [rets, setRets] = useState<number[]>(() => CATS.map((c) => c.ret));

  const totalW = weights.reduce((a, b) => a + b, 0);
  const totalRet = CATS.reduce(
    (s, _c, i) => s + (weights[i] / 100) * rets[i],
    0,
  );
  const dca = dcaOn ? dcaAmt : 0;
  const p = profile(totalRet);
  const totalRentab = CATS.reduce(
    (s, _c, i) => s + capital * (weights[i] / 100) * (rets[i] / 100),
    0,
  );

  // Future values
  const endValDca = fv(capital, totalRet, years, dca);
  const endValNoDca = fv(capital, totalRet, years, 0);
  const realDivisor = Math.pow(1 + inflation / 100, years);
  const endValDcaReal = endValDca / realDivisor;
  const endValNoDcaReal = endValNoDca / realDivisor;

  // Annual rent
  const rentAnualDca = fv(capital, totalRet, 1, dca) - capital;
  const rentAnualNoDca = totalRentab;

  // Capital contributed
  const capAportadoDca = capital + dcaAmt * 12 * years;
  const capAportadoNoDca = capital;

  const setW = (i: number, v: number) =>
    setWeights((prev) => {
      const n = [...prev];
      n[i] = v;
      return n;
    });
  const setR = (i: number, v: number) =>
    setRets((prev) => {
      const n = [...prev];
      n[i] = v;
      return n;
    });

  return (
    <section
      id="calculadora"
      className="bg-slate-50 px-6 md:px-14 py-20 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-bold tracking-[0.09em] uppercase text-blue-600 mb-2.5">
            PASO 2 – CALCULA TU CARTERA
          </p>
          <h2 className="font-serif text-[clamp(28px,3vw,44px)] text-navy leading-tight mb-2.5">
            Diseña tu{" "}
            <em className="not-italic text-blue-600">cartera ideal</em>
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl leading-relaxed">
            Introduce tu capital, ajusta los pesos de cada categoría y activa el
            DCA si quieres aportar mensualmente.
          </p>
        </motion.div>

        {/* ── Top inputs 4-card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Capital */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Capital Inicial
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xl">€</span>
              <input
                type="number"
                value={capital}
                min={0}
                step={1000}
                onChange={(e) => setCapital(Math.max(1, +e.target.value))}
                className="w-full text-2xl font-bold border-none p-0 focus:ring-0 outline-none font-sans text-navy bg-transparent"
              />
            </div>
          </div>

          {/* DCA */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Aportación DCA
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-400 font-bold">
                <input
                  type="checkbox"
                  checked={dcaOn}
                  onChange={(e) => setDcaOn(e.target.checked)}
                  className="accent-blue-600 w-3.5 h-3.5"
                />
                Activar
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xl">€</span>
              <input
                type="number"
                value={dcaAmt}
                min={0}
                step={50}
                disabled={!dcaOn}
                onChange={(e) => setDcaAmt(+e.target.value)}
                className="w-full text-2xl font-bold border-none p-0 focus:ring-0 outline-none font-sans text-navy bg-transparent disabled:opacity-40"
              />
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              Mensual (Dollar Cost Averaging)
            </p>
          </div>

          {/* Plazo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Plazo
              </label>
              <span className="text-2xl font-bold text-navy">{years} años</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(+e.target.value)}
              className="w-full h-1.5 accent-navy rounded-lg cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
              <span>1 año</span>
              <span>40 años</span>
            </div>
          </div>

          {/* Inflación */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                Inflación Esperada
              </label>
              <span className="text-2xl font-bold text-blue-600">
                {inflation.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={inflation}
              onChange={(e) => setInflation(+e.target.value)}
              className="w-full h-1.5 accent-blue-600 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-[9px] text-blue-400 font-bold uppercase tracking-tighter">
              <span>0%</span>
              <span>10%</span>
            </div>
          </div>
        </div>

        {/* ── Growth Chart full width ── */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Proyección de Crecimiento · Nominal
              {inflation > 0 && ` vs Real (inflac. ${inflation.toFixed(1)}%)`}
            </div>
            {/* {dcaOn && (
              <span className="text-xs font-bold bg-violet-50 text-violet-700 px-4 py-1.5 rounded-full border border-violet-200">DCA ACTIVADO</span>
            )} */}
          </div>
          <GrowthChart
            capital={capital}
            totalRet={totalRet}
            years={years}
            dca={dca}
          />
        </div>

        {/* ── 6 Summary metric badge cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              Rent. Anual DCA
            </p>
            <p className="text-base font-bold text-slate-900 leading-tight">
              {dcaOn ? (
                fmt(rentAnualDca)
              ) : (
                <span className="text-slate-300">–</span>
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              Cap. Aportado DCA
            </p>
            <p className="text-base font-bold text-slate-900 leading-tight">
              {dcaOn ? (
                fmt(capAportadoDca)
              ) : (
                <span className="text-slate-300">–</span>
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              Cap. Aportado s/DCA
            </p>
            <p className="text-base font-bold text-slate-900 leading-tight">
              {fmt(capAportadoNoDca)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              Rent. Anual s/DCA
            </p>
            <p className="text-base font-bold text-slate-900 leading-tight">
              {fmt(rentAnualNoDca)}
            </p>
          </div>
          <div className="bg-blue-600 p-4 rounded-xl shadow-sm text-white">
            <p className="text-[9px] font-bold text-blue-100 uppercase mb-1">
              Patr. {years}A DCA
            </p>
            {dcaOn ? (
              <div className="flex flex-col">
                <span className="text-base font-bold leading-tight">
                  {fmtS(endValDca)}{" "}
                  <span className="text-[8px] font-normal opacity-70 uppercase">
                    Nom
                  </span>
                </span>
                <span className="text-xs font-semibold text-blue-200 leading-tight">
                  {fmtS(endValDcaReal)}{" "}
                  <span className="text-[8px] font-normal opacity-70 uppercase">
                    Real
                  </span>
                </span>
              </div>
            ) : (
              <span className="text-white/40 text-sm">–</span>
            )}
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              Patr. {years}A s/DCA
            </p>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-tight">
                {fmtS(endValNoDca)}{" "}
                <span className="text-[8px] font-normal text-slate-400 uppercase">
                  Nom
                </span>
              </span>
              <span className="text-xs font-semibold text-slate-500 leading-tight">
                {fmtS(endValNoDcaReal)}{" "}
                <span className="text-[8px] font-normal text-slate-400 uppercase">
                  Real
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Allocation Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
          <div className="hidden md:grid grid-cols-[1.8fr_1fr_1.4fr_1fr_1.3fr_1.2fr] px-6 py-3.5 bg-slate-50 border-b border-slate-200 gap-2">
            {[
              "Categoría",
              "Retorno esp.",
              "Peso %",
              "Contribución",
              "Capital",
              "Rentab. €",
            ].map((h, i) => (
              <div
                key={h}
                className={`text-[11px] font-bold text-slate-500 uppercase tracking-widest ${i > 1 ? "text-right" : ""}`}
              >
                {h}
              </div>
            ))}
          </div>
          {CATS.map((c, i) => {
            const capitalCat = capital * (weights[i] / 100);
            const rentabEur = capitalCat * (rets[i] / 100);
            const contrib = (weights[i] / 100) * rets[i];
            return (
              <div
                key={c.id}
                className={`grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1.4fr_1fr_1.3fr_1.2fr] px-6 py-4 gap-2 border-b border-slate-50 items-center ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: c.color }}
                  />
                  <span className="text-base font-semibold text-navy">
                    {c.label}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <input
                    type="number"
                    value={rets[i]}
                    min={0}
                    max={30}
                    step={0.1}
                    onChange={(e) => setR(i, parseFloat(e.target.value) || 0)}
                    className="w-16 text-right border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold outline-none font-sans"
                    style={{ color: c.color }}
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={weights[i]}
                    onChange={(e) => setW(i, +e.target.value)}
                    className="w-16 h-2"
                    style={{ accentColor: c.color }}
                  />
                  <input
                    type="number"
                    value={weights[i]}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(e) => setW(i, +e.target.value)}
                    className="w-12 text-center border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-navy outline-none font-sans"
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <div className="text-right text-sm font-semibold text-emerald-600">
                  {fmtP(contrib)}
                </div>
                <div className="text-right text-sm font-medium text-slate-600">
                  {fmt(capitalCat)}
                </div>
                <div
                  className="text-right text-base font-bold"
                  style={{ color: c.color }}
                >
                  {fmt(rentabEur)}
                </div>
              </div>
            );
          })}
          {Math.abs(totalW - 100) > 0.1 && (
            <div className="px-6 py-3 bg-red-50 text-red-700 text-sm font-semibold border-t border-red-100">
              ⚠ Los pesos suman {totalW.toFixed(1)}% – deben sumar 100%
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1.4fr_1fr_1.3fr_1.2fr] px-6 py-4 gap-2 bg-slate-50 border-t-2 border-slate-200 items-center">
            <div className="text-base font-bold text-navy">TOTAL CARTERA</div>
            <div />
            <div className="text-right text-lg font-bold text-navy">
              {fmtP(totalW)}
            </div>
            <div className="text-right text-lg font-bold text-emerald-600">
              {fmtP(totalRet)}
            </div>
            <div className="text-right text-lg font-bold text-navy">
              {fmt(capital)}
            </div>
            <div className="text-right text-xl font-bold text-violet-700">
              {fmt(totalRentab)}
            </div>
          </div>
        </div>

        {/* ── Liquidity Traffic Light ── */}
        <LiquidityBar weights={weights} />

        {/* ── Investor Profile (bottom, per Stitch) ── */}
        <div
          className={`rounded-2xl border-2 p-7 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-400 ${p.bg} ${p.border}`}
        >
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Tu Perfil de Inversor
            </p>
            <div className={`font-serif text-2xl mb-2 ${p.color}`}>
              {p.name}
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {p.badges.map((b) => (
                <span
                  key={b}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full ${p.bCls}`}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center md:text-right">
            <span
              className={`block font-serif text-[52px] leading-none ${p.color}`}
            >
              {fmtP(totalRet)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Retorno esp. nominal
            </span>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 leading-relaxed">
          <strong>Aviso:</strong> Los retornos son estimaciones históricas. Las
          rentabilidades pasadas no garantizan rentabilidades futuras. El ajuste
          de inflación es una estimación basada en el IPC esperado.
        </div>
      </div>
    </section>
  );
}
