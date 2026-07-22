/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Removed strict spacing scale to restore Tailwind's default spacing, fixing broken p-5, h-80, w-32 classes.
    // ─── FONT FAMILY ─────────────────────────────────────────────────────────
    fontFamily: {
      sans:   ['"NairaFallback"', '"Inter"', 'system-ui', 'sans-serif'],
      header: ['"Montserrat"', '"NairaFallback"', '"Inter"', 'system-ui', 'sans-serif'],
    },
    // ─── FONT SIZE ───────────────────────────────────────────────────────────
    // Named scale tied to product roles, not arbitrary sizes.
    fontSize: {
      'xs':    ['11px', { lineHeight: '16px' }], // caption / metadata / table timestamps
      'sm':    ['13px', { lineHeight: '20px' }], // body / table cells
      'base':  ['14px', { lineHeight: '22px' }], // default body
      'md':    ['16px', { lineHeight: '24px' }], // card headers
      'lg':    ['18px', { lineHeight: '28px' }], // section headers
      'xl':    ['22px', { lineHeight: '32px' }], // page titles
      '2xl':   ['28px', { lineHeight: '36px' }], // KPI values
      '3xl':   ['36px', { lineHeight: '44px' }], // hero KPI (Total Revenue)
    },
    extend: {
      // ─── COLORS ────────────────────────────────────────────────────────────
      colors: {
        // Brand — navy derived from Loryb logo
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover:   'rgb(var(--color-primary-hover) / <alpha-value>)',
          light:   'rgb(var(--color-primary-light) / <alpha-value>)',
          dark:    'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        // Brand — gold/amber from logo
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover:   'rgb(var(--color-accent-hover) / <alpha-value>)',
          light:   'rgb(var(--color-accent-light) / <alpha-value>)',
        },
        // Surfaces — 3-level elevation system
        surface: {
          base:    'rgb(var(--color-surface-base) / <alpha-value>)',    // page bg
          raised:  'rgb(var(--color-surface-raised) / <alpha-value>)',  // cards
          overlay: 'rgb(var(--color-surface-overlay) / <alpha-value>)', // modals
          border:  'rgb(var(--color-surface-border) / <alpha-value>)',
          active:  'rgb(var(--color-surface-active) / <alpha-value>)',  // hover / selected rows
        },
        // Text
        text: {
          primary:   'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted:     'rgb(var(--color-text-muted) / <alpha-value>)',
          inverse:   'rgb(var(--color-text-inverse) / <alpha-value>)',
        },
        // Grays — 9-step scale, CSS-var driven so dark mode inverts cleanly
        gray: {
          50:  'rgb(var(--color-gray-50) / <alpha-value>)',
          100: 'rgb(var(--color-gray-100) / <alpha-value>)',
          200: 'rgb(var(--color-gray-200) / <alpha-value>)',
          300: 'rgb(var(--color-gray-300) / <alpha-value>)',
          400: 'rgb(var(--color-gray-400) / <alpha-value>)',
          500: 'rgb(var(--color-gray-500) / <alpha-value>)',
          600: 'rgb(var(--color-gray-600) / <alpha-value>)',
          700: 'rgb(var(--color-gray-700) / <alpha-value>)',
          800: 'rgb(var(--color-gray-800) / <alpha-value>)',
          900: 'rgb(var(--color-gray-900) / <alpha-value>)',
        },
        // ── STATUS / SEMANTIC ──────────────────────────────────────────────
        // Each status has: DEFAULT (for text/icons), bg (tint), and border.
        // DO NOT use brand colors for status. They must be perceptually distinct
        // from navy (#002B79) and gold (#FFC107).
        status: {
          // Emerald-green — clearly distinct from navy or gold
          success: {
            DEFAULT: 'rgb(var(--color-status-success) / <alpha-value>)',
            bg:      'rgb(var(--color-status-success-bg) / <alpha-value>)',
            border:  'rgb(var(--color-status-success-border) / <alpha-value>)',
          },
          // Amber/orange — WARNING: intentionally offset from gold accent
          // Gold accent = hsl(45,100%,51%). Warning = hsl(32,95%,44%) — darker, warmer.
          warning: {
            DEFAULT: 'rgb(var(--color-status-warning) / <alpha-value>)',
            bg:      'rgb(var(--color-status-warning-bg) / <alpha-value>)',
            border:  'rgb(var(--color-status-warning-border) / <alpha-value>)',
          },
          // Red — distinct from both navy and gold
          danger: {
            DEFAULT: 'rgb(var(--color-status-danger) / <alpha-value>)',
            bg:      'rgb(var(--color-status-danger-bg) / <alpha-value>)',
            border:  'rgb(var(--color-status-danger-border) / <alpha-value>)',
          },
          // Slate-blue — distinct from brand navy (navy is dark/saturated,
          // info is medium-bright periwinkle)
          info: {
            DEFAULT: 'rgb(var(--color-status-info) / <alpha-value>)',
            bg:      'rgb(var(--color-status-info-bg) / <alpha-value>)',
            border:  'rgb(var(--color-status-info-border) / <alpha-value>)',
          },
          // Neutral gray for draft/inactive
          neutral: {
            DEFAULT: 'rgb(var(--color-status-neutral) / <alpha-value>)',
            bg:      'rgb(var(--color-status-neutral-bg) / <alpha-value>)',
            border:  'rgb(var(--color-status-neutral-border) / <alpha-value>)',
          },
        },
      },
      // ─── BORDER RADIUS ───────────────────────────────────────────────────
      // ONE scale. Nothing uses rounded-none or rounded-full except avatars.
      borderRadius: {
        none: '0px',
        sm:   '8px',   // inputs, badges, tags
        md:   '16px',  // cards, dropdown panels
        lg:   '24px',  // modals, drawers, large sheets
        full: '9999px',// avatars only
      },
      // ─── BOX SHADOW ──────────────────────────────────────────────────────
      // 3 elevation levels + none. Used via shadow-sm/md/lg.
      // Dark mode adjusts via CSS variables — shadows are more glow-based.
      boxShadow: {
        none: 'none',
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
      },
      // ─── RING (focus) ─────────────────────────────────────────────────────
      ringColor: {
        primary: 'rgb(var(--color-primary) / 0.3)',
        danger:  'rgb(var(--color-status-danger) / 0.3)',
      },
      keyframes: {
        'logo-fill': {
          '0%': { clipPath: 'inset(100% 0 0 0)' },
          '50%': { clipPath: 'inset(0 0 0 0)' },
          '100%': { clipPath: 'inset(0 0 100% 0)' },
        }
      },
      animation: {
        'logo-fill': 'logo-fill 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
