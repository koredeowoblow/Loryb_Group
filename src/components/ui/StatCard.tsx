import React from 'react'
import clsx from 'clsx'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  /** Trend chip rendered inline with the value */
  trend?: {
    delta: number        // positive = up, negative = down
    label?: string       // e.g. "vs last week"
    higherIsBetter?: boolean  // default true
  }
  icon?: React.ReactNode
  /** Renders the card in the danger/alert palette */
  alert?: boolean
  /** Hero variant: full navy bg, white text — used for primary KPI */
  hero?: boolean
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  alert,
  hero,
  className,
}: StatCardProps) {
  const isPositive = trend
    ? (trend.higherIsBetter !== false ? trend.delta >= 0 : trend.delta <= 0)
    : false

  return (
    <div
      className={clsx(
        // Base: use .card from index.css (surface-raised + rounded-md + shadow-md + border)
        'card card-hover flex flex-col p-6',
        hero && 'bg-primary border-primary shadow-lg',
        alert && 'border-status-danger bg-status-danger/5',
        className,
      )}
    >
      {/* Header row */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <p className={clsx('text-sm font-semibold truncate', hero ? 'text-text-inverse/80' : 'text-text-secondary')}>
          {title}
        </p>
        {icon && (
          <span className={clsx('opacity-60', hero ? 'text-text-inverse' : alert ? 'text-status-danger' : 'text-text-muted')}>
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <p className={clsx(
        'text-2xl font-bold tracking-tight truncate',
        hero ? 'text-text-inverse' : alert ? 'text-status-danger' : 'text-text-primary'
      )}>
        {value}
      </p>

      {/* Footer: subtitle + trend */}
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {trend && (
            <span className={clsx(
              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-sm',
              isPositive
                ? 'text-status-success bg-status-success/10'
                : 'text-status-danger bg-status-danger/10'
            )}>
              {trend.delta >= 0 ? '↑' : '↓'} {Math.abs(trend.delta)}
              {trend.label && <span className="font-normal opacity-80 ml-0.5">{trend.label}</span>}
            </span>
          )}
          {subtitle && (
            <span className={clsx('text-xs', hero ? 'text-text-inverse/60' : 'text-text-muted')}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
