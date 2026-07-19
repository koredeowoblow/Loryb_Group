import { createFileRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import clsx from 'clsx'

export const Route = createFileRoute('/_shell/security')({
  component: SecurityLayout,
})

function SecurityLayout() {
  const router = useRouterState()
  const currentPath = router.location.pathname

  const tabs = [
    { label: 'Gate Log', to: '/security/gate-log' },
    { label: 'Suppliers', to: '/security/suppliers' },
    { label: 'Dispatch', to: '/security/dispatch' },
    { label: 'Logs', to: '/security/logs' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 border-b border-surface-border">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = currentPath.startsWith(tab.to)
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={clsx(
                  'whitespace-nowrap pb-4 px-1 border-b-2 font-bold font-header uppercase tracking-wider text-xs transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text-primary hover:border-surface-border'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

