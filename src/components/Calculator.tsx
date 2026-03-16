import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import { CATS } from '../data';

type CatWeights = Record<string, number>;
type CatRets = Record<string, number>;

function fmtEur(n: number) {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' €';
}
function fmtShort(v: number) {
  return v >= 1e6 ? (v / 1e6).toFixed(2) + 'M€' : (v / 1000).toFixed(0) + 'k€';
}
function fmtPct(n: number) { return n.toFixed(2) + '%'; }

function calcFV(capital: number, annualRatePct: number, years: number, monthlyDCA: number) {
  const r = annualRatePct / 100;
  const cg = capital * Math.pow(1 + r, years);
  if (monthlyDCA === 0 || r === 0) return cg + monthlyDCA * 12 * years;
  const rm = r / 12;
  const months = years * 12;
  const dcaFV = monthlyDCA * ((Math.pow(1 + rm, months) - 1) / rm);
  return cg + dcaFV;
}

function getProfile(ret: number) {
  if (ret < 3) return { name: 'Perfil Conservador', color: '#0D7A5F', bg: '#F0FDF4', border: '#A7F3D0', desc: 'Tu cartera está orientada a preservar el capital con mínima volatilidad. Ideal para inversores con aversión al riesgo o horizonte corto (<3 años).', badges: ['Baja volatilidad', 'Capital seguro', 'Liquidez alta'], badgeColor: '#166534', badgeBg: '#D1FAE5' };
  if (ret < 4.5) return { name: 'Perfil Moderado-Conservador', color: '#0D7A5F', bg: '#F0FDF4', border: '#6EE7B7', desc: 'Cartera equilibrada con énfasis en renta fija. Acepta pequeñas oscilaciones a cambio de algo más de rentabilidad.', badges: ['Riesgo controlado', 'RF dominante', 'Horizonte 3–5A'], badgeColor: '#166534', badgeBg: '#D1FAE5' };
  if (ret < 6) return { name: 'Perfil Moderado', color: '#B45309', bg: '#FFFBEB', border: '#FDE68A', desc: 'Cartera equilibrada entre protección y crecimiento. La mezcla de renta fija con algo de bolsa y alternativos es la más habitual para el largo plazo.', badges: ['Equilibrio RF/RV', 'Volatilidad media', 'Largo plazo'], badgeColor: '#92400E', badgeBg: '#FDE68A' };
  if (ret < 8) return { name: 'Perfil Moderado-Agresivo', color: '#C53030', bg: '#FFF5F5', border: '#FECACA', desc: 'Cartera orientada al crecimiento con peso significativo en renta variable. El horizonte largo (7+ años) es fundamental.', badges: ['RV dominante', 'Alta rentabilidad', 'Horizonte 7–15A'], badgeColor: '#991B1B', badgeBg: '#FECACA' };
  return { name: 'Perfil Agresivo / Largo Plazo', color: '#C53030', bg: '#FFF5F5', border: '#FCA5A5', desc: 'Cartera con máximo peso en renta variable y alto potencial de crecimiento. Puede experimentar caídas del 30–40% en recesiones.', badges: ['Máximo potencial', 'Alta volatilidad', 'Solo 10+ años'], badgeColor: '#991B1B', badgeBg: '#FECACA' };
}

