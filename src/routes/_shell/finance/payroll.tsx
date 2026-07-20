import { Users } from 'lucide-react'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { payroll } from '../../../api/finance'
import { PayrollEntry } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

export const Route = createFileRoute('/_shell/finance/payroll')({
  component: PayrollPage,
})

const columns: Column<PayrollEntry>[] = [
  { key: 'period', header: 'Period', sortable: true },
  { key: 'staffName', header: 'Staff Name', sortable: true },
  { key: 'department', header: 'Department', sortable: true },
  { key: 'daysPresent', header: 'Days Present' },
  { key: 'amount', header: 'Amount (₦)', sortable: true, render: (row: PayrollEntry) => `₦ ${row.amount.toLocaleString()}` },
]

const schema = z.object({
  staffName: z.string().min(1, 'Required'),
  department: z.string().min(1, 'Required'),
  daysPresent: z.number().min(0, 'Must be >= 0').max(31, 'Max 31 days'),
  amount: z.number().positive('Must be > 0'),
  period: z.string().min(1, 'Required'),
})

function PayrollPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [periodFilter, setPeriodFilter] = useState('All')

  const { data, isLoading } = useQuery({ queryKey: ['payroll'], queryFn: payroll.list })

  const periods = useMemo(() => {
    if (!data) return []
    return Array.from(new Set(data.map(d => d.period))).sort((a, b) => b.localeCompare(a))
  }, [data])

  const filteredData = data?.filter(row => {
    const matchesSearch = row.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || row.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPeriod = periodFilter === 'All' || row.period === periodFilter
    return matchesSearch && matchesPeriod
  }) || []

  const totalPayroll = filteredData.reduce((acc, row) => acc + row.amount, 0)

  const mutation = useMutation({
    mutationFn: (payload: Omit<PayrollEntry, 'id'>) => payroll.create(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['payroll'] }); setIsModalOpen(false) },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: { staffName: '', department: '', daysPresent: 0, amount: 0, period: '' },
    validators: { onChange: validateFormWithZod(schema) },
    onSubmit: async ({ value }) => { setErrorMsg(''); await mutation.mutateAsync(value) },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Payroll Registry</h2>
          <p className="text-sm text-text-secondary mt-1">Manage employee compensation and attendance records.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Log Payroll</Button>
      </div>

      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Total Payroll</div>
            <div className="text-lg font-bold text-primary">₦ {totalPayroll.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Staff Processed</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input type="text" placeholder="Search staff or department..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64" />
          <Select value={periodFilter} onChange={e => setPeriodFilter(e.target.value)}>
            <option value="All">All Periods</option>
            {periods.map((p: string) => <option key={p} value={p}>{p}</option>)}
          </Select>
        </div>
      </div>

      <div className="panel-table flex flex-col flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm || periodFilter !== 'All' ? "No records match your current filters." : "No payroll records yet. Log the first entry."}
          emptyIcon={<Users size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          actions={(!searchTerm && periodFilter === 'All') && (<Button variant="secondary" onClick={() => setIsModalOpen(true)} className="border-primary text-primary hover:text-primary-hover">Log Payroll</Button>)}
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Payroll Entry">
        {errorMsg && <div className="mb-4 text-sm bg-status-danger/10 border border-status-error/20 text-status-danger font-medium p-2 rounded">{errorMsg}</div>}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="period" children={(field) => <FormField field={field as any} label="Period (e.g. 2026-07)" />} />
          <form.Field name="staffName" children={(field) => <FormField field={field as any} label="Staff Name" />} />
          <form.Field name="department" children={(field) => <FormField field={field as any} label="Department" />} />
          <form.Field name="daysPresent" children={(field) => <FormField field={field as any} label="Days Present" type="number" />} />
          <form.Field name="amount" children={(field) => <FormField field={field as any} label="Amount (₦)" type="number" />} />
          <div className="flex justify-end pt-4 border-t border-surface-border gap-2">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Process Payroll'}
              </Button>
            )} />
          </div>
        </form>
      </Modal>
    </div>
  )
}
