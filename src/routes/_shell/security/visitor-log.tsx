import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Users } from 'lucide-react'

import { visitorLog } from '../../../api/security'
import { VisitorLog } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/security/visitor-log')({
  component: VisitorLogPage,
})

const schema = z.object({
  name: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  phoneNo: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format'),
  personVisiting: z.string().min(1, 'Required'),
  purpose: z.string().min(1, 'Required'),
  timeIn: z.string().min(1, 'Required'),
  timeOut: z.string().optional().or(z.literal('')),
  signature: z.string().min(1, 'Required'),
})

function VisitorLogPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['visitorLog'],
    queryFn: visitorLog.list,
  })

  const mutation = useMutation({
    mutationFn: visitorLog.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitorLog'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: {
      name: '',
      address: '',
      phoneNo: '',
      personVisiting: '',
      purpose: '',
      timeIn: '',
      timeOut: '' as string | undefined,
      signature: '',
    },
    validators: {
      onChange: validateFormWithZod(schema),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value)
    },
  })

  const columns: Column<VisitorLog>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'personVisiting', header: 'Visiting' },
    { key: 'purpose', header: 'Purpose' },
    { key: 'timeIn', header: 'Time In', sortable: true },
    { 
      key: 'timeOut', 
      header: 'Status / Time Out',
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
            Visitor Log
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Track and manage all facility visitors</p>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search visitors..."
        searchKeys={['name', 'personVisiting', 'purpose']}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Add Visitor
          </Button>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Visitor Log"
        description="Record a new visitor entry."
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
                  Log Visitor
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
          id="visitor-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <form.Field name="name" children={(field) => <FormField field={field} label="Name" />} />
            <form.Field name="phoneNo" children={(field) => <FormField field={field} label="Phone No" type="tel" />} />
          </div>
          <form.Field name="address" children={(field) => <FormField field={field} label="Address" />} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <form.Field name="personVisiting" children={(field) => <FormField field={field} label="Person Visiting" />} />
            <form.Field name="purpose" children={(field) => <FormField field={field} label="Purpose" />} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <form.Field name="timeIn" children={(field) => <DateTimeField field={field} label="Time In" />} />
            <form.Field name="timeOut" children={(field) => <DateTimeField field={field} label="Time Out (Optional)" />} />
          </div>
          
          <form.Field name="signature" children={(field) => <FormField field={field} label="Signature (Type Name)" />} />
        </form>
      </Modal>
    </div>
  )
}

