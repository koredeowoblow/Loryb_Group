import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { payroll } from '../../../api/finance'
import { PayrollEntry } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'

export const Route = createFileRoute('/_shell/finance/payroll')({
  component: PayrollPage,
})

const columnHelper = createColumnHelper<PayrollEntry>()

const columns = [
  columnHelper.accessor('period', { header: 'Period' }),
  columnHelper.accessor('staffName', { header: 'Staff Name' }),
  columnHelper.accessor('department', { header: 'Department' }),
  columnHelper.accessor('daysPresent', { header: 'Days Present' }),
  columnHelper.accessor('amount', { header: 'Amount (₦)' }),
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

  const { data, isLoading } = useQuery({
    queryKey: ['payroll'],
    queryFn: payroll.list,
  })

  const periods = useMemo(() => {
    if (!data) return []
    const uniquePeriods = Array.from(new Set(data.map(d => d.period)))
    return uniquePeriods.sort((a, b) => b.localeCompare(a)) // Sort newest first
  }, [data])

  const filteredData = data?.filter(row => {
    const matchesSearch = row.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPeriod = periodFilter === 'All' || row.period === periodFilter
    return matchesSearch && matchesPeriod
  }) || []

  const totalPayroll = filteredData.reduce((acc, row) => acc + row.amount, 0)
  const staffCount = filteredData.length

  const mutation = useMutation({
    mutationFn: (payload: Omit<PayrollEntry, 'id'>) => payroll.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] })
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
      staffName: '',
      department: '',
      daysPresent: 0,
      amount: 0,
      period: '',
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
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Payroll Registry</h2>
          <p className="text-sm text-text-secondary mt-1">Manage employee compensation and attendance records.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Log Payroll
        </button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Payroll</div>
            <div className="text-lg font-bold text-primary">₦ {totalPayroll.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Staff Processed</div>
            <div className="text-lg font-bold text-primary">{staffCount}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search staff or department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={periodFilter}
            onChange={e => setPeriodFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Periods</option>
            {periods.map((p: string) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-surface-border overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-surface-border border-t-primary rounded-full animate-spin"></div>
            <div className="text-sm font-medium text-text-muted">Loading payroll records...</div>
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
                      <div className="text-4xl text-surface-border mb-2">👥</div>
                      <h3 className="text-base font-bold text-primary font-header">No payroll records found</h3>
                      <p className="text-sm text-text-muted max-w-sm">
                        {searchTerm || periodFilter !== 'All' 
                          ? "We couldn't find any records matching your current filters. Try adjusting your search criteria."
                          : "There are currently no payroll records. Log the first employee compensation."}
                      </p>
                      {(!searchTerm && periodFilter === 'All') && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
                        >
                          Log Payroll
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Payroll Entry">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="period" children={(field) => <FormField field={field as any} label="Period (e.g. 2026-07)" />} />
          <form.Field name="staffName" children={(field) => <FormField field={field as any} label="Staff Name" />} />
          <form.Field name="department" children={(field) => <FormField field={field as any} label="Department" />} />
          
          <form.Field name="daysPresent" children={(field) => <FormField field={field as any} label="Days Present" type="number" />} />
          <form.Field name="amount" children={(field) => <FormField field={field as any} label="Amount (₦)" type="number" />} />

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
