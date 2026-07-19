import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Shield, Lock, Users, Check, Edit } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'

export const Route = createFileRoute('/_shell/settings/rbac')({
  component: RbacPage,
})

type Permission = {
  id: string
  name: string
  category: string
}



const ALL_PERMISSIONS: Permission[] = [
  { id: 'view_financials', name: 'View Financial Data', category: 'Finance' },
  { id: 'manage_payroll', name: 'Manage Payroll', category: 'Finance' },
  { id: 'approve_payments', name: 'Approve Payments', category: 'Finance' },
  { id: 'manage_users', name: 'Manage System Users', category: 'Admin' },
  { id: 'manage_roles', name: 'Manage RBAC', category: 'Admin' },
  { id: 'view_security_logs', name: 'View Security Logs', category: 'Security' },
  { id: 'manage_gate', name: 'Manage Gate Access', category: 'Security' },
  { id: 'view_inventory', name: 'View Inventory', category: 'Warehouse' },
  { id: 'manage_stock', name: 'Manage Stock Levels', category: 'Warehouse' },
  { id: 'manage_fleet', name: 'Manage Fleet', category: 'Logistics' },
  { id: 'view_logistics', name: 'View Logistics Data', category: 'Logistics' },
]

const INITIAL_ROLES = [
  {
    id: 'ceo',
    name: 'CEO',
    description: 'Executive access to all modules and system configurations.',
    permissions: ALL_PERMISSIONS.map(p => p.id), // All permissions
    isSystem: true
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'System administration and user management.',
    permissions: ['manage_users', 'manage_roles', 'view_security_logs', 'view_inventory', 'view_logistics', 'view_financials'],
    isSystem: true
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial operations and payroll management.',
    permissions: ['view_financials', 'manage_payroll', 'approve_payments'],
    isSystem: false
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'Inventory and stock operations.',
    permissions: ['view_inventory', 'manage_stock'],
    isSystem: false
  },
  {
    id: 'logistics',
    name: 'Logistics',
    description: 'Fleet and transportation management.',
    permissions: ['view_logistics', 'manage_fleet'],
    isSystem: false
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Gate operations and facility access control.',
    permissions: ['view_security_logs', 'manage_gate'],
    isSystem: false
  }
]

