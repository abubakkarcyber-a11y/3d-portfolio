/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#04060c',
        navy: '#070b16',
        panel: '#0b1220',
        mist: '#8fa0bd',
        frost: '#e8eefb',
        cyanx: '#22d3ee',
        bluex: '#3b82f6',
        violetx: '#8b5cf6',
        mint: '#34d399',
      },
      fontFamily: {
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(56,189,248,0.14)',
        'glow-lg': '0 0 90px rgba(56,189,248,0.22)',
        panel: '0 24px 70px rgba(2,6,16,0.55)',
      },
      animation: {
        'pulse-dot': 'pulseDot 2.2s cubic-bezier(0.4,0,0.6,1) infinite',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 2.6s linear infinite',
        'spin-slow': 'spin 14s linear infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.82)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
