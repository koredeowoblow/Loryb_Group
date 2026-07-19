import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Users } from 'lucide-react'

import { staffMovement } from '../../../api/security'
import { StaffMovementLog } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/security/staff-movement')({
  component: StaffMovementPage,
})

const schema = z.object({
  staffName: z.string().min(1, 'Required'),
  destination: z.string().min(1, 'Required'),
  purpose: z.string().min(1, 'Required'),
  timeIn: z.string().min(1, 'Required'),
  timeOut: z.string().optional(),
})

function StaffMovementPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['staffMovement'],
    queryFn: staffMovement.list,
  })

  const mutation = useMutation({
    mutationFn: staffMovement.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffMovement'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: {
      staffName: '',
      destination: '',
      purpose: '',
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

  const columns: Column<StaffMovementLog>[] = [
    { key: 'staffName', header: 'Staff Name', sortable: true },
    { key: 'destination', header: 'Destination' },
    { key: 'purpose', header: 'Purpose' },
    { key: 'timeIn', header: 'Time In', sortable: true },
    { 
      key: 'timeOut', 
      header: 'Time Out',
      render: (row) => row.timeOut 
        ? <span className="text-text-muted">{row.timeOut}</span> 
        : <Badge status="active" />
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Users size={22} className="text-primary opacity-80" />
            Staff Movement Log
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Track temporary departures and returns</p>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search staff names or destinations..."
        searchKeys={['staffName', 'destination', 'purpose']}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Log Movement
          </Button>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Staff Movement"
        description="Log a staff member leaving the premises temporarily."
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
                  Log Movement
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
          id="staff-movement-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="staffName" children={(field) => <FormField field={field} label="Staff Name" />} />
            <form.Field name="destination" children={(field) => <FormField field={field} label="Destination" />} />
          </div>
          <form.Field name="purpose" children={(field) => <FormField field={field} label="Purpose" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="timeIn" children={(field) => <DateTimeField field={field} label="Time In" />} />
            <form.Field name="timeOut" children={(field) => <DateTimeField field={field} label="Time Out (Optional)" />} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