function DonutChart({ weights, totalRet }: { weights: CatWeights; totalRet: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2, R = 96, r = 54;
    ctx.clearRect(0, 0, W, H);
    const vals = CATS.map(c => Math.max(0, weights[c.id] ?? c.peso));
    const tot = vals.reduce((a, b) => a + b, 0) || 1;
    let ang = -Math.PI / 2;
    CATS.forEach((c, i) => {
      const sl = (vals[i] / tot) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang, ang + sl); ctx.closePath();
      ctx.fillStyle = c.color; ctx.fill();
      ang += sl;
    });
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = '#1B2B5B'; ctx.font = "bold 13px 'DM Sans',sans-serif";
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(totalRet.toFixed(2) + '%', cx, cy - 7);
    ctx.font = "10px 'DM Sans',sans-serif"; ctx.fillStyle = '#94A3B8';
    ctx.fillText('retorno esp.', cx, cy + 9);
  }, [weights, totalRet]);

  return (
    <div>
      <canvas ref={canvasRef} width={236} height={236} style={{ display: 'block', margin: '0 auto' }} />
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {CATS.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: c.color }} />
              <span style={{ fontSize: '15px', color: '#374151' }}>{c.label}</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600, color: c.color }}>{(weights[c.id] ?? c.peso).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthChart({ capital, totalRet, years, dca }: { capital: number; totalRet: number; years: number; dca: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const dW = container.clientWidth - 8;
    const dH = 220;
    canvas.style.width = dW + 'px'; canvas.style.height = dH + 'px';
    canvas.width = dW * dpr; canvas.height = dH * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const W = dW, H = dH;
    const dcaOn = dca > 0;
    const pts = Array.from({ length: years + 1 }, (_, i) => ({
      i, main: calcFV(capital, totalRet, i, 0),
      withDca: calcFV(capital, totalRet, i, dca),
      conserv: calcFV(capital, 3, i, 0),
      conservDca: calcFV(capital, 3, i, dca),
    }));
    const endMain = pts[years].main;
    const endDca = pts[years].withDca;
    const topLine = dcaOn ? endDca : endMain;
    const maxVal = Math.max(topLine, dcaOn ? pts[years].conservDca : pts[years].conserv) * 1.05;
    const minVal = capital * 0.85;
    const pad = { top: 14, right: 20, bottom: 30, left: 72 };
    const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
    const xP = (i: number) => pad.left + (i / years) * cw;
    const yP = (v: number) => pad.top + ch - Math.max(0, Math.min(1, (v - minVal) / (maxVal - minVal))) * ch;
    ctx.clearRect(0, 0, W, H);
    // Grid lines
    ctx.strokeStyle = '#F1F5F9'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const y = pad.top + (i / 4) * ch; ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke(); }
    // X labels
    const step = years <= 10 ? 1 : years <= 20 ? 5 : 10;
    ctx.fillStyle = '#CBD5E1'; ctx.font = "10px 'DM Sans',sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let i = 0; i <= years; i += step) { ctx.fillText('A' + i, xP(i), pad.top + ch + 5); }
    // Conservative line
    const cPts = dcaOn ? pts.map(p => p.conservDca) : pts.map(p => p.conserv);
    ctx.strokeStyle = '#CBD5E1'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.beginPath(); cPts.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
    ctx.stroke(); ctx.setLineDash([]);
    // Main line fill
    const mPts = pts.map(p => p.main);
    ctx.fillStyle = 'rgba(124,58,237,0.07)';
    ctx.beginPath(); mPts.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
    ctx.lineTo(xP(years), pad.top + ch); ctx.lineTo(xP(0), pad.top + ch); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#7C3AED'; ctx.lineWidth = dcaOn ? 1.5 : 2.5; ctx.setLineDash(dcaOn ? [5, 3] : []);
    ctx.beginPath(); mPts.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
    ctx.stroke(); ctx.setLineDash([]);
    // DCA line
    if (dcaOn) {
      const dPts = pts.map(p => p.withDca);
      ctx.fillStyle = 'rgba(5,150,105,0.08)';
      ctx.beginPath(); dPts.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
      ctx.lineTo(xP(years), pad.top + ch); ctx.lineTo(xP(0), pad.top + ch); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#059669'; ctx.lineWidth = 2.5;
      ctx.beginPath(); dPts.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
      ctx.stroke();
    }
    // Y axis labels
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const v = minVal + (i / 4) * (maxVal - minVal);
      ctx.fillStyle = '#94A3B8'; ctx.font = "10px 'DM Sans',sans-serif";
      ctx.fillText((v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : (v / 1000).toFixed(0) + 'k') + '€', pad.left - 5, pad.top + ch - (i / 4) * ch);
    }
  }, [capital, totalRet, years, dca]);

  const eMain = calcFV(capital, totalRet, years, 0);
  const eDca = calcFV(capital, totalRet, years, dca);
  const eC = calcFV(capital, 3, years, dca);
  const dcaOn = dca > 0;

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
      <div style={{ display: 'flex', gap: '14px', marginTop: '14px', flexWrap: 'wrap' }}>
        {dcaOn ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#374151' }}>
              <div style={{ width: '22px', height: '4px', background: '#059669', borderRadius: '2px' }} />
              Con DCA {dca}€/mes → <strong style={{ color: '#059669' }}>{fmtShort(eDca)}</strong> en {years}A
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#94A3B8' }}>
              <div style={{ width: '22px', height: '3px', background: '#7C3AED', borderRadius: '2px', borderTop: '1.5px dashed #7C3AED' }} />
              Solo capital → <strong style={{ color: '#7C3AED' }}>{fmtShort(eMain)}</strong>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#374151' }}>
            <div style={{ width: '22px', height: '4px', background: '#7C3AED', borderRadius: '2px' }} />
            Tu cartera ({totalRet.toFixed(2)}%/año) → <strong style={{ color: '#7C3AED' }}>{fmtShort(eMain)}</strong> en {years}A
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#94A3B8' }}>
          <div style={{ width: '22px', height: '2px', background: '#CBD5E1', borderTop: '1.5px dashed #CBD5E1' }} />
          Ahorro 3%/A → <strong style={{ color: '#94A3B8' }}>{fmtShort(eC)}</strong>
        </div>
      </div>
    </div>
  );
}

