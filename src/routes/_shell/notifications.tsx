import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import clsx from 'clsx'

export const Route = createFileRoute('/_shell/notifications')({
  component: NotificationsPage,
})

type Notification = {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'alert'
  timestamp: string
  isRead: boolean
}

const mockNotifications: Notification[] = [
  {
    id: 'n-1',
    title: 'Low Stock Alert: Maize',
    message: 'Warehouse A is running critically low on Maize (Current: 450kg). Please initiate procurement.',
    type: 'warning',
    timestamp: '10 minutes ago',
    isRead: false,
  },
  {
    id: 'n-2',
    title: 'New Trip Approved',
    message: 'Trip T-4091 to Abuja has been approved and fleet KJA-992-XD has been dispatched.',
    type: 'success',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: 'n-3',
    title: 'System Maintenance Scheduled',
    message: 'Loryb Ops Platform will undergo scheduled maintenance tonight at 02:00 AM WAT.',
    type: 'info',
    timestamp: '3 hours ago',
    isRead: true,
  },
  {
    id: 'n-4',
    title: 'Invoice Overdue',
    message: 'Invoice INV-2026-089 for supplier Greenville Logistics is now 3 days overdue.',
    type: 'alert',
    timestamp: '5 hours ago',
    isRead: true,
  },
  {
    id: 'n-5',
    title: 'Payroll Processed',
    message: 'June 2026 payroll has been successfully processed and disbursed.',
    type: 'success',
    timestamp: '1 day ago',
    isRead: true,
  },
]

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const displayedNotifications = filter === 'all' ? notifications : notifications.filter(n => !n.isRead)

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="text-primary" />
          <h2 className="text-xl font-bold font-header tracking-tight text-text-primary">Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-status-error text-white text-xs font-bold">
              {unreadCount} New
            </span>
          )}
        </div>
        <button 
          onClick={markAllRead}
          className="text-xs font-bold font-header uppercase tracking-wider text-primary hover:text-primary-hover transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="panel-table flex flex-col min-h-[500px]">
        <div className="flex border-b border-surface-border">
          <button 
            onClick={() => setFilter('all')}
            className={clsx(
              "px-6 py-3 text-sm font-bold font-header uppercase tracking-wider transition-colors",
              filter === 'all' ? "text-primary border-b-2 border-primary bg-primary/5" : "text-text-muted hover:text-text-primary hover:bg-surface-active/50"
            )}
          >
            All Notifications
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={clsx(
              "px-6 py-3 text-sm font-bold font-header uppercase tracking-wider transition-colors",
              filter === 'unread' ? "text-primary border-b-2 border-primary bg-primary/5" : "text-text-muted hover:text-text-primary hover:bg-surface-active/50"
            )}
          >
            Unread
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {displayedNotifications.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mb-4 text-surface-border">
                <Bell size={32} />
              </div>
              <h3 className="text-lg font-bold text-primary font-header">You're all caught up!</h3>
              <p className="text-sm text-text-muted max-w-sm mt-1">
                There are no {filter === 'unread' ? 'unread ' : ''}notifications at the moment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {displayedNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={clsx(
                    "p-4 hover:bg-surface-active/50 transition-colors flex gap-4 cursor-pointer",
                    !notification.isRead ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="shrink-0 mt-1">
                    {notification.type === 'info' && <Info className="text-primary" size={20} />}
                    {notification.type === 'warning' && <AlertTriangle className="text-status-warning" size={20} />}
                    {notification.type === 'success' && <CheckCircle className="text-status-success" size={20} />}
                    {notification.type === 'alert' && <AlertTriangle className="text-status-error" size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={clsx("text-sm font-bold", !notification.isRead ? "text-text-primary" : "text-text-secondary")}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-text-muted whitespace-nowrap ml-4">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className={clsx("text-sm", !notification.isRead ? "text-text-primary font-medium" : "text-text-muted")}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="shrink-0 self-center">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

