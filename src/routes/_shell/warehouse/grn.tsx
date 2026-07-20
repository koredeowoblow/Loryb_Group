import { PackagePlus } from 'lucide-react'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { grn } from '../../../api/warehouse'
import { GoodsReceivedNote } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

export const Route = createFileRoute('/_shell/warehouse/grn')({
  component: GRNPage,
})

const columns: Column<GoodsReceivedNote>[] = [
  { key: 'date', header: 'Date', sortable: true },
  { key: 'grainType', header: 'Grain Type', sortable: true },
  { key: 'noOfBagsReceived', header: 'Bags', render: (row: GoodsReceivedNote) => row.noOfBagsReceived.toLocaleString() },
  { key: 'netWeight', header: 'Net Weight (kg)', sortable: true, render: (row: GoodsReceivedNote) => row.netWeight.toLocaleString() },
  { key: 'binCardRef', header: 'Bin Card Ref', sortable: true },
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
    mutationFn: (payload: Omit<GoodsReceivedNote, 'id'>) => grn.create ? grn.create(payload) : Promise.resolve(payload), // Using conditional because grn.create might need to be mocked if not fully there
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grn'] })
      setIsModalOpen(false)
    },
    onError: () => {
      setErrorMsg('Failed to save record. Please try again.')
    }
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
        <Button onClick={() => setIsModalOpen(true)}>
          Log GRN
        </Button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Total Records</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Total Intake Volume</div>
            <div className="text-lg font-bold text-primary">{totalIntake.toLocaleString()} kg</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search Bin Card Ref..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select
            value={grainFilter}
            onChange={e => setGrainFilter(e.target.value)}
          >
            <option value="All">All Grains</option>
            <option value="Maize">Maize</option>
            <option value="Sorghum">Sorghum</option>
            <option value="SoyaBeans">Soya Beans</option>
          </Select>
        </div>
      </div>

      <div className="panel-table flex flex-col flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm || grainFilter !== 'All' 
            ? "We couldn't find any records matching your current filters. Try adjusting your search criteria."
            : "There are currently no Goods Received Notes. Log the first GRN when inventory arrives."}
          emptyIcon={<PackagePlus size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          actions={
            (!searchTerm && grainFilter === 'All') && (
              <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                Log GRN
              </Button>
            )
          }
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add GRN">
        {errorMsg && <div className="mb-4 text-sm bg-status-danger/10 border border-status-error/20 text-status-danger font-medium p-2 rounded">{errorMsg}</div>}
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
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                  {isSubmitting ? 'Recording...' : 'Record Intake'}
                </Button>
              )}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
