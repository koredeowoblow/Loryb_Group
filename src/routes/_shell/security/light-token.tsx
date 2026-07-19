import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Lightbulb } from 'lucide-react'

import { lightTokens } from '../../../api/security'
import { LightTokenEntry } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'

export const Route = createFileRoute('/_shell/security/light-token')({
  component: LightTokenPage,
})

const schema = z.object({
  tokenNo: z.string().min(1, 'Required'),
  issuedTo: z.string().min(1, 'Required'),
  purpose: z.string().min(1, 'Required'),
  timeIssued: z.string().min(1, 'Required'),
  timeReturned: z.string().min(1, 'Required'),
})

function LightTokenPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['light-token'],
    queryFn: lightTokens.list,
  })

  const mutation = useMutation({
    mutationFn: lightTokens.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['light-token'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: {
      tokenNo: '',
      issuedTo: '',
      purpose: '',
      timeIssued: '',
      timeReturned: '',
    },
    validators: {
      onChange: validateFormWithZod(schema),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value)
    },
  })

  const columns: Column<LightTokenEntry>[] = [
    { key: 'tokenNo', header: 'Token No', sortable: true },
    { key: 'issuedTo', header: 'Issued To', sortable: true },
    { key: 'purpose', header: 'Purpose' },
  ]

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Lightbulb size={22} className="text-primary opacity-80" />
            Light Token
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Track generator and electrical tokens</p>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search token or issuer..."
        searchKeys={['tokenNo', 'issuedTo']}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Log Token
          </Button>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Light Token"
        description="Record a new light token issuance."
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
          id="light-token-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="tokenNo" children={(field) => <FormField field={field} label="Token No" />} />
            <form.Field name="issuedTo" children={(field) => <FormField field={field} label="Issued To" />} />
          </div>
          <form.Field name="purpose" children={(field) => <FormField field={field} label="Purpose" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="timeIssued" children={(field) => <DateTimeField field={field} label="Time Issued" />} />
            <form.Field name="timeReturned" children={(field) => <DateTimeField field={field} label="Time Returned" />} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