function RbacPage() {
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [selectedRole, setSelectedRole] = useState(INITIAL_ROLES[0].id)
  const [isEditing, setIsEditing] = useState(false)
  const [tempPermissions, setTempPermissions] = useState<string[]>([])

  const [editFormData, setEditFormData] = useState({ name: '', description: '' })

  const activeRole = roles.find(r => r.id === selectedRole) || roles[0]

  const handleEdit = () => {
    setTempPermissions([...activeRole.permissions])
    setEditFormData({ name: activeRole.name, description: activeRole.description })
    setIsEditing(true)
  }

  const handleSave = () => {
    setRoles(prev => prev.map(r => r.id === selectedRole ? { 
      ...r, 
      name: editFormData.name,
      description: editFormData.description,
      permissions: tempPermissions 
    } : r))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const togglePermission = (permId: string) => {
    if (!isEditing) return
    if (activeRole.isSystem) return // System permissions cannot be changed

    setTempPermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(p => p !== permId)
        : [...prev, permId]
    )
  }

  // Group permissions by category
  const categories = Array.from(new Set(ALL_PERMISSIONS.map(p => p.category)))

  if (!activeRole) return <div className="p-8 text-center text-text-muted">Loading roles...</div>;
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-text-primary flex items-center gap-2">
            <Lock size={24} /> RBAC & Permissions
          </h2>
          <p className="text-sm text-text-secondary mt-1">Manage role-based access control and system permissions.</p>
        </div>
        <button className="btn btn-primary font-header uppercase tracking-wider">
          Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Roles Sidebar */}
        <div className="bg-surface panel-table overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          <div className="p-4 border-b border-surface-border bg-surface-muted/30">
            <h3 className="font-header font-bold uppercase tracking-wide text-sm text-primary flex items-center gap-2">
              <Users size={16} /> User Roles
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => {
                  if (isEditing) return;
                  setSelectedRole(role.id)
                }}
                disabled={isEditing}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  selectedRole === role.id 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'hover:bg-surface-active text-text-primary disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <div className="font-bold text-sm font-header">{role.name}</div>
                <div className={`text-xs mt-1 line-clamp-1 ${selectedRole === role.id ? 'text-primary-light' : 'text-text-secondary'}`}>
                  {role.isSystem ? 'System Role' : 'Custom Role'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Configuration */}
        <div className="lg:col-span-3 bg-surface panel-table flex flex-col h-[calc(100vh-12rem)]">
          <div className="p-6 border-b border-surface-border flex justify-between items-start bg-surface-muted/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-text-primary font-header">{activeRole.name}</h3>
                {activeRole.isSystem && (
                  <span className="px-2 py-0.5 bg-status-pending/20 text-status-pending-dark text-[0.65rem] font-bold uppercase tracking-wider rounded">System Role</span>
                )}
              </div>
              <p className="text-sm text-text-secondary">{activeRole.description}</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleEdit} 
                className="btn btn-primary px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider flex items-center gap-1.5"
              >
                <Edit size={14} /> Edit Role
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeRole.id === 'ceo' && (
              <div className="mb-6 p-4 bg-status-info/10 border border-status-info/20 rounded-md text-sm text-status-info-dark flex items-start gap-3">
                <Shield size={18} className="mt-0.5 shrink-0" />
                <p><strong>Administrator Note:</strong> The CEO role is a protected system role. It inherently possesses all permissions across the platform and cannot be modified.</p>
              </div>
            )}

            <div className="space-y-8">
              {categories.map(category => {
                const categoryPerms = ALL_PERMISSIONS.filter(p => p.category === category)
                return (
                  <div key={category}>
                    <h4 className="font-bold text-text-primary border-b border-surface-border pb-2 mb-4 font-header uppercase tracking-wide text-sm flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-accent rounded-sm" />
                      {category} Module
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {categoryPerms.map(perm => {
                        const isGranted = activeRole.permissions.includes(perm.id)
                        
                        return (
                          <div 
                            key={perm.id}
                            className={`p-3 rounded border transition-all flex items-start gap-3 select-none opacity-80 ${
                              isGranted ? 'bg-primary/5 border-primary/30' : 'bg-surface-muted/30 border-surface-border'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                              isGranted ? 'bg-primary border-primary text-white' : 'bg-surface border-surface-border text-transparent'
                            }`}>
                              <Check size={14} />
                            </div>
                            <div>
                              <div className={`text-sm font-bold ${isGranted ? 'text-primary' : 'text-text-secondary'}`}>
                                {perm.name}
                              </div>
                              <div className="text-xs text-text-muted mt-0.5">
                                Allow {perm.name.toLowerCase()}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={handleCancel} title={'Edit Role & Permissions'}>
        <div className="space-y-4">
          {activeRole.isSystem && (
            <div className="p-3 bg-status-info/10 border border-status-info/20 rounded-md text-xs text-status-info-dark flex items-start gap-2">
              <Shield size={14} className="mt-0.5 shrink-0" />
              <p><strong>System Role:</strong> This role and its permissions are protected and cannot be modified.</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Role Name</label>
            <input 
              type="text" 
              value={editFormData.name}
              disabled={activeRole.isSystem}
              onChange={e => setEditFormData({...editFormData, name: e.target.value})}
              className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors text-sm font-bold text-text-primary disabled:opacity-60 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Description</label>
            <textarea 
              value={editFormData.description}
              rows={2}
              disabled={activeRole.isSystem}
              onChange={e => setEditFormData({...editFormData, description: e.target.value})}
              className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors text-sm text-text-primary disabled:opacity-60 disabled:cursor-not-allowed" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Permissions</label>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border border-surface-border p-3 rounded bg-surface-muted/30">
              {categories.map(category => {
                const categoryPerms = ALL_PERMISSIONS.filter(p => p.category === category)
                return (
                  <div key={category} className="mb-4 last:mb-0">
                    <h5 className="text-[0.65rem] font-bold text-primary uppercase tracking-wider mb-2">{category}</h5>
                    <div className="space-y-1">
                      {categoryPerms.map(perm => {
                        const isGranted = tempPermissions.includes(perm.id)
                        return (
                          <label key={perm.id} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-surface-active rounded transition-colors">
                            <input 
                              type="checkbox" 
                              checked={isGranted}
                              disabled={activeRole.isSystem}
                              onChange={() => togglePermission(perm.id)}
                              className="w-3.5 h-3.5 text-primary rounded cursor-pointer border-surface-border disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="text-xs font-bold text-text-secondary">{perm.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex justify-end gap-2">
            <button onClick={handleCancel} className="btn btn-ghost font-header uppercase tracking-wider">
              {activeRole.isSystem ? 'Close' : 'Cancel'}
            </button>
            {!activeRole.isSystem && (
              <button onClick={handleSave} className="btn btn-primary font-header uppercase tracking-wider">
                Save Changes
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

