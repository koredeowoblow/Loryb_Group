import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Users } from 'lucide-react'

import { staff, branches } from '../../../api/core'
import { Staff } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'

export const Route = createFileRoute('/_shell/settings/staff')({
  component: StaffPage,
})

const schema = z.object({
  name: z.string().min(1, 'Required'),
  phone: z.string().optional(),
  role: z.string().optional(),
  branchId: z.string().optional(),
})

function StaffPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data: branchesData = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await branches.list();
      return Array.isArray(res) ? res : (res as any).data || [];
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const res = await staff.list();
      return Array.isArray(res) ? res : (res as any).data || [];
    },
  })

  const mutation = useMutation({
    mutationFn: staff.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save staff. Please try again.')
  })

  const form = useForm({
    defaultValues: { name: '', phone: '', role: '', branchId: '' },
    validators: { onChange: validateFormWithZod(schema) },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value as any)
    },
  })

  const branchOptions = branchesData.map((b: any) => ({ label: b.name, value: b.id }))

  const columns: Column<Staff>[] = [
    { key: 'id', header: 'Staff ID', render: (row) => <span className="text-xs font-mono">{row.id}</span> },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role' },
    { key: 'phone', header: 'Phone' },
    { key: 'branchId', header: 'Branch', render: (row) => branchesData.find((b:any) => b.id === row.branchId)?.name || 'N/A' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Users size={22} className="text-primary opacity-80" />
            Staff Management
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage employees and their branch assignments</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search staff name or ID..."
        searchKeys={['name', 'id', 'role']}
        actions={<Button onClick={() => setIsModalOpen(true)}>Add Staff</Button>}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Staff"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button onClick={(e) => { e.preventDefault(); form.handleSubmit() }} disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                Save Staff
              </Button>
            )} />
          </>
        }>
        {errorMsg && <div className="alert alert-danger mb-4">{errorMsg}</div>}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="name" children={(field) => <FormField field={field} label="Full Name" />} />
          <form.Field name="phone" children={(field) => <FormField field={field} label="Phone Number" />} />
          <form.Field name="role" children={(field) => <FormField field={field} label="Role (e.g. Manager, Guard)" />} />
          <form.Field name="branchId" children={(field) => <SelectField field={field} label="Branch" options={branchOptions} />} />
        </form>
      </Modal>
    </div>
  )
}
