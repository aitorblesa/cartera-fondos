'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SECTIONS } from '../data';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>('tipos');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer to track which section is in view
    const sectionEls = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry with the largest intersection ratio that is intersecting
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to the top of the viewport
          const topmost = visible.reduce((best, curr) =>
            curr.boundingClientRect.top < best.boundingClientRect.top ? curr : best
          );
          setActiveSection(topmost.target.id);
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sectionEls.forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: scrolled ? 'rgba(11,22,41,0.97)' : 'var(--navy3)',
        borderBottom: scrolled ? '1px solid rgba(37,99,235,0.25)' : '2px solid #1E3A6E',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        height: '68px',
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '22px',
          color: '#fff',
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          userSelect: 'none',
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Fondos <span style={{ color: 'var(--blue)' }}>Familia</span>
      </motion.div>

      {/* Desktop nav links */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <motion.button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'relative',
                fontFamily: 'var(--font-sans)',
                fontSize: '14.5px',
                fontWeight: 500,
                padding: '8px 18px',
                borderRadius: '24px',
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'var(--blue)' : 'transparent',
                color: isActive ? '#fff' : '#64748B',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#1E3A6E';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#64748B';
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    background: 'var(--blue)',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {sec.label}
            </motion.button>
          );
        })}
      </div>

      {/* Mobile menu button — shown via CSS media query override */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '22px',
          cursor: 'pointer',
          padding: '8px',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '68px',
              left: 0,
              right: 0,
              background: 'rgba(11,22,41,0.98)',
              borderBottom: '1px solid #1E3A6E',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {SECTIONS.map(sec => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                style={{
                  background: activeSection === sec.id ? 'var(--blue)' : 'transparent',
                  color: activeSection === sec.id ? '#fff' : '#94A3B8',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '16px',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: 500,
                }}
              >
                {sec.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
          nav > div:nth-child(2) { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
}
