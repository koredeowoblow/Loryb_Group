import { createFileRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import clsx from 'clsx'

export const Route = createFileRoute('/_shell/security')({
  component: SecurityLayout,
})

function SecurityLayout() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Security Operations</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

