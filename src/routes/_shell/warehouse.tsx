import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_shell/warehouse')({
  component: WarehouseLayout,
})

function WarehouseLayout() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Warehouse Operations</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
