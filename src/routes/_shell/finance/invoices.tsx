import { FileText } from 'lucide-react'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invoices as invoicesApi, sales as salesApi, supplierPayments as supplierPaymentsApi } from '../../../api/finance'
import { Invoice } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

export const Route = createFileRoute('/_shell/finance/invoices')({
  component: InvoicesPage,
})

const columns: Column<Invoice>[] = [
  { key: 'invoiceNo', header: 'Invoice No', sortable: true },
  { key: 'partyName', header: 'Party Name', sortable: true },
  { key: 'issueDate', header: 'Issue Date', sortable: true },
  { key: 'dueDate', header: 'Due Date', sortable: true },
  { key: 'amount', header: 'Amount (₦)', sortable: true, render: (row: Invoice) => `₦ ${row.amount.toLocaleString()}` },
  { key: 'status', header: 'Status', render: (row: Invoice) => <Badge status={row.status as any} /> },
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

  const { data, isLoading } = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list })
  const { data: sales } = useQuery({ queryKey: ['sales'], queryFn: salesApi.list })
  const { data: supplierPayments } = useQuery({ queryKey: ['supplierPayments'], queryFn: supplierPaymentsApi.list })

  const salesOptions = useMemo(() => (sales || []).map(s => ({ label: `${s.transporterName} - ₦${s.amount}`, value: s.id })), [sales])
  const supplierOptions = useMemo(() => (supplierPayments || []).map(s => ({ label: `${s.supplierName} - ₦${s.amountOwed}`, value: s.id })), [supplierPayments])

  const filteredData = data?.filter(row => {
    const matchesSearch = row.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) || row.partyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const totalInvoiced = filteredData.reduce((acc, row) => acc + row.amount, 0)
  const pendingAmount = filteredData.filter(r => r.status === 'sent' || r.status === 'draft').reduce((acc, row) => acc + row.amount, 0)
  const overdueAmount = filteredData.filter(r => r.status === 'overdue').reduce((acc, row) => acc + row.amount, 0)

  const mutation = useMutation({
    mutationFn: (payload: Omit<Invoice, 'id'>) => invoicesApi.create(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['invoices'] }); setIsModalOpen(false) },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: { invoiceNo: '', linkedSaleId: '', linkedSupplierPaymentId: '', partyName: '', amount: 0, issueDate: '', dueDate: '', status: 'draft' as const },
    validators: { onChange: validateFormWithZod(schema) },
    onSubmit: async ({ value }) => { setErrorMsg(''); await mutation.mutateAsync(value) },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Invoicing & Billing</h2>
          <p className="text-sm text-text-secondary mt-1">Manage outbound invoices and track payment status.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Create Invoice</Button>
      </div>

      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div><div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Total Invoiced</div><div className="text-lg font-bold text-primary">₦ {totalInvoiced.toLocaleString()}</div></div>
          <div><div className="text-xs uppercase tracking-wider font-bold text-status-warning font-header">Pending</div><div className="text-lg font-bold text-status-warning">₦ {pendingAmount.toLocaleString()}</div></div>
          <div><div className="text-xs uppercase tracking-wider font-bold text-status-danger font-header">Overdue</div><div className="text-lg font-bold text-status-danger">₦ {overdueAmount.toLocaleString()}</div></div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input type="text" placeholder="Search invoice or party..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64" />
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </Select>
        </div>
      </div>

      <div className="panel-table flex flex-col flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm || statusFilter !== 'All' ? "No invoices match your current filters." : "No invoices in the system yet."}
          emptyIcon={<FileText size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          actions={(!searchTerm && statusFilter === 'All') && (<Button variant="secondary" onClick={() => setIsModalOpen(true)} className="border-primary text-primary hover:text-primary-hover">Create Invoice</Button>)}
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Invoice">
        {errorMsg && <div className="mb-4 text-sm bg-status-danger/10 border border-status-error/20 text-status-danger font-medium p-2 rounded">{errorMsg}</div>}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="invoiceNo" children={(field) => <FormField field={field as any} label="Invoice No" />} />
          <form.Field name="partyName" children={(field) => <FormField field={field as any} label="Party Name" />} />
          <form.Field name="issueDate" children={(field) => <FormField field={field as any} label="Issue Date" type="date" />} />
          <form.Field name="dueDate" children={(field) => <FormField field={field as any} label="Due Date" type="date" />} />
          <form.Field name="amount" children={(field) => <FormField field={field as any} label="Amount (₦)" type="number" />} />
          <form.Field name="status" children={(field) => (<SelectField field={field as any} label="Status" options={[{ label: 'Draft', value: 'draft' }, { label: 'Sent', value: 'sent' }, { label: 'Paid', value: 'paid' }, { label: 'Overdue', value: 'overdue' }]} />)} />
          <form.Field name="linkedSaleId" children={(field) => (<SelectField field={field as any} label="Linked Sale (Optional)" options={[{ label: 'None', value: '' }, ...salesOptions]} />)} />
          <form.Field name="linkedSupplierPaymentId" children={(field) => (<SelectField field={field as any} label="Linked Supplier Payment (Optional)" options={[{ label: 'None', value: '' }, ...supplierOptions]} />)} />
          <div className="flex justify-end pt-4 border-t border-surface-border gap-2">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                {isSubmitting ? 'Issuing...' : 'Issue Invoice'}
              </Button>
            )} />
          </div>
        </form>
      </Modal>
    </div>
  )
}
