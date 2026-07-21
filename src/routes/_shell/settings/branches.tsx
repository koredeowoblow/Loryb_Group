import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Building2 } from 'lucide-react'

import { branches } from '../../../api/core'
import { Branch } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'

export const Route = createFileRoute('/_shell/settings/branches')({
  component: BranchesPage,
})

const schema = z.object({
  name: z.string().min(1, 'Required'),
  address: z.string().optional(),
  phone: z.string().optional(),
})

function BranchesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await branches.list();
      return Array.isArray(res) ? res : (res as any).data || [];
    },
  })

  const mutation = useMutation({
    mutationFn: branches.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save branch. Please try again.')
  })

  const form = useForm({
    defaultValues: { name: '', address: '', phone: '' },
    validators: { onChange: validateFormWithZod(schema) },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value as any)
    },
  })

  const columns: Column<Branch>[] = [
    { key: 'name', header: 'Branch Name', sortable: true },
    { key: 'address', header: 'Address' },
    { key: 'phone', header: 'Phone' },
    { key: 'createdAt', header: 'Created At', render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Building2 size={22} className="text-primary opacity-80" />
            Branches
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage company branches and locations</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search branches..."
        searchKeys={['name', 'address', 'phone']}
        actions={<Button onClick={() => setIsModalOpen(true)}>Add Branch</Button>}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Branch"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button onClick={(e) => { e.preventDefault(); form.handleSubmit() }} disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                Save Branch
              </Button>
            )} />
          </>
        }>
        {errorMsg && <div className="alert alert-danger mb-4">{errorMsg}</div>}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="name" children={(field) => <FormField field={field} label="Branch Name" />} />
          <form.Field name="address" children={(field) => <FormField field={field} label="Address" />} />
          <form.Field name="phone" children={(field) => <FormField field={field} label="Phone Number" />} />
        </form>
      </Modal>
    </div>
  )
}
