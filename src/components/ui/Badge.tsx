import clsx from 'clsx'

/**
 * Badge — single source of truth for all status indicators.
 *
 * Maps status strings to the semantic badge classes defined in index.css.
 * This covers: Gate Log (Cleared/Pending), Fleet (In-Transit/Idle/Maintenance),
 * Dispatch, Inventory alerts, Invoice status, Supplier payment status.
 *
 * RULE: Do NOT add per-page status coloring. Add a mapping here instead.
 */

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

// ── Canonical status → variant mapping ───────────────────────────────────────
// Every status string used across the app maps to one of 5 semantic variants.
// Adding a new status? Map it here, don't create a new color.
const STATUS_MAP: Record<string, StatusVariant> = {
  // Logistics
  'in-transit':   'info',
  'delivered':    'success',
  'idle':         'neutral',
  'maintenance':  'warning',
  'cancelled':    'danger',

  // Security / Gate
  'cleared':      'success',
  'pending':      'warning',
  'rejected':     'danger',
  'active':       'info',
  'inactive':     'neutral',
  'signed-out':   'neutral',

  // Finance
  'paid':         'success',
  'partial':      'warning',
  'overdue':      'danger',
  'draft':        'neutral',
  'sent':         'info',

  // Warehouse
  'low':          'warning',
  'critical':     'danger',
  'normal':       'success',
  'out-of-stock': 'danger',

  // Payroll / Labour
  'present':      'success',
  'absent':       'danger',
  'late':         'warning',

  // Generic
  'approved':     'success',
  'open':         'info',
  'closed':       'neutral',
}

const VARIANT_CLASS: Record<StatusVariant, string> = {
  success: 'badge badge-success',
  warning: 'badge badge-warning',
  danger:  'badge badge-danger',
  info:    'badge badge-info',
  neutral: 'badge badge-neutral',
}

const DOT_CLASS: Record<StatusVariant, string> = {
  success: 'status-dot status-dot-success',
  warning: 'status-dot status-dot-warning',
  danger:  'status-dot status-dot-danger',
  info:    'status-dot status-dot-info',
  neutral: 'status-dot status-dot-neutral',
}

interface BadgeProps {
  status: string
  className?: string
  /** Show a dot indicator alongside the label */
  withDot?: boolean
}

export function Badge({ status, className, withDot = true }: BadgeProps) {
  const key = status.toLowerCase().trim()
  const variant: StatusVariant = STATUS_MAP[key] ?? 'neutral'
  const baseClass = VARIANT_CLASS[variant]

  return (
    <span className={clsx(baseClass, className)}>
      {withDot && <span className={DOT_CLASS[variant]} />}
      {status}
    </span>
  )
}

/**
 * StatusDot — standalone dot for use in chart legends, tables, sidebar.
 * E.g. Fleet status legend on the CEO Overview donut chart.
 */
export function StatusDot({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase().trim()
  const variant: StatusVariant = STATUS_MAP[key] ?? 'neutral'
  return <span className={clsx(DOT_CLASS[variant], className)} />
}
