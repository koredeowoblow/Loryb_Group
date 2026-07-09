import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motorcycleLog } from '../../../api/security'
import { MotorcycleLog } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'

export const Route = createFileRoute('/_shell/security/motorcycle-log')({
  component: MotorcycleLogPage,
})

const columnHelper = createColumnHelper<MotorcycleLog>()

const columns = [
  columnHelper.accessor('staffName', { header: 'Staff Name' }),
  columnHelper.accessor('destination', { header: 'Destination' }),
  columnHelper.accessor('purpose', { header: 'Purpose' }),
  columnHelper.accessor('bikeNo', { header: 'Bike No' }),
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('signature', { header: 'Signature' }),
  columnHelper.accessor('timeIn', { header: 'Time In' }),
  columnHelper.accessor('timeOut', { header: 'Time Out' }),
]

const schema = z.object({
  staffName: z.string().min(1, 'Required'),
  destination: z.string().min(1, 'Required'),
  purpose: z.string().min(1, 'Required'),
  bikeNo: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
  signature: z.string().min(1, 'Required'),
  timeIn: z.string().min(1, 'Required'),
  timeOut: z.string().optional(),
})

function MotorcycleLogPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['motorcycleLog'],
    queryFn: motorcycleLog.list,
  })

  const mutation = useMutation({
    mutationFn: motorcycleLog.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleLog'] })
      setIsModalOpen(false)
    },
    onError: () => {
      setErrorMsg('Failed to save record. Please try again.')
    }
  })

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const form = useForm({
    defaultValues: {
      staffName: '',
      destination: '',
      purpose: '',
      bikeNo: '',
      date: '',
      signature: '',
      timeIn: '',
      timeOut: '',
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
        <h2 className="text-xl font-bold font-header tracking-tight text-primary">Motorcycle Log</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Add New
        </button>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-surface-border overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-text-muted">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-surface-border border-b border-surface-border">
            <thead className="bg-surface-muted">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-3 text-left text-[0.7rem] font-bold text-text-secondary uppercase tracking-wider bg-surface-muted border-b border-surface-border font-header">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-surface-border text-sm">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-surface-active/60 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-text-primary border-b border-surface-border/50">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-text-muted">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Motorcycle Log">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="staffName" children={(field) => <FormField field={field} label="Staff Name" />} />
          <form.Field name="destination" children={(field) => <FormField field={field} label="Destination" />} />
          <form.Field name="purpose" children={(field) => <FormField field={field} label="Purpose" />} />
          <form.Field name="bikeNo" children={(field) => <FormField field={field} label="Bike No" />} />
          <form.Field name="date" children={(field) => <FormField field={field} label="Date" type="date" />} />
          <form.Field name="signature" children={(field) => <FormField field={field} label="Signature" />} />
          <form.Field name="timeIn" children={(field) => <DateTimeField field={field} label="Time In" />} />
          <form.Field name="timeOut" children={(field) => <DateTimeField field={field} label="Time Out (Optional)" />} />

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
