import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { CATS } from '../data';

/* ─── helpers ─── */
const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' €';
const fmtS = (v: number) =>
  v >= 1e6 ? (v / 1e6).toFixed(2) + 'M€' : (v / 1000).toFixed(0) + 'k€';
const fmtP = (n: number) => n.toFixed(2) + '%';

function fv(capital: number, rate: number, years: number, dca: number) {
  const r = rate / 100;
  const cg = capital * Math.pow(1 + r, years);
  if (!dca || !r) return cg + dca * 12 * years;
  const rm = r / 12, m = years * 12;
  return cg + dca * ((Math.pow(1 + rm, m) - 1) / rm);
}

function profile(ret: number) {
  if (ret < 3)   return { name: 'Perfil Conservador',         color: 'text-teal-700', bg: 'bg-emerald-50', border: 'border-emerald-200', badges: ['Baja volatilidad','Capital seguro','Liquidez alta'],       bCls: 'bg-emerald-100 text-emerald-800' };
  if (ret < 4.5) return { name: 'Perfil Moderado-Conservador',color: 'text-teal-700', bg: 'bg-emerald-50', border: 'border-green-300',   badges: ['Riesgo controlado','RF dominante','Horizonte 3–5A'],       bCls: 'bg-emerald-100 text-emerald-800' };
  if (ret < 6)   return { name: 'Perfil Moderado',             color: 'text-amber-700',bg: 'bg-amber-50',  border: 'border-amber-200',   badges: ['Equilibrio RF/RV','Volatilidad media','Largo plazo'],       bCls: 'bg-amber-100 text-amber-800' };
  if (ret < 8)   return { name: 'Perfil Moderado-Agresivo',    color: 'text-red-700',  bg: 'bg-red-50',    border: 'border-red-200',     badges: ['RV dominante','Alta rentabilidad','Horizonte 7–15A'],       bCls: 'bg-red-100 text-red-800' };
  return           { name: 'Perfil Agresivo / Largo Plazo',    color: 'text-red-700',  bg: 'bg-red-50',    border: 'border-red-300',     badges: ['Máximo potencial','Alta volatilidad','Solo 10+ años'],       bCls: 'bg-red-100 text-red-800' };
}