export default function Calculator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const [capital, setCapital] = useState(204000);
  const [years, setYears] = useState(20);
  const [dcaEnabled, setDcaEnabled] = useState(false);
  const [dcaAmount, setDcaAmount] = useState(500);
  const [weights, setWeights] = useState<CatWeights>(Object.fromEntries(CATS.map(c => [c.id, c.peso])));
  const [rets, setRets] = useState<CatRets>(Object.fromEntries(CATS.map(c => [c.id, c.ret])));

  const totalPeso = Object.values(weights).reduce((a, b) => a + b, 0);
  const totalRet = CATS.reduce((s, c) => s + ((weights[c.id] ?? c.peso) / 100) * (rets[c.id] ?? c.ret), 0);
  const dca = dcaEnabled ? dcaAmount : 0;
  const profile = getProfile(totalRet);
  const endMain = calcFV(capital, totalRet, years, 0);
  const endDca = dcaEnabled ? calcFV(capital, totalRet, years, dca) : null;
  const totalRentabEur = CATS.reduce((s, c) => s + capital * ((weights[c.id] ?? c.peso) / 100) * ((rets[c.id] ?? c.ret) / 100), 0);

  return (
    <section id="calculadora" style={{ background: '#F8FAFC', padding: '88px 56px', borderTop: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '10px' }}>
            PASO 2 — CALCULA TU CARTERA
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3vw, 44px)', color: 'var(--navy)', marginBottom: '8px' }}>
            Diseña tu <em style={{ color: 'var(--blue)', fontStyle: 'italic' }}>cartera ideal</em>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--g3)', marginBottom: '40px', maxWidth: '820px', lineHeight: 1.75 }}>
            Introduce tu capital, ajusta los pesos de cada categoría y activa el DCA si quieres aportar mensualmente.
          </p>
        </motion.div>

        {/* Inputs row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          {/* Capital */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #E2E8F0', padding: '22px 24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '12px' }}>Capital inicial</div>
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden', background: '#F8FAFC' }}>
              <span style={{ padding: '12px 14px', fontSize: '17px', fontWeight: 500, color: '#94A3B8', borderRight: '1px solid #E2E8F0', background: '#F1F5F9' }}>€</span>
              <input type="number" value={capital} min={0} step={1000} onChange={e => setCapital(Math.max(1, +e.target.value))}
                style={{ border: 'none', outline: 'none', padding: '12px 14px', fontSize: '20px', fontWeight: 700, color: 'var(--navy)', flex: 1, background: 'transparent', fontFamily: 'var(--font-sans)' }} />
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '7px' }}>Capital invertido desde el primer día</div>
          </div>

          {/* DCA */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #7C3AED30', padding: '22px 24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '3px', background: 'var(--purple)', borderRadius: '0 0 3px 3px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '.07em' }}>Aportación DCA</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={dcaEnabled} onChange={e => setDcaEnabled(e.target.checked)} style={{ accentColor: 'var(--purple)', width: '14px', height: '14px' }} />
                <span style={{ fontSize: '14px', color: '#64748B' }}>Activar</span>
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden', background: '#F8FAFC' }}>
              <span style={{ padding: '12px 14px', fontSize: '17px', fontWeight: 500, color: '#94A3B8', borderRight: '1px solid #E2E8F0', background: '#F1F5F9' }}>€</span>
              <input type="number" value={dcaAmount} min={0} step={50} onChange={e => setDcaAmount(+e.target.value)}
                style={{ border: 'none', outline: 'none', padding: '12px 14px', fontSize: '20px', fontWeight: 700, color: 'var(--purple)', flex: 1, background: 'transparent', fontFamily: 'var(--font-sans)' }} />
              <span style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 500, color: '#94A3B8', borderLeft: '1px solid #E2E8F0', background: '#F1F5F9' }}>/ mes</span>
            </div>
          </div>

          {/* Years */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #E2E8F0', padding: '22px 24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '12px' }}>Horizonte temporal</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
              <input type="range" min={1} max={40} step={1} value={years} onChange={e => setYears(+e.target.value)}
                style={{ flex: 1, accentColor: 'var(--navy)', height: '10px' }} />
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--navy)', minWidth: '90px', textAlign: 'right' }}>{years} años</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#CBD5E1' }}>1 año</span>
              <span style={{ fontSize: '13px', color: '#CBD5E1' }}>40 años</span>
            </div>
          </div>
        </div>

        {/* Profile box */}
        <motion.div
          animate={{ background: profile.bg, borderColor: profile.border }}
          transition={{ duration: 0.4 }}
          style={{ borderRadius: '18px', padding: '28px 32px', border: '2px solid', marginBottom: '28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>Tu perfil de inversor</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '34px', color: profile.color, marginBottom: '6px' }}>{profile.name}</div>
              <div style={{ fontSize: '17px', lineHeight: 1.7, color: '#374151', maxWidth: '700px' }}>{profile.desc}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                {profile.badges.map(b => (
                  <span key={b} style={{ fontSize: '13px', fontWeight: 600, padding: '5px 15px', borderRadius: '24px', background: profile.badgeBg, color: profile.badgeColor }}>{b}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: '110px' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '58px', color: profile.color, lineHeight: 1 }}>{fmtPct(totalRet)}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: profile.color, marginTop: '2px' }}>retorno esp.</div>
            </div>
          </div>
        </motion.div>

        {/* Summary strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '26px' }}>
          {[
            { label: 'Capital inicial', val: fmtEur(capital), color: '#1B2B5B', bg: '#EFF6FF', border: '#BFDBFE' },
            { label: 'Retorno esperado', val: fmtPct(totalRet), color: '#059669', bg: '#F0FDF4', border: '#A7F3D0' },
            { label: 'Rentab. anual €', val: fmtEur(totalRentabEur), color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
            { label: `En ${years} años`, val: fmtShort(endMain), color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
            ...(endDca ? [{ label: `Con DCA ${dcaAmount}€/mes`, val: fmtShort(endDca), color: '#059669', bg: '#F0FDF4', border: '#A7F3D0' }] : []),
            { label: 'Pesos totales', val: fmtPct(totalPeso), color: Math.abs(totalPeso - 100) < 0.1 ? '#B45309' : '#C53030', bg: Math.abs(totalPeso - 100) < 0.1 ? '#FFFBEB' : '#FFF5F5', border: Math.abs(totalPeso - 100) < 0.1 ? '#FDE68A' : '#FECACA' },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: '13px', padding: '16px 20px', border: `1.5px solid ${s.border}`, background: s.bg }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid #E2E8F0', overflow: 'hidden', marginBottom: '24px' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.4fr 1fr 1.3fr 1.2fr', padding: '14px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', gap: '8px' }}>
            {['Categoría', 'Retorno esp.', 'Peso %', 'Contribución', 'Capital', 'Rentab. €'].map((h, i) => (
              <div key={h} style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.07em', textAlign: i > 1 ? 'right' : 'left' }}>{h}</div>
            ))}
          </div>
          {CATS.map((c, i) => {
            const peso = weights[c.id] ?? c.peso;
            const ret = rets[c.id] ?? c.ret;
            const capitalCat = capital * (peso / 100);
            const rentabEur = capitalCat * (ret / 100);
            const contrib = (peso / 100) * ret;
            return (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.4fr 1fr 1.3fr 1.2fr', padding: '16px 24px', gap: '8px', borderBottom: '1px solid #F1F5F9', background: i % 2 === 1 ? '#FAFBFC' : '#fff', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#1B2B5B' }}>{c.label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <input type="number" value={ret} min={0} max={30} step={0.1}
                    onChange={e => setRets(prev => ({ ...prev, [c.id]: parseFloat(e.target.value) || 0 }))}
                    style={{ width: '72px', textAlign: 'right', border: '1.5px solid #E2E8F0', borderRadius: '8px', padding: '6px 8px', fontSize: '15px', fontWeight: 600, color: c.color, background: '#fff', fontFamily: 'var(--font-sans)', outline: 'none' }} />
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}> %</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                  <input type="range" min={0} max={100} step={1} value={peso}
                    onChange={e => setWeights(prev => ({ ...prev, [c.id]: +e.target.value }))}
                    style={{ width: '70px', accentColor: c.color, height: '8px' }} />
                  <input type="number" value={peso} min={0} max={100} step={1}
                    onChange={e => setWeights(prev => ({ ...prev, [c.id]: +e.target.value }))}
                    style={{ width: '50px', textAlign: 'center', border: '1.5px solid #E2E8F0', borderRadius: '8px', padding: '6px', fontSize: '15px', fontWeight: 600, color: '#1B2B5B', background: '#fff', fontFamily: 'var(--font-sans)', outline: 'none' }} />
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>%</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '15px', fontWeight: 600, color: '#059669' }}>{fmtPct(contrib)}</div>
                <div style={{ textAlign: 'right', fontSize: '15px', fontWeight: 500, color: '#374151' }}>{fmtEur(capitalCat)}</div>
                <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 700, color: c.color }}>{fmtEur(rentabEur)}</div>
              </div>
            );
          })}
          {/* Footer total */}
          {Math.abs(totalPeso - 100) > 0.1 && (
            <div style={{ padding: '10px 24px', background: '#FEF2F2', color: '#991B1B', fontSize: '15px', fontWeight: 600, borderTop: '1px solid #FEE2E2' }}>
              ⚠ Los pesos suman {totalPeso.toFixed(1)}% — deben sumar 100%
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.4fr 1fr 1.3fr 1.2fr', padding: '18px 24px', gap: '8px', background: '#F8FAFC', borderTop: '2px solid #E2E8F0', alignItems: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1B2B5B' }}>TOTAL CARTERA</div>
            <div />
            <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 700, color: '#1B2B5B' }}>{fmtPct(totalPeso)}</div>
            <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 700, color: '#059669' }}>{fmtPct(totalRet)}</div>
            <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 700, color: '#1B2B5B' }}>{fmtEur(capital)}</div>
            <div style={{ textAlign: 'right', fontSize: '20px', fontWeight: 700, color: '#7C3AED' }}>{fmtEur(totalRentabEur)}</div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#fff', borderRadius: '18px', border: '1.5px solid #E2E8F0', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '16px' }}>Distribución</div>
            <DonutChart weights={weights} totalRet={totalRet} />
          </div>
          <div style={{ background: '#fff', borderRadius: '18px', border: '1.5px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.07em' }}>Proyección de crecimiento</div>
              {dcaEnabled && <div style={{ fontSize: '13px', fontWeight: 700, background: '#F5F3FF', color: 'var(--purple)', padding: '5px 14px', borderRadius: '24px', border: '1px solid #DDD6FE' }}>DCA ACTIVADO</div>}
            </div>
            <GrowthChart capital={capital} totalRet={totalRet} years={years} dca={dca} />
          </div>
        </div>

        <div style={{ marginTop: '16px', padding: '14px 18px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', fontSize: '15px', color: '#92400E', lineHeight: 1.7 }}>
          <strong>Aviso:</strong> Los retornos son estimaciones históricas. Las rentabilidades pasadas no garantizan rentabilidades futuras. Simulador meramente informativo.
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #calculadora > div > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
