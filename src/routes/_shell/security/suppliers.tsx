import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { suppliers } from '../../../api/security'
import { SupplierRecord } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { SelectField } from '../../../components/ui/SelectField'

export const Route = createFileRoute('/_shell/security/suppliers')({
  component: SuppliersPage,
})

const columnHelper = createColumnHelper<SupplierRecord>()

const columns = [
  columnHelper.accessor('supplierName', { header: 'Supplier Name' }),
  columnHelper.accessor('driverName', { header: 'Driver' }),
  columnHelper.accessor('truckNo', { header: 'Truck No' }),
  columnHelper.accessor('qtyOfGrains', { header: 'Qty' }),
  columnHelper.accessor('grainType', { header: 'Grain Type' }),
]

const schema = z.object({
  supplierName: z.string().min(1, 'Required'),
  driverName: z.string().min(1, 'Required'),
  refPhoneNo: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format'),
  truckNo: z.string().min(1, 'Required'),
  qtyOfGrains: z.number().positive('Must be > 0'),
  confirmedQty: z.number().min(0, 'Must be >= 0'),
  grainType: z.enum(['Maize', 'Sorghum', 'SoyaBeans']),
  storeLocation: z.string().min(1, 'Required'),
  weightNo: z.string().min(1, 'Required'),
  rejectNo: z.number().default(0),
  dateTimeIn: z.string().min(1, 'Required'),
  dateTimeOut: z.string().optional(),
})

function SuppliersPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [grainFilter, setGrainFilter] = useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: suppliers.list,
  })

  const filteredData = (data || []).filter((row) => {
    const matchesSearch = row.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || row.truckNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrain = grainFilter === 'All' || row.grainType === grainFilter
    return matchesSearch && matchesGrain
  }) || []

  const totalQty = filteredData.reduce((acc, row) => acc + row.qtyOfGrains, 0)

  const mutation = useMutation({
    mutationFn: suppliers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
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
      driverName: '',
      refPhoneNo: '',
      truckNo: '',
      qtyOfGrains: 0,
      confirmedQty: 0,
      grainType: 'Maize' as 'Maize' | 'Sorghum' | 'SoyaBeans',
      storeLocation: '',
      weightNo: '',
      rejectNo: 0,
      dateTimeIn: '',
      dateTimeOut: '',
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
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Suppliers Record</h2>
          <p className="text-sm text-text-secondary mt-1">Manage and track inbound grain deliveries from suppliers.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Log Supplier
        </button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Records</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Qty Received</div>
            <div className="text-lg font-bold text-primary">{totalQty.toLocaleString()} kg</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search supplier or truck no..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={grainFilter}
            onChange={e => setGrainFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Grains</option>
            <option value="Maize">Maize</option>
            <option value="Sorghum">Sorghum</option>
            <option value="SoyaBeans">Soya Beans</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-surface-border overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-surface-border border-t-primary rounded-full animate-spin"></div>
            <div className="text-sm font-medium text-text-muted">Loading supplier records...</div>
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
                      <div className="text-4xl text-surface-border mb-2">🚛</div>
                      <h3 className="text-base font-bold text-primary font-header">No supplier records found</h3>
                      <p className="text-sm text-text-muted max-w-sm">
                        {searchTerm || grainFilter !== 'All' 
                          ? "We couldn't find any records matching your current filters. Try adjusting your search criteria."
                          : "There are currently no inbound grain deliveries recorded. Log the first supplier to begin tracking."}
                      </p>
                      {(!searchTerm && grainFilter === 'All') && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
                        >
                          Log Supplier
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Supplier Record">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="supplierName" children={(field) => <FormField field={field} label="Supplier Name" />} />
          <form.Field name="driverName" children={(field) => <FormField field={field} label="Driver Name" />} />
          <form.Field name="refPhoneNo" children={(field) => <FormField field={field} label="Ref Phone No" />} />
          <form.Field name="truckNo" children={(field) => <FormField field={field} label="Truck No" />} />
          
          <form.Field name="qtyOfGrains" children={(field) => <FormField field={field as any} label="Qty of Grains" type="number" />} />
          <form.Field name="confirmedQty" children={(field) => <FormField field={field as any} label="Confirmed Qty" type="number" />} />
          
          <form.Field name="grainType" children={(field) => (
            <SelectField field={field} label="Grain Type" options={[
              { label: 'Maize', value: 'Maize' },
              { label: 'Sorghum', value: 'Sorghum' },
              { label: 'SoyaBeans', value: 'SoyaBeans' },
            ]} />
          )} />
          
          <form.Field name="storeLocation" children={(field) => <FormField field={field} label="Store Location" />} />
          <form.Field name="weightNo" children={(field) => <FormField field={field} label="Weight No" />} />
          <form.Field name="rejectNo" children={(field) => <FormField field={field as any} label="Reject No" type="number" />} />
          <form.Field name="dateTimeIn" children={(field) => <DateTimeField field={field} label="Date/Time In" />} />
          <form.Field name="dateTimeOut" children={(field) => <DateTimeField field={field} label="Date/Time Out (Optional)" />} />

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
