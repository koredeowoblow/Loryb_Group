import { Users } from 'lucide-react'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { users as usersApi, roles as rolesApi } from '../../../api/core'
import { User } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Badge } from '../../../components/ui/Badge'
import { Modal } from '../../../components/ui/Modal'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

export const Route = createFileRoute('/_shell/settings/user-management')({
  component: UserManagementPage,
})

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Required'),
  status: z.enum(['Active', 'Inactive', 'Pending']),
})

function UserManagementPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteId, setDeleteId] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { data: usersData = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: usersApi.list })
  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: rolesApi.list })

  const createMutation = useMutation({
    mutationFn: (payload: any) => usersApi.create(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); setIsModalOpen(false) },
    onError: () => setErrorMsg('Failed to create user')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) => usersApi.update(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); setIsModalOpen(false) },
    onError: () => setErrorMsg('Failed to update user')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); setDeleteId('') }
  })

  const form = useForm({
    defaultValues: { name: editingUser?.name || '', email: editingUser?.email || '', role: editingUser?.role || '', status: editingUser?.status || 'Active' },
    validators: { onChange: validateFormWithZod(schema) },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      if (editingUser) { await updateMutation.mutateAsync({ id: editingUser.id, payload: value }) }
      else { await createMutation.mutateAsync(value) }
    }
  })

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.reset()
    form.setFieldValue('name', user.name)
    form.setFieldValue('email', user.email)
    form.setFieldValue('role', user.role)
    form.setFieldValue('status', user.status || 'Active')
    setIsModalOpen(true)
  }

  const handleCreate = () => { setEditingUser(null); form.reset(); setIsModalOpen(true) }

  const columns: Column<User>[] = [
    { key: 'name', header: 'Full Name', sortable: true },
    { key: 'email', header: 'Email Address', sortable: true },
    { key: 'role', header: 'Role', sortable: true, render: (row: User) => <span className="font-medium">{row.role}</span> },
    { key: 'status', header: 'Status', render: (row: User) => <Badge status={(row.status || 'pending') as any} /> },
    { key: 'lastLogin', header: 'Last Login' },
    {
      key: 'id', header: '', render: (row: User) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} className="text-primary hover:text-primary-hover p-1">Edit</Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(row.id)} className="text-status-danger hover:text-status-danger-dark p-1">Delete</Button>
        </div>
      )
    },
  ]

  const filteredUsers = (usersData as User[]).filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'All' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-text-primary">User Management</h2>
          <p className="text-sm text-text-secondary mt-1">Manage staff access and active platform accounts.</p>
        </div>
        <Button onClick={handleCreate}>Invite User</Button>
      </div>

      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div><div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Total Users</div><div className="text-lg font-bold text-primary">{(usersData as User[]).length}</div></div>
          <div><div className="text-xs uppercase tracking-wider font-bold text-status-success font-header">Active</div><div className="text-lg font-bold text-status-success">{(usersData as User[]).filter(u => u.status === 'Active').length}</div></div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input type="text" placeholder="Search name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64" />
          <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="All">All Roles</option>
            {(roles as any[]).map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </Select>
        </div>
      </div>

      <div className="panel-table flex flex-col flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={filteredUsers}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage="No users found matching your criteria."
          emptyIcon={<Users size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? "Edit User" : "Invite User"}>
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field name="name" children={(field) => <FormField field={field} label="Full Name" type="text" />} />
            <form.Field name="email" children={(field) => <FormField field={field} label="Email Address" type="email" />} />
            <form.Field name="role" children={(field) => (<SelectField field={field} label="Role" options={[{ label: 'Select Role...', value: '' }, ...(roles as any[]).map(r => ({ label: r.name, value: r.name }))]} />)} />
            <form.Field name="status" children={(field) => (<SelectField field={field} label="Status" options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }, { label: 'Pending', value: 'Pending' }]} />)} />
          </div>
          {errorMsg && <div className="text-status-danger text-sm mt-2">{errorMsg}</div>}
          <div className="pt-4 border-t border-surface-border flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
              </Button>
            )} />
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId('')} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Are you sure you want to delete this user? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-surface-border">
            <Button variant="secondary" onClick={() => setDeleteId('')}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} isLoading={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
