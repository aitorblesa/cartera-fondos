export const SECTIONS = [
  { id: 'tipos',       label: 'Tipos de fondos' },
  { id: 'calculadora', label: 'Calculadora' },
  { id: 'fondos',      label: 'Los fondos' },
  { id: 'por-que',     label: 'Por qué diversificar' },
] as const;

export const CATS = [
  { id: 'monetario', label: 'Monetarios',    color: '#2563EB', ret: 2.10, peso: 15 },
  { id: 'rfcorto',   label: 'RF Corto plazo',color: '#0D7A5F', ret: 3.70, peso: 15 },
  { id: 'rfmedio',   label: 'RF Medio plazo',color: '#059669', ret: 5.50, peso: 20 },
  { id: 'rv',        label: 'Renta Variable',color: '#C53030', ret: 9.00, peso: 40 },
  { id: 'alt',       label: 'Alternativos',  color: '#7C3AED', ret: 5.00, peso: 10 },
] as const;

export type FundType = 'monetario' | 'rf' | 'mixto' | 'rv';

export interface Fund {
  name: string;
  mgr: string;
  type: FundType;
  r: number;
  rent: string;
  d: [string, string][];
  desc: string;
  pros: string[];
}

// Tailwind-safe color mappings per fund type
export const TYPE_STYLES: Record<FundType, {
  stripe: string;
  badgeBg: string;
  badgeText: string;
  badgeLabel: string;
  riskDot: string;
  rentText: string;
  hex: string;
}> = {
  monetario: {
    stripe:     'bg-blue-600',
    badgeBg:    'bg-blue-50',
    badgeText:  'text-blue-700',
    badgeLabel: 'MONETARIO',
    riskDot:    'bg-blue-600',
    rentText:   'text-blue-600',
    hex:        '#2563EB',
  },
  rf: {
    stripe:     'bg-teal-700',
    badgeBg:    'bg-emerald-50',
    badgeText:  'text-emerald-800',
    badgeLabel: 'RENTA FIJA',
    riskDot:    'bg-teal-700',
    rentText:   'text-teal-700',
    hex:        '#0D7A5F',
  },
  mixto: {
    stripe:     'bg-amber-700',
    badgeBg:    'bg-amber-50',
    badgeText:  'text-amber-800',
    badgeLabel: 'MIXTO / ALT.',
    riskDot:    'bg-amber-700',
    rentText:   'text-amber-700',
    hex:        '#B45309',
  },
  rv: {
    stripe:     'bg-red-700',
    badgeBg:    'bg-red-50',
    badgeText:  'text-red-800',
    badgeLabel: 'RV / BOLSA',
    riskDot:    'bg-red-700',
    rentText:   'text-red-700',
    hex:        '#C53030',
  },
};

export const RISK_LABEL: Record<number, string> = {
  1: 'Muy bajo', 2: 'Bajo', 3: 'Moderado',
  4: 'Mod-alto', 5: 'Alto', 6: 'Alto', 7: 'Muy alto',
};

export const RISK_COLOR: Record<number, string> = {
  1: 'text-teal-700', 2: 'text-teal-700', 3: 'text-amber-700',
  4: 'text-amber-700', 5: 'text-red-700', 6: 'text-red-700', 7: 'text-red-700',
};

