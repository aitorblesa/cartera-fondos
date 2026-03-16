/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#1B2B5B',
          '2': '#0F2044',
          '3': '#0B1629',
        },
        brand: {
          blue: '#2563EB',
          'blue-l': '#DBEAFE',
          teal: '#0D7A5F',
          'teal-l': '#D1FAE5',
          amber: '#B45309',
          'amber-l': '#FEF3C7',
          red: '#C53030',
          'red-l': '#FEE2E2',
          purple: '#7C3AED',
          'purple-l': '#F5F3FF',
          green: '#059669',
          'green-l': '#ECFDF5',
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '60px 60px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