/* ─── Donut ─── */
function DonutChart({ weights, rets, totalRet }: { weights: number[]; rets: number[]; totalRet: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    const W = c.width, H = c.height, cx = W/2, cy = H/2, R = 94, r = 54;
    ctx.clearRect(0, 0, W, H);
    const tot = weights.reduce((a, b) => a + b, 0) || 1;
    let ang = -Math.PI / 2;
    CATS.forEach((cat, i) => {
      const sl = (weights[i] / tot) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang, ang + sl); ctx.closePath();
      ctx.fillStyle = cat.color; ctx.fill(); ang += sl;
    });
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = '#1B2B5B'; ctx.font = "bold 13px 'DM Sans',sans-serif";
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(totalRet.toFixed(2) + '%', cx, cy - 7);
    ctx.font = "10px 'DM Sans',sans-serif"; ctx.fillStyle = '#94A3B8';
    ctx.fillText('retorno esp.', cx, cy + 9);
  }, [weights, rets, totalRet]);

  return (
    <div>
      <canvas ref={ref} width={236} height={236} className="block mx-auto" />
      <div className="mt-3 flex flex-col gap-1.5">
        {CATS.map((c, i) => (
          <div key={c.id} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
              <span className="text-sm text-slate-700">{c.label}</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: c.color }}>{weights[i].toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Growth chart ─── */
function GrowthChart({ capital, totalRet, years, dca }: { capital: number; totalRet: number; years: number; dca: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const dcaOn = dca > 0;

  useEffect(() => {
    const canvas = ref.current, container = wrap.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const dW = container.clientWidth - 8, dH = 220;
    canvas.style.width = dW + 'px'; canvas.style.height = dH + 'px';
    canvas.width = dW * dpr; canvas.height = dH * dpr;
    const ctx = canvas.getContext('2d')!; ctx.scale(dpr, dpr);
    const pts = Array.from({ length: years + 1 }, (_, i) => ({
      main: fv(capital, totalRet, i, 0),
      withDca: fv(capital, totalRet, i, dca),
      conserv: fv(capital, 3, i, dcaOn ? dca : 0),
    }));
    const maxVal = Math.max(...pts.map(p => dcaOn ? p.withDca : p.main)) * 1.05;
    const minVal = capital * 0.85;
    const pad = { top: 14, right: 20, bottom: 30, left: 72 };
    const cw = dW - pad.left - pad.right, ch = dH - pad.top - pad.bottom;
    const xP = (i: number) => pad.left + (i / years) * cw;
    const yP = (v: number) => pad.top + ch - Math.max(0, Math.min(1, (v - minVal) / (maxVal - minVal))) * ch;
    ctx.clearRect(0, 0, dW, dH);
    ctx.strokeStyle = '#F1F5F9'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const y = pad.top + (i/4)*ch; ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left+cw, y); ctx.stroke(); }
    const step = years <= 10 ? 1 : years <= 20 ? 5 : 10;
    ctx.fillStyle = '#CBD5E1'; ctx.font = "10px 'DM Sans',sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let i = 0; i <= years; i += step) ctx.fillText('A'+i, xP(i), pad.top+ch+5);
    // Conservative
    ctx.strokeStyle = '#CBD5E1'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
    ctx.beginPath(); pts.forEach((p, i) => i===0 ? ctx.moveTo(xP(i),yP(p.conserv)) : ctx.lineTo(xP(i),yP(p.conserv))); ctx.stroke(); ctx.setLineDash([]);
    // Main
    ctx.fillStyle = 'rgba(124,58,237,0.07)';
    ctx.beginPath(); pts.forEach((p, i) => i===0 ? ctx.moveTo(xP(i),yP(p.main)) : ctx.lineTo(xP(i),yP(p.main)));
    ctx.lineTo(xP(years), pad.top+ch); ctx.lineTo(xP(0), pad.top+ch); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#7C3AED'; ctx.lineWidth = dcaOn ? 1.5 : 2.5; ctx.setLineDash(dcaOn ? [5,3] : []);
    ctx.beginPath(); pts.forEach((p, i) => i===0 ? ctx.moveTo(xP(i),yP(p.main)) : ctx.lineTo(xP(i),yP(p.main))); ctx.stroke(); ctx.setLineDash([]);
    // DCA
    if (dcaOn) {
      ctx.fillStyle = 'rgba(5,150,105,0.08)';
      ctx.beginPath(); pts.forEach((p, i) => i===0 ? ctx.moveTo(xP(i),yP(p.withDca)) : ctx.lineTo(xP(i),yP(p.withDca)));
      ctx.lineTo(xP(years), pad.top+ch); ctx.lineTo(xP(0), pad.top+ch); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#059669'; ctx.lineWidth = 2.5;
      ctx.beginPath(); pts.forEach((p, i) => i===0 ? ctx.moveTo(xP(i),yP(p.withDca)) : ctx.lineTo(xP(i),yP(p.withDca))); ctx.stroke();
    }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const v = minVal + (i/4)*(maxVal - minVal);
      ctx.fillStyle = '#94A3B8'; ctx.font = "10px 'DM Sans',sans-serif";
      ctx.fillText((v >= 1e6 ? (v/1e6).toFixed(1)+'M' : (v/1000).toFixed(0)+'k')+'€', pad.left-5, pad.top+ch-(i/4)*ch);
    }
  }, [capital, totalRet, years, dca]);

  const eMain = fv(capital, totalRet, years, 0);
  const eDca  = fv(capital, totalRet, years, dca);
  const eC    = fv(capital, 3, years, dcaOn ? dca : 0);

  return (
    <div ref={wrap} className="w-full">
      <canvas ref={ref} className="block w-full" />
      <div className="flex gap-4 mt-3 flex-wrap text-sm">
        {dcaOn ? (
          <>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-5 h-1 bg-emerald-600 rounded" />
              Con DCA {dca}€/mes → <strong className="text-emerald-600">{fmtS(eDca)}</strong> en {years}A
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-5 h-0.5 bg-violet-600 rounded border-t border-dashed border-violet-600" />
              Solo capital → <strong className="text-violet-600">{fmtS(eMain)}</strong>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-5 h-1 bg-violet-600 rounded" />
            Tu cartera ({totalRet.toFixed(2)}%/año) → <strong className="text-violet-600">{fmtS(eMain)}</strong> en {years}A
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-5 h-0.5 bg-slate-300 rounded" />
          Ahorro 3%/A → <strong>{fmtS(eC)}</strong>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function Calculator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const [capital, setCapital] = useState(204000);
  const [years,   setYears]   = useState(20);
  const [dcaOn,   setDcaOn]   = useState(false);
  const [dcaAmt,  setDcaAmt]  = useState(500);
  const [weights, setWeights] = useState(() => CATS.map(c => c.peso));
  const [rets,    setRets]    = useState(() => CATS.map(c => c.ret));

  const totalW   = weights.reduce((a, b) => a + b, 0);
  const totalRet = CATS.reduce((s, c, i) => s + (weights[i]/100) * rets[i], 0);
  const dca      = dcaOn ? dcaAmt : 0;
  const p        = profile(totalRet);
  const totalRentab = CATS.reduce((s, c, i) => s + capital * (weights[i]/100) * (rets[i]/100), 0);
  const endMain  = fv(capital, totalRet, years, 0);
  const endDca   = fv(capital, totalRet, years, dca);

  const setW = (i: number, v: number) => setWeights(prev => { const n = [...prev]; n[i] = v; return n; });
  const setR = (i: number, v: number) => setRets(prev => { const n = [...prev]; n[i] = v; return n; });

  const summaryCards = [
    { label: 'Capital inicial',   val: fmt(capital),      cls: 'text-navy',          bg: 'bg-blue-50',    border: 'border-blue-200' },
    { label: 'Retorno esperado',  val: fmtP(totalRet),    cls: 'text-emerald-600',   bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Rentab. anual €',   val: fmt(totalRentab),  cls: 'text-violet-700',    bg: 'bg-violet-50',  border: 'border-violet-200' },
    { label: `En ${years} años`,  val: fmtS(endMain),     cls: 'text-violet-700',    bg: 'bg-violet-50',  border: 'border-violet-200' },
    ...(dcaOn ? [{ label: `Con DCA ${dcaAmt}€/mes`, val: fmtS(endDca), cls: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }] : []),
    { label: 'Pesos totales', val: fmtP(totalW), cls: Math.abs(totalW-100)<0.1 ? 'text-amber-700' : 'text-red-700', bg: Math.abs(totalW-100)<0.1 ? 'bg-amber-50' : 'bg-red-50', border: Math.abs(totalW-100)<0.1 ? 'border-amber-200' : 'border-red-200' },
  ];

  return (
    <section id="calculadora" className="bg-slate-50 px-14 py-20 border-t border-slate-200">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <p className="text-xs font-bold tracking-[0.09em] uppercase text-blue-600 mb-2.5">PASO 2 — CALCULA TU CARTERA</p>
          <h2 className="font-serif text-[clamp(28px,3vw,44px)] text-navy leading-tight mb-2.5">
            Diseña tu <em className="not-italic text-blue-600">cartera ideal</em>
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-3xl leading-relaxed">
            Introduce tu capital, ajusta los pesos de cada categoría y activa el DCA si quieres aportar mensualmente.
          </p>
        </motion.div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Capital */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Capital inicial</div>
            <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <span className="px-4 py-3 text-base font-medium text-slate-400 border-r border-slate-200 bg-slate-100">€</span>
              <input type="number" value={capital} min={0} step={1000}
                onChange={e => setCapital(Math.max(1, +e.target.value))}
                className="flex-1 bg-transparent px-4 py-3 text-xl font-bold text-navy outline-none font-sans"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">Capital invertido desde el primer día</p>
          </div>

          {/* DCA */}
          <div className="relative bg-white rounded-2xl border border-violet-200 p-5">
            <div className="absolute top-0 left-5 right-5 h-0.5 bg-violet-500 rounded-b-sm" />
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-violet-600 tracking-widest uppercase">Aportación DCA</div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={dcaOn} onChange={e => setDcaOn(e.target.checked)}
                  className="accent-violet-600 w-3.5 h-3.5" />
                <span className="text-sm text-slate-400">Activar</span>
              </label>
            </div>
            <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <span className="px-4 py-3 text-base font-medium text-slate-400 border-r border-slate-200 bg-slate-100">€</span>
              <input type="number" value={dcaAmt} min={0} step={50}
                onChange={e => setDcaAmt(+e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-xl font-bold text-violet-600 outline-none font-sans"
              />
              <span className="px-4 py-3 text-xs font-medium text-slate-400 border-l border-slate-200 bg-slate-100 whitespace-nowrap">/ mes</span>
            </div>
          </div>

          {/* Years */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Horizonte temporal</div>
            <div className="flex items-center gap-4 mb-1.5">
              <input type="range" min={1} max={40} step={1} value={years}
                onChange={e => setYears(+e.target.value)}
                className="flex-1 accent-navy h-2.5"
              />
              <span className="text-2xl font-bold text-navy font-sans min-w-[88px] text-right">{years} años</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>1 año</span><span>40 años</span>
            </div>
          </div>
        </div>

        {/* Profile */}
        <motion.div
          className={`rounded-2xl border-2 p-7 mb-6 transition-all duration-400 ${p.bg} ${p.border}`}
        >
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">Tu perfil de inversor</div>
              <div className={`font-serif text-4xl mb-2 ${p.color}`}>{p.name}</div>
              <div className="flex gap-2 flex-wrap mt-3">
                {p.badges.map(b => (
                  <span key={b} className={`text-xs font-semibold px-3.5 py-1.5 rounded-full ${p.bCls}`}>{b}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-serif text-[58px] leading-none ${p.color}`}>{fmtP(totalRet)}</div>
              <div className={`text-xs font-semibold uppercase tracking-widest mt-1 ${p.color}`}>retorno esp.</div>
            </div>
          </div>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {summaryCards.map(s => (
            <div key={s.label} className={`rounded-xl border px-5 py-4 ${s.bg} ${s.border}`}>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
              <div className={`font-serif text-xl ${s.cls}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[1.8fr_1fr_1.4fr_1fr_1.3fr_1.2fr] px-6 py-3.5 bg-slate-50 border-b border-slate-200 gap-2">
            {['Categoría','Retorno esp.','Peso %','Contribución','Capital','Rentab. €'].map((h, i) => (
              <div key={h} className={`text-[11px] font-bold text-slate-500 uppercase tracking-widest ${i > 1 ? 'text-right' : ''}`}>{h}</div>
            ))}
          </div>
          {CATS.map((c, i) => {
            const capitalCat = capital * (weights[i]/100);
            const rentabEur  = capitalCat * (rets[i]/100);
            const contrib    = (weights[i]/100) * rets[i];
            return (
              <div key={c.id} className={`grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1.4fr_1fr_1.3fr_1.2fr] px-6 py-4 gap-2 border-b border-slate-50 items-center ${i%2===1 ? 'bg-slate-50/60' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-base font-semibold text-navy">{c.label}</span>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <input type="number" value={rets[i]} min={0} max={30} step={0.1}
                    onChange={e => setR(i, parseFloat(e.target.value)||0)}
                    className="w-16 text-right border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold outline-none font-sans"
                    style={{ color: c.color }}
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <input type="range" min={0} max={100} step={1} value={weights[i]}
                    onChange={e => setW(i, +e.target.value)}
                    className="w-16 h-2" style={{ accentColor: c.color }}
                  />
                  <input type="number" value={weights[i]} min={0} max={100} step={1}
                    onChange={e => setW(i, +e.target.value)}
                    className="w-12 text-center border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-navy outline-none font-sans"
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <div className="text-right text-sm font-semibold text-emerald-600">{fmtP(contrib)}</div>
                <div className="text-right text-sm font-medium text-slate-600">{fmt(capitalCat)}</div>
                <div className="text-right text-base font-bold" style={{ color: c.color }}>{fmt(rentabEur)}</div>
              </div>
            );
          })}
          {Math.abs(totalW - 100) > 0.1 && (
            <div className="px-6 py-3 bg-red-50 text-red-700 text-sm font-semibold border-t border-red-100">
              ⚠ Los pesos suman {totalW.toFixed(1)}% — deben sumar 100%
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1.4fr_1fr_1.3fr_1.2fr] px-6 py-4 gap-2 bg-slate-50 border-t-2 border-slate-200 items-center">
            <div className="text-base font-bold text-navy">TOTAL CARTERA</div>
            <div />
            <div className="text-right text-lg font-bold text-navy">{fmtP(totalW)}</div>
            <div className="text-right text-lg font-bold text-emerald-600">{fmtP(totalRet)}</div>
            <div className="text-right text-lg font-bold text-navy">{fmt(capital)}</div>
            <div className="text-right text-xl font-bold text-violet-700">{fmt(totalRentab)}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4">Distribución</div>
            <DonutChart weights={weights} rets={rets} totalRet={totalRet} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Proyección de crecimiento</div>
              {dcaOn && <span className="text-xs font-bold bg-violet-50 text-violet-700 px-4 py-1.5 rounded-full border border-violet-200">DCA ACTIVADO</span>}
            </div>
            <GrowthChart capital={capital} totalRet={totalRet} years={years} dca={dca} />
          </div>
        </div>

        <div className="mt-4 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 leading-relaxed">
          <strong>Aviso:</strong> Los retornos son estimaciones históricas. Las rentabilidades pasadas no garantizan rentabilidades futuras. Simulador meramente informativo.
        </div>
      </div>
    </section>
  );
}
