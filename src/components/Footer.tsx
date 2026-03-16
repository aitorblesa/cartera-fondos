export default function Footer() {
  return (
    <footer style={{
      background: 'var(--navy3)',
      borderTop: '1px solid #1E3A6E',
      padding: '48px 56px',
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#fff', marginBottom: '18px' }}>
        Fondos <span style={{ color: 'var(--blue)' }}>Familia</span>
      </div>
      <p style={{
        fontSize: '14px', color: '#335541', lineHeight: 1.8,
        maxWidth: '860px', margin: '0 auto 24px',
      }}>
        Las rentabilidades pasadas no garantizan rentabilidades futuras. Este documento es meramente
        informativo y no constituye asesoramiento de inversión. Antes de invertir consulte el folleto
        y el documento de datos fundamentales (DFI) de cada fondo.
      </p>
      <a
        href="https://artemisafunds.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '12px',
          background: '#1e6e1e', padding: '14px 26px', borderRadius: '14px',
          textDecoration: 'none', transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#24552b'}
        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = '#1e6e1e'}
      >
        <div>
          <div style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.07em' }}>Fondos seleccionados a través de</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#84fa60' }}>artemisafunds.com</div>
        </div>
        <div style={{ fontSize: '20px', color: '#7afa60' }}>→</div>
      </a>
    </footer>
  );
}
