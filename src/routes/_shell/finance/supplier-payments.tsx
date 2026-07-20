import { CreditCard } from 'lucide-react'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supplierPayments } from '../../../api/finance'
import { suppliers as suppliersApi } from '../../../api/security'
import { SupplierPayment } from '../../../types'
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

export const Route = createFileRoute('/_shell/finance/supplier-payments')({
  component: SupplierPaymentsPage,
})

const columns: Column<SupplierPayment>[] = [
  { key: 'date', header: 'Date', sortable: true },
  { key: 'supplierName', header: 'Supplier Name', sortable: true },
  { key: 'amountOwed', header: 'Amount Owed (₦)', sortable: true, render: (row: SupplierPayment) => `₦ ${row.amountOwed.toLocaleString()}` },
  { key: 'amountPaid', header: 'Amount Paid (₦)', render: (row: SupplierPayment) => `₦ ${row.amountPaid.toLocaleString()}` },
  { key: 'status', header: 'Status', render: (row: SupplierPayment) => <Badge status={row.status as any} /> },
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

  const { data, isLoading } = useQuery({ queryKey: ['supplierPayments'], queryFn: supplierPayments.list })
  const { data: suppliers } = useQuery({ queryKey: ['suppliers'], queryFn: suppliersApi.list })

  const supplierRecordOptions = useMemo(() => (suppliers || []).map(s => ({ label: `${s.supplierName} (${s.dateTimeIn})`, value: s.id })), [suppliers])

  const filteredData = data?.filter(row => {
    const matchesSearch = row.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const totalOwed = filteredData.reduce((acc, row) => acc + row.amountOwed, 0)
  const totalPaid = filteredData.reduce((acc, row) => acc + row.amountPaid, 0)
  const outstanding = totalOwed - totalPaid

  const mutation = useMutation({
    mutationFn: (payload: Omit<SupplierPayment, 'id'>) => supplierPayments.create(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['supplierPayments'] }); setIsModalOpen(false) },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: { supplierName: '', linkedSuppliersRecordId: '', amountOwed: 0, amountPaid: 0, status: 'pending', date: '' },
    validators: { onChange: validateFormWithZod(schema) },
    onSubmit: async ({ value }) => { setErrorMsg(''); await mutation.mutateAsync(value as Omit<SupplierPayment, 'id'>) },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Supplier Payments</h2>
          <p className="text-sm text-text-secondary mt-1">Manage accounts payable for all supply operations.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Log Payment</Button>
      </div>

      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div><div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Total Owed</div><div className="text-lg font-bold text-primary">₦ {totalOwed.toLocaleString()}</div></div>
          <div><div className="text-xs uppercase tracking-wider font-bold text-status-success font-header">Total Paid</div><div className="text-lg font-bold text-status-success">₦ {totalPaid.toLocaleString()}</div></div>
          <div><div className="text-xs uppercase tracking-wider font-bold text-status-danger font-header">Outstanding</div><div className="text-lg font-bold text-status-danger">₦ {outstanding.toLocaleString()}</div></div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input type="text" placeholder="Search supplier name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64" />
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </Select>
        </div>
      </div>

      <div className="panel-table flex flex-col flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm || statusFilter !== 'All' ? "No payments match your current filters." : "No supplier payment records yet."}
          emptyIcon={<CreditCard size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          actions={(!searchTerm && statusFilter === 'All') && (<Button variant="secondary" onClick={() => setIsModalOpen(true)} className="border-primary text-primary hover:text-primary-hover">Log Payment</Button>)}
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Supplier Payment">
        {errorMsg && <div className="mb-4 text-sm bg-status-danger/10 border border-status-error/20 text-status-danger font-medium p-2 rounded">{errorMsg}</div>}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="date" children={(field) => <FormField field={field as any} label="Date" type="date" />} />
          <form.Field name="supplierName" children={(field) => <FormField field={field as any} label="Supplier Name" />} />
          <form.Field name="linkedSuppliersRecordId" children={(field) => (<SelectField field={field as any} label="Linked Supplier Record (Optional)" options={[{ label: 'None', value: '' }, ...supplierRecordOptions]} />)} />
          <form.Field name="amountOwed" children={(field) => <FormField field={field as any} label="Amount Owed (₦)" type="number" />} />
          <form.Field name="amountPaid" children={(field) => <FormField field={field as any} label="Amount Paid (₦)" type="number" />} />
          <form.Field name="status" children={(field) => (<SelectField field={field as any} label="Status" options={[{ label: 'Pending', value: 'pending' }, { label: 'Partial', value: 'partial' }, { label: 'Paid', value: 'paid' }]} />)} />
          <div className="flex justify-end pt-4 border-t border-surface-border gap-2">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                {isSubmitting ? 'Authorizing...' : 'Authorize Payment'}
              </Button>
            )} />
          </div>
        </form>
      </Modal>
    </div>
  )
}
