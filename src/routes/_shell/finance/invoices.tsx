import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, Invoice } from '../../../api'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/finance/invoices')({
  component: InvoicesPage,
})

const columnHelper = createColumnHelper<Invoice>()

const columns = [
  columnHelper.accessor('invoiceNo', { header: 'Invoice No' }),
  columnHelper.accessor('partyName', { header: 'Party Name' }),
  columnHelper.accessor('issueDate', { header: 'Issue Date' }),
  columnHelper.accessor('dueDate', { header: 'Due Date' }),
  columnHelper.accessor('amount', { header: 'Amount (₦)' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <Badge status={info.getValue() as string} />
  }),
]

const schema = z.object({
  invoiceNo: z.string().min(1, 'Required'),
  linkedSaleId: z.string().optional(),
  linkedSupplierPaymentId: z.string().optional(),
  partyName: z.string().min(1, 'Required'),
  amount: z.number().positive('Must be > 0'),
  issueDate: z.string().min(1, 'Required'),
  dueDate: z.string().min(1, 'Required'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
})

function InvoicesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: api.invoices.list,
  })

  const { data: sales } = useQuery({
    queryKey: ['sales'],
    queryFn: api.sales.list,
  })

  const { data: supplierPayments } = useQuery({
    queryKey: ['supplierPayments'],
    queryFn: api.supplierPayments.list,
  })

  const salesOptions = useMemo(() => {
    return (sales || []).map(s => ({
      label: `${s.transporterName} - ₦${s.amount}`,
      value: s.id,
    }))
  }, [sales])

  const supplierOptions = useMemo(() => {
    return (supplierPayments || []).map(s => ({
      label: `${s.supplierName} - ₦${s.amountOwed}`,
      value: s.id,
    }))
  }, [supplierPayments])

  const filteredData = data?.filter(row => {
    const matchesSearch = row.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.partyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const totalInvoiced = filteredData.reduce((acc, row) => acc + row.amount, 0)
  const pendingAmount = filteredData.filter(r => r.status === 'sent' || r.status === 'draft').reduce((acc, row) => acc + row.amount, 0)
  const overdueAmount = filteredData.filter(r => r.status === 'overdue').reduce((acc, row) => acc + row.amount, 0)

  const mutation = useMutation({
    mutationFn: (payload: Omit<Invoice, 'id'>) => api.invoices.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
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
      invoiceNo: '',
      linkedSaleId: '',
      linkedSupplierPaymentId: '',
      partyName: '',
      amount: 0,
      issueDate: '',
      dueDate: '',
      status: 'draft',
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
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Invoicing & Billing</h2>
          <p className="text-sm text-text-secondary mt-1">Manage outbound invoices and track payment status.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Create Invoice
        </button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Invoiced</div>
            <div className="text-lg font-bold text-primary">₦ {totalInvoiced.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-status-warning font-header">Pending</div>
            <div className="text-lg font-bold text-status-warning">₦ {pendingAmount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-status-error font-header">Overdue</div>
            <div className="text-lg font-bold text-status-error">₦ {overdueAmount.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search invoice or party..."
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-surface-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-surface-border border-t-primary rounded-full animate-spin"></div>
            <div className="text-sm font-medium text-text-muted">Loading invoices...</div>
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
                      <div className="text-4xl text-surface-border mb-2">🧾</div>
                      <h3 className="text-base font-bold text-primary font-header">No invoices found</h3>
                      <p className="text-sm text-text-muted max-w-sm">
                        {searchTerm || statusFilter !== 'All' 
                          ? "We couldn't find any invoices matching your current filters. Try adjusting your search criteria."
                          : "There are currently no invoices in the system."}
                      </p>
                      {(!searchTerm && statusFilter === 'All') && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
                        >
                          Create Invoice
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Invoice">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="invoiceNo" children={(field) => <FormField field={field as any} label="Invoice No" />} />
          <form.Field name="partyName" children={(field) => <FormField field={field as any} label="Party Name" />} />
          
          <form.Field name="issueDate" children={(field) => <FormField field={field as any} label="Issue Date" type="date" />} />
          <form.Field name="dueDate" children={(field) => <FormField field={field as any} label="Due Date" type="date" />} />
          <form.Field name="amount" children={(field) => <FormField field={field as any} label="Amount (₦)" type="number" />} />
          
          <form.Field name="status" children={(field) => (
            <SelectField field={field as any} label="Status" options={[
              { label: 'Draft', value: 'draft' },
              { label: 'Sent', value: 'sent' },
              { label: 'Paid', value: 'paid' },
              { label: 'Overdue', value: 'overdue' },
            ]} />
          )} />

          <form.Field name="linkedSaleId" children={(field) => (
            <SelectField field={field as any} label="Linked Sale (Optional)" options={[{ label: 'None', value: '' }, ...salesOptions]} />
          )} />
          <form.Field name="linkedSupplierPaymentId" children={(field) => (
            <SelectField field={field as any} label="Linked Supplier Payment (Optional)" options={[{ label: 'None', value: '' }, ...supplierOptions]} />
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
