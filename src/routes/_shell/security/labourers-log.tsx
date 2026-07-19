import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { HardHat } from 'lucide-react'

import { labourers } from '../../../api/security'
import { LabourerLogEntry } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/security/labourers-log')({
  component: LabourersLogPage,
})

const schema = z.object({
  labourerName: z.string().min(1, 'Required'),
  task: z.string().min(1, 'Required'),
  timeIn: z.string().min(1, 'Required'),
  timeOut: z.string().optional(),
})

function LabourersLogPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['labourers-log'],
    queryFn: labourers.list,
  })

  const mutation = useMutation({
    mutationFn: labourers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labourers-log'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: {
      labourerName: '',
      task: '',
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

  const columns: Column<LabourerLogEntry>[] = [
    { key: 'labourerName', header: 'Labourer Name', sortable: true },
    { key: 'task', header: 'Task' },
    { 
      key: 'timeIn', 
      header: 'Time In', 
      sortable: true,
      render: (row) => new Date(row.timeIn).toLocaleString() 
    },
    { 
      key: 'timeOut', 
      header: 'Time Out',
      render: (row) => row.timeOut 
        ? <span className="text-text-muted">{new Date(row.timeOut).toLocaleString()}</span> 
        : <Badge status="active" />
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <HardHat size={22} className="text-primary opacity-80" />
            Labourers Log
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Track temporary workers and daily tasks</p>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search labourer name or task..."
        searchKeys={['labourerName', 'task']}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Log Labourer
          </Button>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Labourer Log"
        description="Record a temporary worker's arrival."
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
          id="labourer-log-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="labourerName" children={(field) => <FormField field={field} label="Labourer Name" />} />
            <form.Field name="task" children={(field) => <FormField field={field} label="Task" />} />
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

