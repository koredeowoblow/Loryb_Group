import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { waybills } from '../../../api/logistics'
import { Waybill } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/logistics/waybills')({
  component: WaybillsPage,
})

const columnHelper = createColumnHelper<Waybill>()

const columns = [
  columnHelper.accessor('continentalWaybillNo', { header: 'Continental Waybill' }),
  columnHelper.accessor('lbWaybillNo', { header: 'Loryb Waybill' }),
  columnHelper.accessor('truckNo', { header: 'Truck No' }),
  columnHelper.accessor('destination', { header: 'Destination' }),
  columnHelper.accessor('dateIssued', { header: 'Date Issued' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <Badge status={info.getValue()} />
  }),
]

function WaybillsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['waybills'],
    queryFn: waybills.list,
  })

  const filteredData = data?.filter(row => {
    const matchesSearch = 
      row.continentalWaybillNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      row.lbWaybillNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      row.truckNo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const activeWaybills = filteredData.filter(w => (w.status as string) === 'in-transit').length

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Waybill Tracker</h2>
          <p className="text-sm text-text-secondary mt-1">Monitor all internal and continental delivery documents.</p>
        </div>
      </div>

      {/* Summary Strip & Filters */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Waybills</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-status-warning font-header">Active Transit</div>
            <div className="text-lg font-bold text-status-warning">{activeWaybills}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search waybill or truck no..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-surface-border overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-surface-border border-t-primary rounded-full animate-spin"></div>
            <div className="text-sm font-medium text-text-muted">Loading waybills...</div>
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
            <tbody className="bg-white divide-y divide-surface-border text-sm">
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
                      <div className="text-4xl text-surface-border mb-2">📄</div>
                      <h3 className="text-base font-bold text-primary font-header">No waybills found</h3>
                      <p className="text-sm text-text-muted max-w-sm">
                        {searchTerm || statusFilter !== 'All'
                          ? "No waybills match your current filters."
                          : "There are currently no generated waybills in the system."}
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
