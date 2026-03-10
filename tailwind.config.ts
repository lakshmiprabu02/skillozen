import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Skillozen Brand Palette
        brand: {
          violet:  '#5B2EFF',  // Primary
          coral:   '#FF6B35',  // Energy / CTA
          mint:    '#00D68F',  // Growth / Success
          gold:    '#FFB800',  // XP / Rewards
          sky:     '#00B4D8',  // Info / Digital
          rose:    '#FF4785',  // Creativity
          base:    '#FAFAF8',  // Background
          ink:     '#1A1033',  // Text
        },
      },
      fontFamily: {
        display: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'skill':  '0 4px 24px -4px rgba(91,46,255,0.2)',
        'card':   '0 2px 16px -2px rgba(26,16,51,0.08)',
        'glow':   '0 0 40px -8px rgba(91,46,255,0.4)',
        'gold':   '0 4px 20px -4px rgba(255,184,0,0.4)',
      },
      animation: {
        'float':        'float 3s ease-in-out infinite',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up':     'slideUp 0.5s ease-out',
        'fade-in':      'fadeIn 0.4s ease-out',
        'bounce-soft':  'bounceSoft 1s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':    'linear-gradient(135deg, #5B2EFF 0%, #FF6B35 100%)',
        'skill-gradient':   'linear-gradient(135deg, #5B2EFF 0%, #00D68F 100%)',
        'card-shimmer':     'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

export default config
