export default function Footer() {
  return (
    <footer className="bg-[#0B1629] border-t border-[#1E3A6E] px-14 py-12 text-center">
      <div className="font-serif text-2xl text-white mb-4">
        Fondos <span className="text-blue-500">Familia</span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto mb-7">
        Las rentabilidades pasadas no garantizan rentabilidades futuras. Este documento es meramente
        informativo y no constituye asesoramiento de inversión. Antes de invertir consulte el folleto
        y el documento de datos fundamentales (DFI) de cada fondo.
      </p>
      <a
        href="https://artemisafunds.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-[#1e6e1e] hover:bg-[#24552b] px-7 py-4 rounded-2xl no-underline transition-colors duration-200"
      >
        <div>
          <div className="text-[11px] text-slate-400 uppercase tracking-widest">Fondos seleccionados a través de</div>
          <div className="text-lg font-semibold text-[#84fa60]">artemisafunds.com</div>
        </div>
        <div className="text-xl text-[#7afa60]">→</div>
      </a>
    </footer>
  );
}
