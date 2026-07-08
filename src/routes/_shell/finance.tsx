import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_shell/finance')({
  component: FinanceLayout,
})

function FinanceLayout() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Finance & Administration</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
