import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

export const Route = createFileRoute('/_shell/settings/user-management')({
  component: UserManagementPage,
})

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive' | 'Pending'
  lastLogin: string
}

const mockUsers: User[] = [
  { id: 'U-1001', name: 'Alhaji Yusuf', email: 'yusuf@loryb.com', role: 'CEO', status: 'Active', lastLogin: '2026-07-07 14:32' },
  { id: 'U-1002', name: 'Chioma Adeyemi', email: 'chioma@loryb.com', role: 'Finance', status: 'Active', lastLogin: '2026-07-07 09:15' },
  { id: 'U-1003', name: 'Emeka Nwosu', email: 'emeka@loryb.com', role: 'Logistics', status: 'Active', lastLogin: '2026-07-07 08:05' },
  { id: 'U-1004', name: 'Babatunde Ojo', email: 'baba@loryb.com', role: 'Security', status: 'Active', lastLogin: '2026-07-07 06:30' },
  { id: 'U-1005', name: 'Aisha Bello', email: 'aisha@loryb.com', role: 'Warehouse', status: 'Inactive', lastLogin: '2026-06-25 18:00' },
  { id: 'U-1006', name: 'Samuel Kalu', email: 'samuel@loryb.com', role: 'Admin', status: 'Active', lastLogin: '2026-07-07 10:20' },
  { id: 'U-1007', name: 'Nnamdi Okafor', email: 'nnamdi@loryb.com', role: 'Logistics', status: 'Pending', lastLogin: 'Never' },
  { id: 'U-1008', name: 'Folashade Ige', email: 'fola@loryb.com', role: 'Finance', status: 'Active', lastLogin: '2026-07-06 17:45' },
]

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('name', { header: 'Full Name' }),
  columnHelper.accessor('email', { header: 'Email Address' }),
  columnHelper.accessor('role', { 
    header: 'Role',
    cell: info => <span className="font-medium">{info.getValue()}</span>
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue()
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-header uppercase tracking-wider ${
          status === 'Active' ? 'bg-status-success/10 text-status-success' :
          status === 'Inactive' ? 'bg-status-error/10 text-status-error' :
          'bg-status-warning/10 text-status-warning'
        }`}>
          {status}
        </span>
      )
    }
  }),
  columnHelper.accessor('lastLogin', { header: 'Last Login' }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: () => (
      <button className="text-primary hover:text-primary-hover font-bold font-header text-xs uppercase tracking-wider p-1 transition-colors">
        Edit
      </button>
    )
  })
]

function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'All' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">User Management</h2>
          <p className="text-sm text-text-secondary mt-1">Manage staff access and active platform accounts.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light">
          Invite User
        </button>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm border border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Users</div>
            <div className="text-lg font-bold text-primary">{mockUsers.length}</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-status-success font-header">Active</div>
            <div className="text-lg font-bold text-status-success">{mockUsers.filter(u => u.status === 'Active').length}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="CEO">CEO</option>
            <option value="Admin">Admin</option>
            <option value="Security">Security</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Logistics">Logistics</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-surface-border overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-border border-b border-surface-border">
          <thead className="bg-surface-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left text-[0.7rem] font-bold text-text-secondary uppercase tracking-wider border-b border-surface-border font-header">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-surface-border text-sm">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-surface-active/60 transition-colors group cursor-pointer">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-text-primary border-b border-surface-border/50">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-4xl text-surface-border mb-2">👥</div>
                    <h3 className="text-base font-bold text-primary font-header">No users found</h3>
                    <p className="text-sm text-text-muted max-w-sm">
                      We couldn't find any users matching your current search criteria.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
