import { TrendingUp } from 'lucide-react'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sales } from '../../../api/finance'
import { dispatchRecord } from '../../../api/security'
import { Sale } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

export const Route = createFileRoute('/_shell/finance/sales')({
  component: SalesPage,
})

const columns: Column<Sale>[] = [
  { key: 'date', header: 'Date', sortable: true },
  { key: 'transporterName', header: 'Transporter', sortable: true },
  { key: 'amount', header: 'Amount (₦)', sortable: true, render: (row: Sale) => `₦ ${row.amount.toLocaleString()}` },
  { key: 'linkedDispatchRecordId', header: 'Dispatch Record Ref' },
]

const schema = z.object({
  linkedDispatchRecordId: z.string().optional(),
  transporterName: z.string().min(1, 'Required'),
  amount: z.number().positive('Must be > 0'),
  date: z.string().min(1, 'Required'),
})

function SalesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useQuery({ queryKey: ['sales'], queryFn: sales.list })
  const { data: dispatchRecords } = useQuery({ queryKey: ['dispatchRecord'], queryFn: dispatchRecord.list })

  const dispatchOptions = useMemo(() => {
    return (dispatchRecords || []).map(d => ({
      label: `Truck ${d.truckNo} - ${d.destination} (${d.dateTimeIn})`,
      value: d.id,
    }))
  }, [dispatchRecords])

  const filteredData = data?.filter(row => row.transporterName.toLowerCase().includes(searchTerm.toLowerCase())) || []
  const totalRevenue = filteredData.reduce((acc, row) => acc + row.amount, 0)

  const mutation = useMutation({
    mutationFn: (payload: Omit<Sale, 'id'>) => sales.create(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['sales'] }); setIsModalOpen(false) },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: { linkedDispatchRecordId: '', transporterName: '', amount: 0, date: '' },
    validators: { onChange: validateFormWithZod(schema) },
    onSubmit: async ({ value }) => { setErrorMsg(''); await mutation.mutateAsync(value) },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Sales Record</h2>
          <p className="text-sm text-text-secondary mt-1">Track revenue from dispatch and delivery operations.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Log Sale
        </Button>
      </div>

      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Total Revenue</div>
            <div className="text-lg font-bold text-status-success">₦ {totalRevenue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Transactions</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input type="text" placeholder="Search transporter..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64" />
        </div>
      </div>

      <div className="panel-table flex flex-col flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm ? "We couldn't find any sales matching your current search." : "There are currently no sales recorded in the system."}
          emptyIcon={<TrendingUp size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          actions={!searchTerm && (<Button variant="secondary" onClick={() => setIsModalOpen(true)} className="border-primary text-primary hover:text-primary-hover">Log Sale</Button>)}
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Sale">
        {errorMsg && <div className="mb-4 text-sm bg-status-danger/10 border border-status-error/20 text-status-danger font-medium p-2 rounded">{errorMsg}</div>}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="date" children={(field) => <FormField field={field as any} label="Date" type="date" />} />
          <form.Field name="transporterName" children={(field) => <FormField field={field as any} label="Transporter Name" />} />
          <form.Field name="linkedDispatchRecordId" children={(field) => (<SelectField field={field as any} label="Linked Dispatch Record (Optional)" options={[{ label: 'None', value: '' }, ...dispatchOptions]} />)} />
          <form.Field name="amount" children={(field) => <FormField field={field as any} label="Amount (₦)" type="number" />} />
          <div className="flex justify-end pt-4 border-t border-surface-border gap-2">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                {isSubmitting ? 'Logging...' : 'Log Sale'}
              </Button>
            )} />
          </div>
        </form>
      </Modal>
    </div>
  )
}
