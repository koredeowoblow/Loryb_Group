import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Package } from 'lucide-react'

import { materialsHandoff } from '../../../api/security'
import { MaterialsHandoffEntry } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { SelectField } from '../../../components/ui/SelectField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'

export const Route = createFileRoute('/_shell/security/materials-handoff')({
  component: MaterialsHandoffPage,
})

const schema = z.object({
  vehicleNo: z.string().min(1, 'Required'),
  materialQuality: z.string().min(1, 'Required'),
  grainType: z.enum(['Maize', 'Sorghum', 'SoyaBeans']),
  driverName: z.string().min(1, 'Required'),
  driverNo: z.string().min(1, 'Required'),
  dateTime: z.string().min(1, 'Required'),
})

function MaterialsHandoffPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['materials-handoff'],
    queryFn: materialsHandoff.list,
  })

  const mutation = useMutation({
    mutationFn: materialsHandoff.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials-handoff'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: {
      vehicleNo: '',
      materialQuality: '',
      grainType: 'Maize' as 'Maize' | 'Sorghum' | 'SoyaBeans',
      driverName: '',
      driverNo: '',
      dateTime: '',
    },
    validators: {
      onChange: validateFormWithZod(schema),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value)
    },
  })

  const columns: Column<MaterialsHandoffEntry>[] = [
    { key: 'vehicleNo', header: 'Vehicle No', sortable: true },
    { key: 'materialQuality', header: 'Quality' },
    { key: 'grainType', header: 'Grain Type', sortable: true },
    { key: 'driverName', header: 'Driver' },
    { 
      key: 'dateTime', 
      header: 'Date & Time', 
      sortable: true,
      render: (row) => new Date(row.dateTime).toLocaleString() 
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Package size={22} className="text-primary opacity-80" />
            Materials Handoff
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Track inbound materials and grain quality</p>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search vehicle no or driver..."
        searchKeys={['vehicleNo', 'driverName', 'grainType']}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Log Handoff
          </Button>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Material Handoff"
        description="Record a new material handoff delivery."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                  }}
                  disabled={!canSubmit || isSubmitting}
                  isLoading={isSubmitting}
                >
                  Log Entry
                </Button>
              )}
            />
          </>
        }
      >
        {errorMsg && (
          <div className="alert alert-danger mb-4">
            {errorMsg}
          </div>
        )}
        <form
          id="materials-handoff-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field name="vehicleNo" children={(field) => <FormField field={field} label="Vehicle No" />} />
            <form.Field name="driverName" children={(field) => <FormField field={field} label="Driver Name" />} />
            <form.Field name="driverNo" children={(field) => <FormField field={field} label="Driver Contact No" />} />
            <form.Field name="materialQuality" children={(field) => <FormField field={field} label="Material Quality" />} />
            <form.Field name="grainType" children={(field) => (
              <SelectField field={field} label="Grain Type" options={[
                { label: 'Maize', value: 'Maize' },
                { label: 'Sorghum', value: 'Sorghum' },
                { label: 'SoyaBeans', value: 'SoyaBeans' },
              ]} />
            )} />
            <form.Field name="dateTime" children={(field) => <DateTimeField field={field} label="Date & Time" />} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

