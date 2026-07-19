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
          <button onClick={() => handleEdit(row)} className="text-primary hover:text-primary-hover font-bold font-header text-xs uppercase tracking-wider p-1 transition-colors">Edit</button>
          <button onClick={() => setDeleteId(row.id)} className="text-status-error hover:text-status-error-dark font-bold font-header text-xs uppercase tracking-wider p-1 transition-colors">Delete</button>
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
        <button onClick={handleCreate} className="btn btn-primary font-header uppercase tracking-wider">Invite User</button>
      </div>

      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div><div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Users</div><div className="text-lg font-bold text-primary">{(usersData as User[]).length}</div></div>
          <div><div className="text-[0.65rem] uppercase tracking-wider font-bold text-status-success font-header">Active</div><div className="text-lg font-bold text-status-success">{(usersData as User[]).filter(u => u.status === 'Active').length}</div></div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input type="text" placeholder="Search name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted" />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted cursor-pointer">
            <option value="All">All Roles</option>
            {(roles as any[]).map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <div className="panel-table flex flex-col min-h-[500px]">
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
          {errorMsg && <div className="text-status-error text-sm mt-2">{errorMsg}</div>}
          <div className="pt-4 border-t border-surface-border flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost font-header uppercase tracking-wider">Cancel</button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit || isSubmitting} className="btn btn-primary font-header uppercase tracking-wider">
                {isSubmitting ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
              </button>
            )} />
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId('')} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Are you sure you want to delete this user? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-surface-border">
            <button onClick={() => setDeleteId('')} className="px-4 py-2 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors">Cancel</button>
            <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} className="px-4 py-2 text-xs font-bold font-header uppercase tracking-wider text-white bg-status-error hover:bg-status-error-dark rounded shadow-sm border border-status-error-dark transition-colors disabled:opacity-50">
              {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
