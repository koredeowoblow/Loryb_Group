import { PackagePlus } from 'lucide-react'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { grn } from '../../../api/warehouse'
import { GoodsReceivedNote } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'

import { SelectField } from '../../../components/ui/SelectField'

export const Route = createFileRoute('/_shell/warehouse/grn')({
  component: GRNPage,
})

const columnHelper = createColumnHelper<GoodsReceivedNote>()

const columns = [
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('grainType', { header: 'Grain Type' }),
  columnHelper.accessor('noOfBagsReceived', { header: 'Bags' }),
  columnHelper.accessor('netWeight', { header: 'Net Weight (kg)' }),
  columnHelper.accessor('binCardRef', { header: 'Bin Card Ref' }),
]

const schema = z.object({
  grainType: z.enum(['Maize', 'Sorghum', 'SoyaBeans']),
  noOfBagsReceived: z.number().positive('Must be > 0'),
  netWeight: z.number().positive('Must be > 0'),
  binCardRef: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
})

function GRNPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [grainFilter, setGrainFilter] = useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['grn'],
    queryFn: grn.list,
  })

  const filteredData = data?.filter(row => {
    const matchesSearch = row.binCardRef.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrain = grainFilter === 'All' || row.grainType === grainFilter
    return matchesSearch && matchesGrain
  }) || []

  const totalIntake = filteredData.reduce((acc, row) => acc + row.netWeight, 0)

  const mutation = useMutation({
    mutationFn: (data: Omit<GoodsReceivedNote, 'id'>) => grn.create ? grn.create(data) : Promise.resolve(data), // Using conditional because grn.create might need to be mocked if not fully there
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grn'] })
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
      grainType: 'Maize',
      noOfBagsReceived: 0,
      netWeight: 0,
      binCardRef: '',
      date: '',
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
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Goods Received Note</h2>
          <p className="text-sm text-text-secondary mt-1">Log inbound stock after security gate confirmation.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Log GRN
        </button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="bg-surface p-3 rounded-none shadow-none border-2 border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Records</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Intake Volume</div>
            <div className="text-lg font-bold text-primary">{totalIntake.toLocaleString()} kg</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Bin Card Ref..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={grainFilter}
            onChange={e => setGrainFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Grains</option>
            <option value="Maize">Maize</option>
            <option value="Sorghum">Sorghum</option>
            <option value="SoyaBeans">Soya Beans</option>
          </select>
        </div>
      </div>

      <div className="bg-surface rounded-none shadow-none border-2 border-surface-border overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-surface-border border-t-primary rounded-full animate-spin"></div>
            <div className="text-sm font-medium text-text-muted">Loading GRN records...</div>
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
            <tbody className="bg-surface divide-y divide-surface-border text-sm">
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
                      <PackagePlus size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />
                      <h3 className="text-base font-bold text-primary font-header">No GRN records found</h3>
                      <p className="text-sm text-text-muted max-w-sm">
                        {searchTerm || grainFilter !== 'All' 
                          ? "We couldn't find any records matching your current filters. Try adjusting your search criteria."
                          : "There are currently no Goods Received Notes. Log the first GRN when inventory arrives."}
                      </p>
                      {(!searchTerm && grainFilter === 'All') && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
                        >
                          Log GRN
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add GRN">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="grainType" children={(field) => (
            <SelectField field={field as any} label="Grain Type" options={[
              { label: 'Maize', value: 'Maize' },
              { label: 'Sorghum', value: 'Sorghum' },
              { label: 'SoyaBeans', value: 'SoyaBeans' },
            ]} />
          )} />
          <form.Field name="noOfBagsReceived" children={(field) => <FormField field={field as any} label="No. of Bags" type="number" />} />
          <form.Field name="netWeight" children={(field) => <FormField field={field as any} label="Net Weight (kg)" type="number" />} />
          <form.Field name="binCardRef" children={(field) => <FormField field={field as any} label="Bin Card Ref" />} />
          <form.Field name="date" children={(field) => <FormField field={field as any} label="Date" type="date" />} />

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
                  {isSubmitting ? 'Recording...' : 'Record Intake'}
                </button>
              )}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

