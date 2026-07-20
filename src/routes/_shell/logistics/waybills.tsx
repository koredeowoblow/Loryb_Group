import { FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { waybills } from '../../../api/logistics'
import { Waybill } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/logistics/waybills')({
  component: WaybillsPage,
})

const columns: Column<Waybill>[] = [
  { key: 'continentalWaybillNo', header: 'Continental Waybill', sortable: true },
  { key: 'lbWaybillNo', header: 'Loryb Waybill', sortable: true },
  { key: 'truckNo', header: 'Truck No', sortable: true, render: (row: Waybill) => <span className="font-bold text-primary">{row.truckNo}</span> },
  { key: 'destination', header: 'Destination' },
  { key: 'dateIssued', header: 'Date Issued', sortable: true },
  { key: 'status', header: 'Status', render: (row: Waybill) => <Badge status={row.status as any} /> },
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Waybill Tracker</h2>
          <p className="text-sm text-text-secondary mt-1">Monitor all internal and continental delivery documents.</p>
        </div>
      </div>

      {/* Summary Strip & Filters */}
      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Total Waybills</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-status-warning font-header">Active Transit</div>
            <div className="text-lg font-bold text-status-warning">{activeWaybills}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search waybill or truck no..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="panel-table flex flex-col flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm || statusFilter !== 'All' 
            ? "No waybills match your current filters."
            : "There are currently no generated waybills in the system."}
          emptyIcon={<FileSpreadsheet size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>
    </div>
  )
}
