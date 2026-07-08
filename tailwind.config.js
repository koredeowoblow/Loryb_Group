/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Legible data font
        header: ['Montserrat', 'system-ui', 'sans-serif'], // Geometric, confident
      },
      colors: {
        primary: {
          DEFAULT: '#002B79',
          hover: '#001E55',
          light: '#335593',
          lighter: '#E6EAF2',
        },
        accent: {
          DEFAULT: '#F59E0B', // Warm amber / wheat
          hover: '#D97706',
          light: '#FDE68A',
          lighter: '#FFFBEB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC', // Slate 50 (cool undertone)
          border: '#E2E8F0', // Slate 200
          active: '#F1F5F9', // Slate 100
        },
        text: {
          primary: '#0F172A', // Slate 900 (near black, cool)
          secondary: '#334155', // Slate 700
          muted: '#64748B', // Slate 500
        },
        status: {
          pending: { DEFAULT: '#F59E0B', dark: '#B45309' }, // Amber 700
          intransit: { DEFAULT: '#002B79', dark: '#001E55' }, // Primary hover
          success: { DEFAULT: '#10B981', dark: '#047857' }, // Emerald 700
          error: { DEFAULT: '#EF4444', dark: '#B91C1C' }, // Red 700
          draft: { DEFAULT: '#64748B', dark: '#334155' }, // Slate 700
        }
      },
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },
      fontSize: {
        'xxs': '0.65rem',
      }
    },
  },
  plugins: [],
}
