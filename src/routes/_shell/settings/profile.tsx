import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profile } from '../../../api/core'
import { useEffect } from 'react'
import { User, Mail, Shield, Phone, Key } from 'lucide-react'

export const Route = createFileRoute('/_shell/settings/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profile.get,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (data) {
      setFormData({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
      })
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: (payload: any) => profile.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setIsEditing(false)
      setSuccessMsg('Profile updated successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to update profile.')
      setTimeout(() => setErrorMsg(''), 5000)
    }
  })

  const handleSave = () => {
    mutation.mutate(formData)
  }

  if (isLoading) {
    return <div className="p-8 text-center text-text-muted">Loading profile...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-text-primary">My Profile</h2>
          <p className="text-sm text-text-secondary mt-1">Manage your personal information and account settings.</p>
          {successMsg && <div className="text-sm text-status-success mt-2">{successMsg}</div>}
          {errorMsg && <div className="text-sm text-status-danger mt-2">{errorMsg}</div>}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="btn btn-ghost px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider">
                Cancel
              </button>
              <button onClick={handleSave} disabled={mutation.isPending} className="btn btn-primary px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider">
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn btn-secondary px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider">
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="card p-0 overflow-hidden overflow-x-auto">
        <div className="p-6 border-b border-surface-border flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl font-header border-2 border-primary/20">
            {formData.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-1 font-header">{formData.fullName || 'User'}</h3>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Shield size={14} className="text-primary" />
              <span className="font-bold uppercase tracking-wider">{data?.role || 'User'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <h4 className="font-bold text-primary font-header uppercase tracking-wide text-sm border-b border-surface-border pb-2">Personal Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><User size={12}/> Full Name</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm font-medium" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><Mail size={12}/> Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm font-medium" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><Phone size={12}/> Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm font-medium" 
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-muted/30 border-t border-surface-border">
          <h4 className="font-bold text-primary font-header uppercase tracking-wide text-sm border-b border-surface-border pb-2 mb-4">Security</h4>
          
          <div className="flex items-center justify-between max-w-2xl p-4 border border-surface-border rounded bg-surface">
            <div className="flex items-start gap-3">
              <Key size={18} className="text-text-muted mt-0.5" />
              <div>
                <div className="text-sm font-bold text-text-primary">Password</div>
                <div className="text-xs text-text-secondary mt-0.5">Last changed 3 months ago</div>
              </div>
            </div>
            <button className="btn btn-secondary px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

