import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { inventoryAlerts } from '../../../api/warehouse'
import { InventoryAlert } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Badge } from '../../../components/ui/Badge'
import { CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/_shell/warehouse/alerts')({
  component: AlertsPage,
})

const columnHelper = createColumnHelper<InventoryAlert>()

const columns = [
  columnHelper.accessor('grainType', { header: 'Grain Type' }),
  columnHelper.accessor('currentQty', { header: 'Current Qty (kg)', cell: info => info.getValue().toLocaleString() }),
  columnHelper.accessor('thresholdQty', { header: 'Threshold (kg)', cell: info => info.getValue().toLocaleString() }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <Badge status={info.getValue()} />
  }),
  columnHelper.accessor('lastUpdated', { header: 'Last Updated' }),
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

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Inventory Alerts</h2>
          <p className="text-sm text-text-secondary mt-1">Monitor low stock and critical capacity thresholds.</p>
        </div>
      </div>

      {/* Summary Strip & Filters */}
      <div className="bg-surface p-3 rounded-none shadow-none border-2 border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
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

      <div className="bg-surface rounded-none shadow-none border-2 border-surface-border overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-surface-border border-t-primary rounded-full animate-spin"></div>
            <div className="text-sm font-medium text-text-muted">Loading alerts...</div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-surface-border border-b border-surface-border">
            <thead className="bg-surface-muted">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-3 text-left text-[0.7rem] font-bold text-text-secondary uppercase tracking-wider border-b border-surface-border font-header">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-surface divide-y divide-surface-border text-sm">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-surface-active/60 transition-colors group cursor-pointer">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-text-primary border-b border-surface-border/50">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <CheckCircle size={48} className="text-status-success mb-2" strokeWidth={1.5} />
                      <h3 className="text-base font-bold text-primary font-header">Stock Levels Optimal</h3>
                      <p className="text-sm text-text-muted max-w-sm">
                        {searchTerm 
                          ? "No alerts match your current search."
                          : "There are currently no low-stock or critical inventory alerts. All grain balances are within safe thresholds."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

