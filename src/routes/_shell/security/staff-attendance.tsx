import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Users } from 'lucide-react'

import { staffAttendance } from '../../../api/security'
import { StaffAttendance } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/security/staff-attendance')({
  component: StaffAttendancePage,
})

const schema = z.object({
  name: z.string().min(1, 'Required'),
  department: z.string().min(1, 'Required'),
  timeIn: z.string().min(1, 'Required'),
  timeOut: z.string().optional(),
})

function StaffAttendancePage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['staffAttendance'],
    queryFn: staffAttendance.list,
  })

  const mutation = useMutation({
    mutationFn: staffAttendance.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffAttendance'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: {
      name: '',
      department: '',
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

  const columns: Column<StaffAttendance>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'department', header: 'Department' },
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
            Staff Attendance
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Track employee arrivals and departures</p>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search staff name or department..."
        searchKeys={['name', 'department']}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Log Attendance
          </Button>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Staff Attendance"
        description="Log a staff member's arrival."
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
                  Log Attendance
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
          id="staff-attendance-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="name" children={(field) => <FormField field={field} label="Name" />} />
            <form.Field name="department" children={(field) => <FormField field={field} label="Department" />} />
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

