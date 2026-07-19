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
        <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light">
          Log Sale
        </button>
      </div>

      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Revenue</div>
            <div className="text-lg font-bold text-status-success">₦ {totalRevenue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Transactions</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input type="text" placeholder="Search transporter..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors" />
        </div>
      </div>

      <div className="panel-table flex flex-col min-h-[500px]">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm ? "We couldn't find any sales matching your current search." : "There are currently no sales recorded in the system."}
          emptyIcon={<TrendingUp size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          actions={!searchTerm && (<button onClick={() => setIsModalOpen(true)} className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors">Log Sale</button>)}
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Sale">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="date" children={(field) => <FormField field={field as any} label="Date" type="date" />} />
          <form.Field name="transporterName" children={(field) => <FormField field={field as any} label="Transporter Name" />} />
          <form.Field name="linkedDispatchRecordId" children={(field) => (<SelectField field={field as any} label="Linked Dispatch Record (Optional)" options={[{ label: 'None', value: '' }, ...dispatchOptions]} />)} />
          <form.Field name="amount" children={(field) => <FormField field={field as any} label="Amount (₦)" type="number" />} />
          <div className="flex justify-end pt-4 border-t border-surface-border gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors">Cancel</button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit || isSubmitting} className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-white bg-primary hover:bg-primary-hover rounded shadow-sm border border-primary-light disabled:opacity-50 transition-colors">
                {isSubmitting ? 'Logging...' : 'Log Sale'}
              </button>
            )} />
          </div>
        </form>
      </Modal>
    </div>
  )
}
