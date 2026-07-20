import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import clsx from 'clsx'
import { ClipboardList } from 'lucide-react'

export const Route = createFileRoute('/_shell/security/logs')({
  component: LogsPage,
})

type LogTab = 'Visitors' | 'Staff Movement' | 'Motorcycle' | 'Staff Attendance'

function LogsPage() {
  const [activeTab, setActiveTab] = useState<LogTab>('Visitors')

  const tabs: LogTab[] = ['Visitors', 'Staff Movement', 'Motorcycle', 'Staff Attendance']

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ClipboardList size={22} className="text-primary opacity-80" />
            Security Logs
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Unified view of all security activities</p>
        </div>
      </div>
      
      <div className="card p-0 overflow-hidden">
        <div className="border-b border-surface-border px-6 pt-4 bg-surface-muted/30">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'whitespace-nowrap pb-4 px-1 border-b-2 font-bold font-header uppercase tracking-wider text-xs transition-colors',
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
        
        <div className="p-8 flex flex-col items-center justify-center flex-1 min-h-0 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4 text-text-muted">
            <ClipboardList size={32} />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Content for {activeTab}</h3>
          <p className="text-text-muted max-w-md">
            This consolidated view is currently under construction. Please use the sidebar navigation to access individual log modules.
          </p>
        </div>
      </div>
    </div>
  )
}

