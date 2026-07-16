const fs = require('fs');

const waybillsFile = 'src/routes/_shell/logistics/waybills.tsx';
const waybillsContent = `import { FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { waybills } from '../../../api/logistics'
import { Waybill } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Badge } from '../../../components/ui/Badge'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { validateFormWithZod } from '../../../lib/zodValidator'

export const Route = createFileRoute('/_shell/logistics/waybills')({
  component: WaybillsPage,
})

const columnHelper = createColumnHelper<Waybill>()

const schema = z.object({
  continentalWaybillNo: z.string().min(1, 'Required'),
  lbWaybillNo: z.string().min(1, 'Required'),
  linkedTripId: z.string().min(1, 'Required'),
  truckNo: z.string().min(1, 'Required'),
  destination: z.string().min(1, 'Required'),
  dateIssued: z.string().min(1, 'Required'),
  status: z.enum(['active', 'closed']),
})

function WaybillsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Waybill | null>(null)
  const [deleteId, setDeleteId] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['waybills'],
    queryFn: waybills.list,
  })

  const createMutation = useMutation({
    mutationFn: (payload: Omit<Waybill, 'id'>) => waybills.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waybills'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) => waybills.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waybills'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to update record.')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => waybills.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waybills'] })
      setDeleteId('')
    }
  })

  const form = useForm({
    defaultValues: {
      continentalWaybillNo: editingRecord?.continentalWaybillNo || '',
      lbWaybillNo: editingRecord?.lbWaybillNo || '',
      linkedTripId: editingRecord?.linkedTripId || '',
      truckNo: editingRecord?.truckNo || '',
      destination: editingRecord?.destination || '',
      dateIssued: editingRecord?.dateIssued || '',
      status: editingRecord?.status || 'active',
    },
    validators: { onChange: validateFormWithZod(schema) },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      if (editingRecord) {
        await updateMutation.mutateAsync({ id: editingRecord.id, payload: value })
      } else {
        await createMutation.mutateAsync(value)
      }
    }
  })

  const handleEdit = (record: Waybill) => {
    setEditingRecord(record)
    form.reset()
    form.setFieldValue('continentalWaybillNo', record.continentalWaybillNo)
    form.setFieldValue('lbWaybillNo', record.lbWaybillNo)
    form.setFieldValue('linkedTripId', record.linkedTripId)
    form.setFieldValue('truckNo', record.truckNo)
    form.setFieldValue('destination', record.destination)
    form.setFieldValue('dateIssued', record.dateIssued)
    form.setFieldValue('status', record.status)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingRecord(null)
    form.reset()
    setIsModalOpen(true)
  }

  const columns = [
    columnHelper.accessor('continentalWaybillNo', { header: 'Continental Waybill' }),
    columnHelper.accessor('lbWaybillNo', { header: 'Loryb Waybill' }),
    columnHelper.accessor('truckNo', { header: 'Truck No' }),
    columnHelper.accessor('destination', { header: 'Destination' }),
    columnHelper.accessor('dateIssued', { header: 'Date Issued' }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => <Badge status={info.getValue() as string} />
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleEdit(info.row.original)} className="text-primary hover:text-primary-hover font-bold font-header text-xs uppercase tracking-wider p-1 transition-colors">
            Edit
          </button>
          <button onClick={() => setDeleteId(info.row.original.id)} className="text-status-error hover:text-status-error-dark font-bold font-header text-xs uppercase tracking-wider p-1 transition-colors">
            Delete
          </button>
        </div>
      )
    })
  ]

  const filteredData = data?.filter(row => {
    const matchesSearch = 
      row.continentalWaybillNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      row.lbWaybillNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      row.truckNo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const activeWaybills = filteredData.filter(w => (w.status as string) === 'in-transit' || (w.status as string) === 'active').length

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
        <button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Issue Waybill
        </button>
      </div>

      <div className="bg-surface p-3 rounded-none shadow-none border-2 border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
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
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-surface rounded-none shadow-none border-2 border-surface-border overflow-hidden overflow-x-auto">
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
            <tbody className="bg-surface divide-y divide-surface-border text-sm">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-surface-active/60 transition-colors group">
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
                      <FileSpreadsheet size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRecord ? "Edit Waybill" : "Issue Waybill"}>
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field name="continentalWaybillNo" children={(field) => <FormField field={field} label="Continental Waybill" />} />
            <form.Field name="lbWaybillNo" children={(field) => <FormField field={field} label="Loryb Waybill" />} />
            <form.Field name="linkedTripId" children={(field) => <FormField field={field} label="Linked Trip ID" />} />
            <form.Field name="truckNo" children={(field) => <FormField field={field} label="Truck No" />} />
            <form.Field name="destination" children={(field) => <FormField field={field} label="Destination" />} />
            <form.Field name="dateIssued" children={(field) => <DateTimeField field={field} label="Date Issued" />} />
            <form.Field name="status" children={(field) => (
              <SelectField field={field} label="Status" options={[
                { label: 'Active', value: 'active' },
                { label: 'Closed', value: 'closed' }
              ]} />
            )} />
          </div>
          
          {errorMsg && <div className="text-status-error text-sm mt-2">{errorMsg}</div>}
          
          <div className="pt-4 border-t border-surface-border flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors">
              Cancel
            </button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit || isSubmitting} className="px-4 py-2 text-xs font-bold font-header uppercase tracking-wider text-white bg-primary hover:bg-primary-hover rounded shadow-sm border border-primary-light transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : (editingRecord ? 'Update Waybill' : 'Issue Waybill')}
              </button>
            )} />
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId('')} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Are you sure you want to delete this waybill? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-surface-border">
            <button onClick={() => setDeleteId('')} className="px-4 py-2 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors">
              Cancel
            </button>
            <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} className="px-4 py-2 text-xs font-bold font-header uppercase tracking-wider text-white bg-status-error hover:bg-status-error-dark rounded shadow-sm border border-status-error-dark transition-colors disabled:opacity-50">
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Waybill'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
`;

fs.writeFileSync(waybillsFile, waybillsContent);
`
