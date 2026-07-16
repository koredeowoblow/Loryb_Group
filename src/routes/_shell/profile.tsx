import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">My Profile</h2>
          <p className="text-sm text-text-secondary mt-1">Manage your personal information and account security.</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors">
                Cancel
              </button>
              <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-white bg-primary hover:bg-primary-hover rounded shadow-sm border border-primary-light transition-colors">
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-primary hover:text-primary-hover border border-primary rounded transition-colors">
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-none shadow-none border-2 border-surface-border overflow-hidden overflow-x-auto">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 pb-8 border-b border-surface-border text-center sm:text-left">
            <div className="w-24 h-24 shrink-0 rounded-full bg-primary text-white flex items-center justify-center font-bold font-header text-4xl shadow-sm border border-primary-light">
              {formData.firstName[0]}{formData.lastName[0]}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary font-header">{formData.firstName} {formData.lastName}</h3>
              <p className="text-text-secondary mt-1">{formData.role} • {formData.department}</p>
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-header uppercase tracking-wider bg-status-success text-white border-2 border-status-success-dark shadow-none">
                  Active Account
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-header uppercase tracking-wider bg-surface-muted text-text-secondary border border-surface-border">
                  2FA Enabled
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
              <h4 className="font-bold text-primary text-sm mb-4">Security Settings</h4>
              <div className="space-y-4">
                <button className="px-4 py-2 text-sm font-bold font-header tracking-wide text-text-primary border border-surface-border hover:bg-surface-active rounded transition-colors w-full sm:w-auto text-left">
                  Change Password
                </button>
                <button className="px-4 py-2 text-sm font-bold font-header tracking-wide text-text-primary border border-surface-border hover:bg-surface-active rounded transition-colors w-full sm:w-auto text-left block">
                  Manage Two-Factor Authentication
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

