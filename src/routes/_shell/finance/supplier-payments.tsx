import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, SupplierPayment } from '../../../api'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/finance/supplier-payments')({
  component: SupplierPaymentsPage,
})

const columnHelper = createColumnHelper<SupplierPayment>()

const columns = [
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('supplierName', { header: 'Supplier Name' }),
  columnHelper.accessor('amountOwed', { header: 'Amount Owed (₦)' }),
  columnHelper.accessor('amountPaid', { header: 'Amount Paid (₦)' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <Badge status={info.getValue() as string} />
  }),
]

const schema = z.object({
  supplierName: z.string().min(1, 'Required'),
  linkedSuppliersRecordId: z.string().optional(),
  amountOwed: z.number().min(0, 'Must be >= 0'),
  amountPaid: z.number().min(0, 'Must be >= 0'),
  status: z.enum(['pending', 'partial', 'paid']),
  date: z.string().min(1, 'Required'),
})

function SupplierPaymentsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['supplierPayments'],
    queryFn: api.supplierPayments.list,
  })

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: api.suppliers.list,
  })

  const supplierRecordOptions = useMemo(() => {
    return (suppliers || []).map(s => ({
      label: `${s.supplierName} (${s.dateTimeIn})`,
      value: s.id,
    }))
  }, [suppliers])

  const filteredData = data?.filter(row => {
    const matchesSearch = row.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const totalOwed = filteredData.reduce((acc, row) => acc + row.amountOwed, 0)
  const totalPaid = filteredData.reduce((acc, row) => acc + row.amountPaid, 0)
  const outstanding = totalOwed - totalPaid

  const mutation = useMutation({
    mutationFn: (payload: Omit<SupplierPayment, 'id'>) => api.supplierPayments.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplierPayments'] })
      setIsModalOpen(false)
    },
    onError: () => {
      setErrorMsg('Failed to save record. Please try again.')
    }
  })

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const form = useForm({
    defaultValues: {
      supplierName: '',
      linkedSuppliersRecordId: '',
      amountOwed: 0,
      amountPaid: 0,
      status: 'pending',
      date: '',
    },
    validators: {
      onChange: schema as any,
    },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value as any)
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Supplier Payments</h2>
          <p className="text-sm text-text-secondary mt-1">Manage accounts payable for all supply operations.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Log Payment
        </button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Owed</div>
            <div className="text-lg font-bold text-primary">₦ {totalOwed.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-status-success font-header">Total Paid</div>
            <div className="text-lg font-bold text-status-success">₦ {totalPaid.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-status-error font-header">Outstanding</div>
            <div className="text-lg font-bold text-status-error">₦ {outstanding.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search supplier name..."
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
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-surface-border overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-surface-border border-t-primary rounded-full animate-spin"></div>
            <div className="text-sm font-medium text-text-muted">Loading payments...</div>
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
                      <div className="text-4xl text-surface-border mb-2">💸</div>
                      <h3 className="text-base font-bold text-primary font-header">No supplier payments found</h3>
                      <p className="text-sm text-text-muted max-w-sm">
                        {searchTerm || statusFilter !== 'All' 
                          ? "We couldn't find any payments matching your current filters. Try adjusting your search criteria."
                          : "There are currently no supplier payment records. Log the first payment."}
                      </p>
                      {(!searchTerm && statusFilter === 'All') && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
                        >
                          Log Payment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Supplier Payment">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="date" children={(field) => <FormField field={field as any} label="Date" type="date" />} />
          <form.Field name="supplierName" children={(field) => <FormField field={field as any} label="Supplier Name" />} />
          
          <form.Field name="linkedSuppliersRecordId" children={(field) => (
            <SelectField field={field as any} label="Linked Supplier Record (Optional)" options={[{ label: 'None', value: '' }, ...supplierRecordOptions]} />
          )} />
          
          <form.Field name="amountOwed" children={(field) => <FormField field={field as any} label="Amount Owed (₦)" type="number" />} />
          <form.Field name="amountPaid" children={(field) => <FormField field={field as any} label="Amount Paid (₦)" type="number" />} />
          
          <form.Field name="status" children={(field) => (
            <SelectField field={field as any} label="Status" options={[
              { label: 'Pending', value: 'pending' },
              { label: 'Partial', value: 'partial' },
              { label: 'Paid', value: 'paid' },
            ]} />
          )} />

          <div className="flex justify-end pt-4 border-t border-surface-border gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors"
            >
              Cancel
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-white bg-primary hover:bg-primary-hover rounded shadow-sm border border-primary-light disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              )}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
