import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dispatchRecord } from '../../../api/security'
import { DispatchRecord } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { SelectField } from '../../../components/ui/SelectField'

export const Route = createFileRoute('/_shell/security/dispatch')({
  component: DispatchPage,
})

const columnHelper = createColumnHelper<DispatchRecord>()

const columns = [
  columnHelper.accessor('transporterName', { header: 'Transporter' }),
  columnHelper.accessor('driverName', { header: 'Driver' }),
  columnHelper.accessor('truckNo', { header: 'Truck No' }),
  columnHelper.accessor('qtyOfGrains', { header: 'Qty' }),
  columnHelper.accessor('grainType', { header: 'Grain Type' }),
  columnHelper.accessor('destination', { header: 'Destination' }),
]

const schema = z.object({
  transporterName: z.string().min(1, 'Required'),
  driverName: z.string().min(1, 'Required'),
  truckNo: z.string().min(1, 'Required'),
  driverPhone: z.string().min(1, 'Required'),
  qtyOfGrains: z.number().min(0, 'Must be >= 0'),
  confirmedQty: z.number().min(0, 'Must be >= 0'),
  grainType: z.enum(['Maize', 'Sorghum', 'SoyaBeans']),
  weight: z.number().min(0, 'Required'),
  continentalWaybillNo: z.string().min(1, 'Required'),
  lbWaybillNo: z.string().min(1, 'Required'),
  destination: z.string().min(1, 'Required'),
  gatePassNo: z.string().min(1, 'Required'),
  driverSignature: z.string().min(1, 'Required'),
  dateTimeIn: z.string().min(1, 'Required'),
  dateTimeOut: z.string().optional(),
})

function DispatchPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [grainFilter, setGrainFilter] = useState('All')
  const [errorMsg, setErrorMsg] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['dispatchRecord'],
    queryFn: dispatchRecord.list,
  })

  const filteredData = data?.filter(row => {
    const matchesSearch = row.transporterName.toLowerCase().includes(searchTerm.toLowerCase()) || row.truckNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrain = grainFilter === 'All' || row.grainType === grainFilter
    return matchesSearch && matchesGrain
  }) || []

  const totalDispatched = filteredData.reduce((acc, row) => acc + row.qtyOfGrains, 0)

  const mutation = useMutation({
    mutationFn: dispatchRecord.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatchRecord'] })
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
      transporterName: '',
      driverName: '',
      truckNo: '',
      driverPhone: '',
      qtyOfGrains: 0,
      confirmedQty: 0,
      grainType: 'Maize' as 'Maize' | 'Sorghum' | 'SoyaBeans',
      weight: 0,
      continentalWaybillNo: '',
      lbWaybillNo: '',
      destination: '',
      gatePassNo: '',
      driverSignature: '',
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
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Dispatch Record</h2>
          <p className="text-sm text-text-secondary mt-1">Manage outbound grain dispatches and waybills.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Log Dispatch
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
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Qty Dispatched</div>
            <div className="text-lg font-bold text-primary">{totalDispatched.toLocaleString()} kg</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search transporter or truck no..."
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
            <div className="text-sm font-medium text-text-muted">Loading dispatch records...</div>
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
                      <div className="text-4xl text-surface-border mb-2">🚚</div>
                      <h3 className="text-base font-bold text-primary font-header">No dispatch records found</h3>
                      <p className="text-sm text-text-muted max-w-sm">
                        {searchTerm || grainFilter !== 'All' 
                          ? "We couldn't find any records matching your current filters. Try adjusting your search criteria."
                          : "There are currently no outbound dispatches recorded. Log the first dispatch to begin tracking."}
                      </p>
                      {(!searchTerm && grainFilter === 'All') && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
                        >
                          Log Dispatch
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Dispatch Record">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="transporterName" children={(field) => <FormField field={field} label="Transporter Name" />} />
          <form.Field name="driverName" children={(field) => <FormField field={field} label="Driver Name" />} />
          <form.Field name="truckNo" children={(field) => <FormField field={field} label="Truck No" />} />
          <form.Field name="driverPhone" children={(field) => <FormField field={field} label="Driver Phone" />} />
          
          <form.Field name="qtyOfGrains" children={(field) => <FormField field={field as any} label="Qty of Grains" type="number" />} />
          <form.Field name="confirmedQty" children={(field) => <FormField field={field as any} label="Confirmed Qty" type="number" />} />
          
          <form.Field name="grainType" children={(field) => (
            <SelectField field={field} label="Grain Type" options={[
              { label: 'Maize', value: 'Maize' },
              { label: 'Sorghum', value: 'Sorghum' },
              { label: 'SoyaBeans', value: 'SoyaBeans' },
            ]} />
          )} />
          
          <form.Field name="weight" children={(field) => <FormField field={field as any} label="Weight" type="number" />} />
          <form.Field name="continentalWaybillNo" children={(field) => <FormField field={field} label="Continental Waybill No" />} />
          <form.Field name="lbWaybillNo" children={(field) => <FormField field={field} label="LB Waybill No" />} />
          <form.Field name="destination" children={(field) => <FormField field={field} label="Destination" />} />
          <form.Field name="gatePassNo" children={(field) => <FormField field={field} label="Gate Pass No" />} />
          <form.Field name="driverSignature" children={(field) => <FormField field={field} label="Driver Signature (Type Name)" />} />
          
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
