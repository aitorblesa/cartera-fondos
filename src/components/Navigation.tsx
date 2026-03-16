'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SECTIONS } from '../data';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>('tipos');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (!visible.length) return;
        const topmost = visible.reduce((best, curr) =>
          curr.boundingClientRect.top < best.boundingClientRect.top ? curr : best
        );
        setActiveSection(topmost.target.id);
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: [0, 0.1, 0.25] }
    );

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-14 h-[68px] transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B1629]/95 backdrop-blur-md border-b border-blue-900/30'
          : 'bg-[#0B1629] border-b border-[#1E3A6E]'
      }`}
    >
      {/* Logo */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="font-serif text-[22px] text-white tracking-tight select-none"
      >
        Fondos <span className="text-blue-500">Familia</span>
      </motion.button>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1.5">
        {SECTIONS.map(sec => {
          const active = activeSection === sec.id;
          return (
            <motion.button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              whileTap={{ scale: 0.96 }}
              className={`relative px-5 py-2 rounded-full text-[14px] font-medium font-sans transition-colors duration-200 ${
                active ? 'text-white' : 'text-slate-500 hover:text-white hover:bg-[#1E3A6E]'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-blue-600 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {sec.label}
            </motion.button>
          );
        })}
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-white text-xl p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-[68px] left-0 right-0 bg-[#0B1629]/98 border-b border-[#1E3A6E] p-4 flex flex-col gap-2"
          >
            {SECTIONS.map(sec => (
              <button
                key={sec.id}
                onClick={() => scrollTo(sec.id)}
                className={`text-left px-4 py-3 rounded-xl text-base font-medium font-sans transition-colors ${
                  activeSection === sec.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
