/**
 * ChartWrapper — shared chart primitives
 *
 * Exports:
 *   ChartTooltip   — drop-in Recharts content prop, styled to design system
 *   CHART_COLORS   — canonical palette: brand + status, used in every chart
 *   chartGridProps — spread onto <CartesianGrid> for consistent gridlines
 *   chartAxisProps — spread onto <XAxis> / <YAxis> for consistent tick styles
 */

// ── Canonical chart color palette ─────────────────────────────────────────────
// Same source of truth as the CSS status tokens, but expressed as hex so
// Recharts Cell / stroke / fill props can consume them directly.
// Rule: fleet donut, stock bar, and any future chart all pull from here.
export const CHART_COLORS = {
  primary:   '#002B79', // brand navy — dominant series
  accent:    '#FFC107', // brand gold — secondary series
  success:   '#16A34A', // status-success
  warning:   '#D97706', // status-warning (orange, NOT gold)
  danger:    '#DC2626', // status-danger
  info:      '#6D28D9', // status-info (violet)
  neutral:   '#6C7993', // gray-500

  // Named aliases — used when the semantic meaning matters over brand
  inTransit:   '#6D28D9', // violet = info
  idle:        '#6C7993', // neutral gray
  maintenance: '#D97706', // warning orange

  // Named stock commodities
  maize:    '#002B79',
  sorghum:  '#D97706',
  soyabeans:'#16A34A',
} as const

// ── Grid props ────────────────────────────────────────────────────────────────
// Spread onto <CartesianGrid>. No dashes, low-opacity 1px lines only.
export const chartGridProps = {
  strokeDasharray: '0',
  stroke: 'rgb(224 228 237 / 0.8)', // surface-border light
  vertical: false,
} as const

// ── Axis props (shared base, extend per chart) ────────────────────────────────
export const chartAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fontSize: 12, fill: '#6C7993' }, // gray-500
  dy: 4,
} as const

// ── Tooltip ───────────────────────────────────────────────────────────────────
interface TooltipPayloadItem {
  name?: string
  value?: number | string
  color?: string
  fill?: string
  dataKey?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
  /** Optional formatter for the value (e.g. currency) */
  formatValue?: (v: number | string) => string
}

export function ChartTooltip({ active, payload, label, formatValue }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      style={{
        background: 'rgb(var(--color-surface-overlay))',
        border: '1px solid rgb(var(--color-surface-border))',
        borderRadius: '6px',
        boxShadow: 'var(--shadow-md)',
        padding: '10px 14px',
        minWidth: 140,
      }}
    >
      {label !== undefined && (
        <p style={{ fontSize: 12, fontWeight: 600, color: 'rgb(var(--color-text-primary))', marginBottom: 6 }}>
          {label}
        </p>
      )}
      {payload.map((entry, i) => {
        const color = entry.color ?? entry.fill ?? 'rgb(var(--color-text-muted))'
        const raw = entry.value ?? 0
        const display = formatValue ? formatValue(raw) : typeof raw === 'number' ? raw.toLocaleString() : raw
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: i > 0 ? 4 : 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'rgb(var(--color-text-muted))', flex: 1 }}>{entry.name ?? entry.dataKey}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgb(var(--color-text-primary))' }}>{display}</span>
          </div>
        )
      })}
    </div>
  )
}
