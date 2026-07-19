import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { User, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export const Route = createFileRoute('/_shell/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@loryb.com',
    phone: '+234 800 123 4567',
    role: 'Admin',
    department: 'Executive Management',
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <User size={22} className="text-primary opacity-80" />
          <div>
            <h2 className="text-xl font-bold text-text-primary">My Profile</h2>
            <p className="text-sm text-text-muted mt-0.5">Manage your personal information and account security.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsEditing(false)}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 pb-8 border-b border-surface-border text-center sm:text-left">
            <div className="w-20 h-20 shrink-0 rounded-full bg-primary text-text-inverse flex items-center justify-center font-bold text-2xl shadow-sm">
              {formData.firstName[0]}{formData.lastName[0]}
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">{formData.firstName} {formData.lastName}</h3>
              <p className="text-sm text-text-secondary mt-0.5">{formData.role} • {formData.department}</p>
              <div className="mt-3 flex gap-2">
                <Badge status="Active Account" withDot={false} />
                <span className="badge badge-neutral bg-surface-muted border-surface-border">
                  <ShieldCheck size={12} className="mr-0.5" /> 2FA Enabled
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1">Assigned Role</label>
                <input 
                  type="text" 
                  value={formData.role}
                  disabled={true}
                  className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted/50 text-text-muted outline-none disabled:opacity-60 disabled:cursor-not-allowed text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1">Department</label>
                <input 
                  type="text" 
                  value={formData.department}
                  disabled={true}
                  className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted/50 text-text-muted outline-none disabled:opacity-60 disabled:cursor-not-allowed text-sm" 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-surface-border mt-8">
              <h4 className="font-semibold text-text-primary text-sm mb-4">Security Settings</h4>
              <div className="space-y-4 flex flex-col items-start">
                <Button variant="secondary">
                  Change Password
                </Button>
                <Button variant="secondary">
                  Manage Two-Factor Authentication
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

