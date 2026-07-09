import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orgSettings } from '../../../api/core'

export const Route = createFileRoute('/_shell/settings/org-settings')({
  component: OrgSettingsPage,
})
function OrgSettingsPage() {
  const { isLoading } = useQuery({
    queryKey: ['org-settings'],
    queryFn: orgSettings.get,
  })
  
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security'>('general')
  const [isEditing, setIsEditing] = useState(false)

  // Normally we would use a form library here, but for layout purposes:
  const [formData, setFormData] = useState({
    companyName: 'Loryb Group of Companies',
    siteName: 'Greenville LNG Site',
    contactEmail: 'admin@loryb.com',
    contactPhone: '+234 800 123 4567',
    address: '123 Logistics Way, Lagos, Nigeria'
  })

  if (isLoading) {
    return <div className="p-8 text-center text-text-muted">Loading settings...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Organization Settings</h2>
          <p className="text-sm text-text-secondary mt-1">Manage global system configurations and company details.</p>
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
              Edit Settings
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-surface-border overflow-hidden overflow-x-auto">
        <div className="flex border-b border-surface-border">
          <button 
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 text-sm font-bold font-header uppercase tracking-wider transition-colors ${activeTab === 'general' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-text-primary hover:bg-surface-active/50'}`}
          >
            General Profile
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 text-sm font-bold font-header uppercase tracking-wider transition-colors ${activeTab === 'notifications' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-text-primary hover:bg-surface-active/50'}`}
          >
            Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 text-sm font-bold font-header uppercase tracking-wider transition-colors ${activeTab === 'security' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-text-primary hover:bg-surface-active/50'}`}
          >
            Security Policy
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-1">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-1">Operating Site</label>
                  <input 
                    type="text" 
                    value={formData.siteName}
                    onChange={e => setFormData({...formData, siteName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-1">Primary Email</label>
                  <input 
                    type="email" 
                    value={formData.contactEmail}
                    onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-1">Support Phone</label>
                  <input 
                    type="tel" 
                    value={formData.contactPhone}
                    onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1">Registered Address</label>
                <textarea 
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm" 
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-surface-border rounded bg-surface-muted/50">
                <div>
                  <h4 className="font-bold text-primary text-sm">System Outage Alerts</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Send SMS immediately when a site goes offline.</p>
                </div>
                <input type="checkbox" defaultChecked disabled={!isEditing} className="w-4 h-4 text-primary rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-4 border border-surface-border rounded bg-surface-muted/50">
                <div>
                  <h4 className="font-bold text-primary text-sm">Daily Financial Digest</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Receive an automated email summary at 18:00 daily.</p>
                </div>
                <input type="checkbox" defaultChecked disabled={!isEditing} className="w-4 h-4 text-primary rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-4 border border-surface-border rounded bg-surface-muted/50">
                <div>
                  <h4 className="font-bold text-primary text-sm">Critical Stock Warnings</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Trigger alerts to procurement when stock is below 10%.</p>
                </div>
                <input type="checkbox" defaultChecked disabled={!isEditing} className="w-4 h-4 text-primary rounded cursor-pointer" />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 border border-surface-border rounded bg-surface-muted/50">
                <div>
                  <h4 className="font-bold text-primary text-sm">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Require 2FA for all administrative roles.</p>
                </div>
                <input type="checkbox" defaultChecked disabled={!isEditing} className="w-4 h-4 text-primary rounded cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1">Session Timeout (Minutes)</label>
                <select disabled={!isEditing} className="w-full max-w-xs px-3 py-2 border border-surface-border rounded bg-surface-muted focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm">
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="never">Never (Not Recommended)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
