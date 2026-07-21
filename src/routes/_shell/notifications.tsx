import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bell, AlertTriangle, CheckCircle, Info, PackageOpen } from 'lucide-react'
import clsx from 'clsx'
import { inventoryAlerts as inventoryAlertsApi } from '../../../api/warehouse'
import { invoices as invoicesApi } from '../../../api/finance'
import { dispatchRecord as dispatchRecordApi } from '../../../api/security'

export const Route = createFileRoute('/_shell/notifications')({
  component: NotificationsPage,
})

type NotificationType = 'info' | 'warning' | 'success' | 'alert'

type Notification = {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: string
  isRead: boolean
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Recently'
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function NotificationsPage() {
  const { data: alerts = [] } = useQuery({ queryKey: ['inventoryAlerts'], queryFn: inventoryAlertsApi.list })
  const { data: invList = [] } = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list })
  const { data: dispatches = [] } = useQuery({ queryKey: ['dispatchRecord'], queryFn: dispatchRecordApi.list })

  // Build a unified notification feed from real records
  const baseNotifications = useMemo<Notification[]>(() => {
    const items: Notification[] = []

    // Low / critical stock alerts
    alerts
      .filter((a: any) => a.status === 'low' || a.status === 'critical')
      .forEach((a: any) => {
        items.push({
          id: `alert-${a.id ?? a._id}`,
          title: `${a.status === 'critical' ? 'Critical' : 'Low'} Stock: ${a.grainType ?? a.itemName ?? 'Item'}`,
          message: `Current quantity is ${(a.currentQty ?? a.quantity ?? 0).toLocaleString()} kg — below threshold of ${(a.thresholdQty ?? a.threshold ?? 0).toLocaleString()} kg.`,
          type: a.status === 'critical' ? 'alert' : 'warning',
          timestamp: timeAgo(a.updatedAt ?? a.createdAt ?? ''),
          isRead: false,
        })
      })

    // Overdue invoices
    const today = new Date()
    invList
      .filter((i: any) => i.status !== 'paid' && i.dueDate && new Date(i.dueDate) < today)
      .slice(0, 5)
      .forEach((i: any) => {
        items.push({
          id: `inv-${i.id ?? i._id}`,
          title: `Invoice Overdue: ${i.invoiceNumber ?? i.id ?? 'Unknown'}`,
          message: `Invoice for ${i.clientName ?? i.supplierName ?? 'a client'} is overdue. Amount: ₦${(i.amount ?? 0).toLocaleString()}.`,
          type: 'alert',
          timestamp: timeAgo(i.dueDate),
          isRead: false,
        })
      })

    // Recent dispatches (last 5 cleared)
    dispatches
      .slice(0, 5)
      .forEach((d: any) => {
        items.push({
          id: `dispatch-${d.id ?? d._id}`,
          title: `Dispatch Cleared: ${d.truckNo ?? d.vehicleNo ?? 'Unknown Truck'}`,
          message: `Driver ${d.driverName ?? 'Unknown'} has been cleared through the gate.`,
          type: 'success',
          timestamp: timeAgo(d.date ?? d.createdAt ?? ''),
          isRead: true,
        })
      })

    return items
  }, [alerts, invList, dispatches])

  const [notifications, setNotifications] = useState<Notification[]>(baseNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // Sync when base data loads
  const merged = useMemo(() => {
    const readMap = new Map(notifications.map(n => [n.id, n.isRead]))
    return baseNotifications.map(n => ({ ...n, isRead: readMap.get(n.id) ?? n.isRead }))
  }, [baseNotifications, notifications])

  const markAllRead = () => {
    setNotifications(merged.map(n => ({ ...n, isRead: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(merged.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const displayedNotifications = filter === 'all' ? merged : merged.filter(n => !n.isRead)
  const unreadCount = merged.filter(n => !n.isRead).length

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="text-primary" />
          <h2 className="text-xl font-bold font-header tracking-tight text-text-primary">Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-status-danger text-text-inverse text-xs font-bold">
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

      <div className="panel-table flex flex-col flex-1 min-h-0">
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
                {filter === 'unread' ? <Bell size={32} /> : <PackageOpen size={32} />}
              </div>
              <h3 className="text-lg font-bold text-primary font-header">
                {filter === 'unread' ? "You're all caught up!" : "No activity yet"}
              </h3>
              <p className="text-sm text-text-muted max-w-sm mt-1">
                {filter === 'unread'
                  ? 'There are no unread notifications at the moment.'
                  : 'Notifications will appear here as stock alerts, overdue invoices, and dispatches are recorded.'}
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
                    {notification.type === 'alert' && <AlertTriangle className="text-status-danger" size={20} />}
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


