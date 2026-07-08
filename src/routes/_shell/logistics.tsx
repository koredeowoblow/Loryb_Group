import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_shell/logistics')({
  component: LogisticsLayout,
})

function LogisticsLayout() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Logistics Operations</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