export const FUNDS: Fund[] = [
  {
    name: 'Groupama Trésorerie', mgr: 'Groupama Asset Management', type: 'monetario', r: 1,
    rent: '~2–4% anual',
    d: [['Liquidez', '24–48 h'], ['Rent. 2024', '3,98%'], ['Volatilidad', '<0,1%']],
    desc: 'Fondo de mercado monetario francés de referencia. Invierte en letras del Tesoro europeas, pagarés de empresa y depósitos a menos de 6 meses. La caja fuerte líquida de la cartera: protege el capital y permite retirar el dinero cualquier día hábil sin penalización.',
    pros: ['Disponible en 24–48 horas sin coste ni penalización', 'Volatilidad casi cero: el valor prácticamente no fluctúa nunca', 'Genera ~3–4% anual frente al 0% de una cuenta corriente'],
  },
  {
    name: 'NB Short Duration Euro Bond', mgr: 'Neuberger Berman', type: 'rf', r: 2,
    rent: '~3–5% anual',
    d: [['Duración', '1–3 años'], ['Calidad', 'IG BBB+'], ['Equipo', '170+ prof.']],
    desc: 'Bonos corporativos europeos de alta calidad crediticia con vencimiento de 1 a 3 años. El escalón natural entre el efectivo y la renta fija larga: más rentabilidad con riesgo mínimo adicional.',
    pros: ['170+ profesionales de renta fija seleccionando los mejores bonos', 'Duración corta: poco impacto si el BCE sube tipos', 'Prima de rentabilidad clara sobre el fondo monetario'],
  },
  {
    name: 'Evli Nordic Corporate Bond', mgr: 'Evli Fund Management', type: 'rf', r: 2,
    rent: '~4–6% anual',
    d: [['Rent. 3A', '6,16%'], ['Morningstar', '★★★★★'], ['AUM nórdico', '>3.000 M€']],
    desc: 'Especializado en bonos corporativos de empresas nórdicas. Muchas empresas sin calificación oficial ofrecen 1–2% extra frente a comparables europeas. Divisa cubierta a euros. Casi 20 años de experiencia local.',
    pros: ['Prima nórdica: más yield para el mismo riesgo', '5 estrellas Morningstar de forma consistente', 'Baja correlación con bonos europeos convencionales'],
  },
  {
    name: 'B&H Deuda FI', mgr: 'Buy & Hold Capital', type: 'rf', r: 2,
    rent: '~4–6% anual',
    d: [['TER', 'Solo 0,35%'], ['Filosofía', 'Buy & Hold'], ['Patrimonio', '>112 M€']],
    desc: 'Renta fija global con filosofía buy & hold. Compran bonos baratos en momentos de estrés y los mantienen hasta vencimiento. TER de solo 0,35%, uno de los más baratos del mercado.',
    pros: ['TER 0,35%: comisiones extraordinariamente bajas', 'Rentabilidad predecible basada en el cupón de compra', 'Gestora española transparente con cartas periódicas'],
  },
  {
    name: 'Carmignac Flexible Bond', mgr: 'Carmignac', type: 'rf', r: 3,
    rent: '~3–6% anual',
    d: [['Duración', '-3 a +8'], ['Res. 2022', '+5,99%'], ['Alpha vs idx', '>+25 pp']],
    desc: 'RF global sin restricciones con duración de -3 a +8. Puede ponerse en negativo y ganar cuando los tipos suben. En 2022, cuando toda la RF tradicional perdía un 10–15%, este fondo ganó +5,99%.',
    pros: ['+5,99% en 2022: uno de los peores años de la historia de la RF', 'Puede ganar tanto cuando los tipos suben como cuando bajan', 'Desde 2019: batió al benchmark en más de 25 puntos porcentuales'],
  },
  {
    name: 'BrightGate Global Income', mgr: 'BrightGate / Andbank', type: 'rf', r: 2,
    rent: 'Euribor +3%',
    d: [['Objetivo', 'Eur. +3%'], ['Track rec.', '>10 años'], ['Posiciones', '30–60']],
    desc: 'Crédito global con objetivo claro: Euribor + 3% anual. Filosofía "Buy & Watch": compran bonos infravalorados y venden si detectan deterioro. Sin índice de referencia.',
    pros: ['Objetivo de rentabilidad claro y verificable', 'Más de 10 años superando índices globales de RF', 'Cartas trimestrales públicas con todo el análisis'],
  },
  {
    name: 'DNCA Alpha Bonds', mgr: 'DNCA Finance (Natixis)', type: 'rf', r: 2,
    rent: '€STR +1,4%',
    d: [['Res. 2022', '+5,99%'], ['AUM', '>25.600 M€'], ['Volat. 3A', '1,46%']],
    desc: 'Fondo alternativo de retorno absoluto en renta fija. Usa posiciones largas y cortas en tipos de interés y arbitraje. AUM >25.000 M€. El gran seguro de cartera.',
    pros: ['+5,99% en 2022 cuando TODA la RF tradicional perdía', 'Volatilidad de 1,46% anual: monetario con más retorno', 'Fondo gigante (>25.000 M€): máxima liquidez'],
  },
  {
    name: 'Sigma IH BrightGate', mgr: 'BrightGate Capital', type: 'rf', r: 2,
    rent: 'Euribor +3%',
    d: [['Objetivo', 'Eur. +3%'], ['Track rec.', '>10 años'], ['Estrategia', 'Buy & Watch']],
    desc: 'Vehículo luxemburgués de la misma estrategia BrightGate Global Income. Crédito global con objetivo Euribor + 3% y baja sensibilidad a tipos.',
    pros: ['Misma filosofía probada durante más de 10 años', 'Duración baja: retorno del crédito, no de tipos', 'Estructura UCITS luxemburguesa regulada'],
  },
  {
    name: 'Cobas Internacional FI', mgr: 'Cobas Asset Management', type: 'rv', r: 6,
    rent: 'Potencial >10%',
    d: [['Filosofía', 'Value'], ['Mercados', 'OCDE excl. Iberia'], ['Horizonte', '≥5 años']],
    desc: 'Renta variable global value por Francisco García Paramés. Solo compran empresas con descuento del 50%+ sobre su valor intrínseco. Horizonte mínimo 5 años.',
    pros: ['García Paramés: 25 años de track record value excepcional', 'Descuento del 50%: margen de seguridad ante caídas', 'Los gestores invierten su propio patrimonio junto a los partícipes'],
  },
  {
    name: 'Myinvestor Value', mgr: 'Andbank / Carlos Val-Carreres', type: 'rv', r: 4,
    rent: 'Objetivo >8–10%',
    d: [['Rent. 3A', '+7,45%'], ['Morningstar', '★★★★★'], ['Volatilidad', '14,2%']],
    desc: 'Small caps europeas infravaloradas. Método "Creación de Valor" inspirado en Buffett. Batió al índice en +16,64% en 3 años con MENOS volatilidad.',
    pros: ['5 estrellas Morningstar: top 10% de fondos del mundo', 'Más rentabilidad Y menos riesgo que el índice', 'Gestor con 20+ años: +232% en Lierde vs +15% Stoxx 600'],
  },
  {
    name: 'Vanguard Emerging Markets', mgr: 'Vanguard', type: 'rv', r: 6,
    rent: '~7–10% largo plazo',
    d: [['Países', '24 emergentes'], ['Empresas', '>1.000'], ['Gestión', 'Pasiva (índice)']],
    desc: 'Índice MSCI Emerging Markets: 1.000+ empresas de 24 países. Gestión completamente pasiva con comisiones mínimas.',
    pros: ['Comisiones mínimas: la forma más eficiente de invertir', 'Diversificación en 1.000+ empresas de 24 países', 'Los emergentes crecen el doble que los desarrollados'],
  },
  {
    name: 'Pictet China Index', mgr: 'Pictet Asset Management', type: 'rv', r: 6,
    rent: 'Alto potencial',
    d: [['Track. error', '0,24%'], ['Rent. 1A', '+5,84%'], ['PER', '<10x vs 15–20x']],
    desc: 'Replica el MSCI China. Valoraciones en mínimos históricos (PER <10x frente a media de 15–20x). Pictet AM con 310.000 M€ bajo gestión.',
    pros: ['Valoraciones chinas en mínimos: potencial de reversión alto', 'Tracking error de 0,24%: replica casi perfectamente', 'Pictet AM: gestora independiente más solvente de Europa'],
  },
  {
    name: 'Gamma Global A FI', mgr: 'Singular Asset Management', type: 'mixto', r: 3,
    rent: '~5–10% anual',
    d: [['Rent. 2S24', '+5,52%'], ['Volatilidad', '~2%'], ['Flexibil.', '0–100% RF/RV']],
    desc: 'Sin restricciones: puede ir 0–100% en RF o RV según el ciclo. En 2S2024 logró +5,52% con solo 2% de volatilidad.',
    pros: ['Libertad total para ir donde está el valor', 'Logró +5,52% con solo 2% de volatilidad en 2S2024', 'Accede a bonos de alto cupón que otros fondos no pueden'],
  },
  {
    name: 'Ábaco RF Mixta Global', mgr: 'Ábaco Capital', type: 'mixto', r: 3,
    rent: '~3–6% anual',
    d: [['Base', 'RF global'], ['Extra', 'RV táctica'], ['Perfil', 'Conservador-mod.']],
    desc: 'Base de renta fija con pequeña dosis táctica de bolsa. Filosofía value aplicada también a los bonos. Perfil conservador-moderado.',
    pros: ['Estabilidad de la RF con pequeño motor de RV', 'Filosofía value: solo compra con margen de seguridad', 'Para capital que no tolera grandes caídas'],
  },
  {
    name: 'Dunas Valor Equilibrado', mgr: 'Dunas Capital AM', type: 'mixto', r: 2,
    rent: '~3–6% anual',
    d: [['Riesgo', '2/7 muy bajo'], ['ESG SFDR', 'Artículo 8'], ['Tipo', 'Alternativo']],
    desc: 'Fondo alternativo multiactivo con RF, CoCos bancarios, convertibles, RV (hasta 40%) y derivados. Riesgo 2/7 a pesar de su flexibilidad. Criterios ESG integrados.',
    pros: ['Riesgo 2/7 para la flexibilidad que tiene', 'Puede ganar cuando bolsa Y bonos caen a la vez', 'Invierte responsablemente con criterios ESG'],
  },
];
