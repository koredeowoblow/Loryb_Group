import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Bike } from 'lucide-react'

import { motorcycleLog } from '../../../api/security'
import { MotorcycleLog } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/security/motorcycle-log')({
  component: MotorcycleLogPage,
})

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

  const { data = [], isLoading } = useQuery({
    queryKey: ['motorcycleLog'],
    queryFn: motorcycleLog.list,
  })

  const mutation = useMutation({
    mutationFn: motorcycleLog.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleLog'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
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

  const columns: Column<MotorcycleLog>[] = [
    { key: 'staffName', header: 'Staff Name', sortable: true },
    { key: 'bikeNo', header: 'Bike No', sortable: true },
    { key: 'destination', header: 'Destination' },
    { key: 'purpose', header: 'Purpose' },
    { key: 'date', header: 'Date', sortable: true },
    { key: 'timeIn', header: 'Time In', sortable: true },
    { 
      key: 'timeOut', 
      header: 'Time Out',
      render: (row) => row.timeOut 
        ? <span className="text-text-muted">{row.timeOut}</span> 
        : <Badge status="active" />
    },
    { key: 'signature', header: 'Signature' },
  ]

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Bike size={22} className="text-primary opacity-80" />
            Motorcycle Log
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Track company motorcycle usage</p>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search staff names or bike numbers..."
        searchKeys={['staffName', 'bikeNo', 'destination']}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Log Usage
          </Button>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Motorcycle Log"
        description="Record a new motorcycle usage log."
        size="lg"
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
          id="motorcycle-log-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="staffName" children={(field) => <FormField field={field} label="Staff Name" />} />
            <form.Field name="bikeNo" children={(field) => <FormField field={field} label="Bike No" />} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="destination" children={(field) => <FormField field={field} label="Destination" />} />
            <form.Field name="purpose" children={(field) => <FormField field={field} label="Purpose" />} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="date" children={(field) => <FormField field={field} label="Date" type="date" />} />
            <form.Field name="signature" children={(field) => <FormField field={field} label="Signature" />} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="timeIn" children={(field) => <DateTimeField field={field} label="Time In" />} />
            <form.Field name="timeOut" children={(field) => <DateTimeField field={field} label="Time Out (Optional)" />} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

