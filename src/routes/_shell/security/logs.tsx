import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import clsx from 'clsx'

export const Route = createFileRoute('/_shell/security/logs')({
  component: LogsPage,
})

type LogTab = 'Visitors' | 'Staff Movement' | 'Motorcycle' | 'Staff Attendance'

function LogsPage() {
  const [activeTab, setActiveTab] = useState<LogTab>('Visitors')

  const tabs: LogTab[] = ['Visitors', 'Staff Movement', 'Motorcycle', 'Staff Attendance']

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-header tracking-tight text-primary">Security Logs</h2>
      
      <div className="bg-white rounded-md shadow-sm border border-surface-border">
        <div className="border-b border-surface-border px-6 pt-4">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text-primary hover:border-surface-border'
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          <p className="text-text-muted">Content for {activeTab} goes here...</p>
        </div>
      </div>
    </div>
  )
}
