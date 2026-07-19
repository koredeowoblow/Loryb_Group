import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { inventoryAlerts } from '../../../api/warehouse'
import { InventoryAlert } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Badge } from '../../../components/ui/Badge'
import { CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/_shell/warehouse/alerts')({
  component: AlertsPage,
})

const columns: Column<InventoryAlert>[] = [
  { key: 'grainType', header: 'Grain Type', sortable: true },
  { key: 'currentQty', header: 'Current Qty (kg)', sortable: true, render: (row: InventoryAlert) => row.currentQty.toLocaleString() },
  { key: 'thresholdQty', header: 'Threshold (kg)', render: (row: InventoryAlert) => row.thresholdQty.toLocaleString() },
  { key: 'status', header: 'Status', render: (row: InventoryAlert) => <Badge status={row.status as any} /> },
  { key: 'lastUpdated', header: 'Last Updated', sortable: true },
]

function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['inventoryAlerts'],
    queryFn: inventoryAlerts.list,
  })

  const filteredData = data?.filter(row => 
    row.grainType.toLowerCase().includes(searchTerm.toLowerCase()) || 
    row.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const criticalCount = filteredData.filter(a => a.status === 'critical').length

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Inventory Alerts</h2>
          <p className="text-sm text-text-secondary mt-1">Monitor low stock and critical capacity thresholds.</p>
        </div>
      </div>

      {/* Summary Strip & Filters */}
      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Alerts</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-status-error font-header">Critical</div>
            <div className="text-lg font-bold text-status-error">{criticalCount}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search grain or status..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="panel-table flex flex-col min-h-[400px]">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm 
            ? "No alerts match your current search."
            : "There are currently no low-stock or critical inventory alerts. All grain balances are within safe thresholds."}
          emptyIcon={<CheckCircle size={48} className="text-status-success mb-2" strokeWidth={1.5} />}
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>
    </div>
  )
}
