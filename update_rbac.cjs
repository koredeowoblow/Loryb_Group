const fs = require('fs');
const file = 'src/routes/_shell/settings/rbac.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace imports
content = content.replace(
  "import { Shield, Lock, Users, Check, Edit } from 'lucide-react'",
  "import { Shield, Lock, Users, Check, Edit, Trash2 } from 'lucide-react'\nimport { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'\nimport { roles as rolesApi } from '../../../api/core'\nimport { useEffect } from 'react'"
);

// Replace INITIAL_ROLES logic
content = content.replace(/const INITIAL_ROLES = \[[\s\S]*?\]\n/, '');

// Inside RbacPage
const hookStart = "  const [roles, setRoles] = useState(INITIAL_ROLES)\n  const [selectedRole, setSelectedRole] = useState(INITIAL_ROLES[0].id)\n  const [isEditing, setIsEditing] = useState(false)";

const newHooks = `
  const queryClient = useQueryClient()
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: rolesApi.list,
  })

  const [selectedRole, setSelectedRole] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteId, setDeleteId] = useState('')

  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].id)
    }
  }, [roles, selectedRole])
`;
content = content.replace(hookStart, newHooks);

// Replace activeRole assignment to handle empty states safely
content = content.replace(
  "const activeRole = roles.find(r => r.id === selectedRole)!",
  "const activeRole = roles.find(r => r.id === selectedRole) || roles[0]"
);

// handleEdit logic
content = content.replace(
  /const handleEdit = \(\) => \{[\s\S]*?setIsEditing\(true\)\n  \}/,
  `const handleEdit = () => {
    if (!activeRole) return
    setTempPermissions([...activeRole.permissions])
    setEditFormData({ name: activeRole.name, description: activeRole.description })
    setIsEditing(true)
    setIsCreating(false)
  }

  const handleCreateNew = () => {
    setTempPermissions([])
    setEditFormData({ name: '', description: '' })
    setIsCreating(true)
    setIsEditing(true)
  }`
);

// handleSave logic - replace with useMutation
content = content.replace(
  /const handleSave = \(\) => \{[\s\S]*?setIsEditing\(false\)\n  \}/,
  `
  const createMutation = useMutation({
    mutationFn: (payload: any) => rolesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setIsEditing(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) => rolesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setIsEditing(false)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setDeleteId('')
      setSelectedRole('')
    }
  })

  const handleSave = () => {
    const payload = {
      name: editFormData.name,
      description: editFormData.description,
      permissions: tempPermissions,
      isSystem: false
    }
    if (isCreating) {
      createMutation.mutate(payload)
    } else {
      updateMutation.mutate({ id: activeRole.id, payload })
    }
  }

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId)
  }
  `
);

// Render check for loading
content = content.replace(
  "return (",
  "if (isLoading || !activeRole) return <div className=\"p-8 text-center text-text-muted\">Loading roles...</div>;\n  return ("
);

// Create Custom Role Button
content = content.replace(
  "<button className=\"bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light\">\n          Create Custom Role\n        </button>",
  "<button onClick={handleCreateNew} className=\"bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light\">\n          Create Custom Role\n        </button>"
);

// Delete button next to Edit
content = content.replace(
  "<Edit size={14} /> Edit Role\n              </button>",
  "<Edit size={14} /> Edit Role\n              </button>\n              {!activeRole.isSystem && (\n                <button \n                  onClick={() => setDeleteId(activeRole.id)} \n                  className=\"px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-status-error hover:text-white hover:bg-status-error border border-status-error rounded shadow-sm transition-all flex items-center gap-1.5\"\n                >\n                  <Trash2 size={14} /> Delete\n                </button>\n              )}"
);

// Add Delete Confirmation Modal
content = content.replace(
  "</Modal>\n    </div>",
  `</Modal>
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId('')} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Are you sure you want to delete this role? This action cannot be undone and may affect users currently assigned to this role.</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-surface-border">
            <button onClick={() => setDeleteId('')} className="px-4 py-2 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={deleteMutation.isPending} className="px-4 py-2 text-xs font-bold font-header uppercase tracking-wider text-white bg-status-error hover:bg-status-error-dark rounded shadow-sm border border-status-error-dark transition-colors disabled:opacity-50">
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Role'}
            </button>
          </div>
        </div>
      </Modal>
    </div>`
);

// Form titles
content = content.replace(
  "<Modal isOpen={isEditing} onClose={handleCancel} title=\"Edit Role & Permissions\">",
  "<Modal isOpen={isEditing} onClose={handleCancel} title={isCreating ? 'Create Custom Role' : 'Edit Role & Permissions'}>"
);

fs.writeFileSync(file, content);
