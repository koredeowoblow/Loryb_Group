/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        header: ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          lighter: 'rgb(var(--color-primary-lighter) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light) / <alpha-value>)',
          lighter: 'rgb(var(--color-accent-lighter) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
          border: 'rgb(var(--color-surface-border) / <alpha-value>)',
          active: 'rgb(var(--color-surface-active) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        status: {
          pending: { 
            DEFAULT: 'rgb(var(--color-status-pending) / <alpha-value>)',
            dark: 'rgb(var(--color-status-pending-dark) / <alpha-value>)' 
          },
          intransit: { 
            DEFAULT: 'rgb(var(--color-status-intransit) / <alpha-value>)',
            dark: 'rgb(var(--color-status-intransit-dark) / <alpha-value>)' 
          },
          success: { 
            DEFAULT: 'rgb(var(--color-status-success) / <alpha-value>)',
            dark: 'rgb(var(--color-status-success-dark) / <alpha-value>)' 
          },
          error: { 
            DEFAULT: 'rgb(var(--color-status-error) / <alpha-value>)',
            dark: 'rgb(var(--color-status-error-dark) / <alpha-value>)' 
          },
          draft: { 
            DEFAULT: 'rgb(var(--color-status-draft) / <alpha-value>)',
            dark: 'rgb(var(--color-status-draft-dark) / <alpha-value>)' 
          },
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
