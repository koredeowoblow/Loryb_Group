import clsx from 'clsx'

type BadgeProps = {
  status: string
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  const norm = status.toLowerCase()
  
  let colorClass = 'bg-surface-border text-text-secondary' // default
  
  if (norm.includes('pending') || norm.includes('partial') || norm.includes('maintenance')) {
    colorClass = 'bg-status-pending/10 text-status-pending-dark border border-status-pending/20'
  } else if (norm.includes('transit') || norm.includes('active') || norm.includes('sent')) {
    colorClass = 'bg-status-intransit/10 text-status-intransit-dark border border-status-intransit/20'
  } else if (norm.includes('success') || norm.includes('paid') || norm.includes('delivered') || norm.includes('idle')) {
    colorClass = 'bg-status-success/10 text-status-success-dark border border-status-success/20'
  } else if (norm.includes('error') || norm.includes('overdue') || norm.includes('critical')) {
    colorClass = 'bg-status-error/10 text-status-error-dark border border-status-error/20'
  } else if (norm.includes('draft') || norm.includes('inactive')) {
    colorClass = 'bg-status-draft/10 text-status-draft-dark border border-status-draft/20'
  }

  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-bold tracking-widest uppercase font-header", colorClass, className)}>
      {status}
    </span>
  )
}
