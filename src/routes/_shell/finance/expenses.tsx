import { Receipt } from 'lucide-react'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expenses as expensesApi } from '../../../api/finance'
import { trucks as trucksApi } from '../../../api/logistics'
import { Expense } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'

export const Route = createFileRoute('/_shell/finance/expenses')({
  component: ExpensesPage,
})

const columns: Column<Expense>[] = [
  { key: 'date', header: 'Date', sortable: true },
  { key: 'category', header: 'Category', sortable: true },
  { key: 'description', header: 'Description' },
  { key: 'amount', header: 'Amount (₦)', sortable: true, render: (row: Expense) => `₦ ${row.amount.toLocaleString()}` },
  { key: 'paidBy', header: 'Paid By' },
  { key: 'linkedTruckNo', header: 'Linked Truck' },
]

const schema = z.object({
  category: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  amount: z.number().positive('Must be > 0'),
  date: z.string().min(1, 'Required'),
  paidBy: z.string().min(1, 'Required'),
  linkedTruckNo: z.string().optional(),
})

function ExpensesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: expensesApi.list,
  })

  const { data: trucks } = useQuery({
    queryKey: ['trucks'],
    queryFn: trucksApi.list,
  })

  const truckOptions = useMemo(() => {
    return (trucks || []).map(t => ({
      label: t.truckNo,
      value: t.truckNo,
    }))
  }, [trucks])

  const categories = useMemo(() => {
    if (!data) return []
    return Array.from(new Set(data.map(d => d.category))).sort()
  }, [data])

  const filteredData = data?.filter(row => {
    const matchesSearch = row.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.paidBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (row.linkedTruckNo && row.linkedTruckNo.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'All' || row.category === categoryFilter
    return matchesSearch && matchesCategory
  }) || []

  const totalExpense = filteredData.reduce((acc, row) => acc + row.amount, 0)

  const mutation = useMutation({
    mutationFn: (payload: Omit<Expense, 'id'>) => expensesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setIsModalOpen(false)
    },
    onError: () => {
      setErrorMsg('Failed to save record. Please try again.')
    }
  })

  const form = useForm({
    defaultValues: {
      category: '',
      description: '',
      amount: 0,
      date: '',
      paidBy: '',
      linkedTruckNo: '',
    },
    validators: {
      onChange: validateFormWithZod(schema),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value)
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Expense Tracker</h2>
          <p className="text-sm text-text-secondary mt-1">Monitor general operating expenses and petty cash.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Log Expense
        </button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Expenses</div>
            <div className="text-lg font-bold text-primary">₦ {totalExpense.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Entries</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search description or paid by..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel-table flex flex-col min-h-[500px]">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm || categoryFilter !== 'All' 
            ? "We couldn't find any expenses matching your current filters. Try adjusting your search criteria."
            : "There are currently no operating expenses logged."}
          emptyIcon={<Receipt size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          actions={
            (!searchTerm && categoryFilter === 'All') && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
              >
                Log Expense
              </button>
            )
          }
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Expense">
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
          <form.Field name="category" children={(field) => <FormField field={field as any} label="Category" />} />
          <form.Field name="description" children={(field) => <FormField field={field as any} label="Description" />} />
          
          <form.Field name="amount" children={(field) => <FormField field={field as any} label="Amount (₦)" type="number" />} />
          <form.Field name="paidBy" children={(field) => <FormField field={field as any} label="Paid By" />} />

          <form.Field name="linkedTruckNo" children={(field) => (
            <SelectField field={field as any} label="Linked Truck (Optional)" options={[{ label: 'None', value: '' }, ...truckOptions]} />
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
                  {isSubmitting ? 'Recording...' : 'Record Expense'}
                </button>
              )}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
