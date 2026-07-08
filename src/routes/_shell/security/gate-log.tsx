import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../api'
import { Shield, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/security/gate-log')({
  component: GateLogDashboard,
})

function GateLogDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['security-dashboard-detailed'],
    queryFn: async () => {
      const [visitors, dispatch, staff, motorcycles, suppliers] = await Promise.all([
        api.visitorLog.list(),
        api.dispatchRecord.list(),
        api.staffAttendance.list(),
        api.motorcycleLog.list(),
        api.suppliers.list()
      ])
      
      const activeVisitors = visitors.filter(v => !v.timeOut).length
      const todayDispatch = dispatch.length 
      const staffPresent = staff.filter(s => !s.timeOut).length
      const activeBikes = motorcycles.filter(m => !m.timeOut).length
      const todaySuppliers = suppliers.length

      return { visitors, dispatch, staff, motorcycles, activeVisitors, todayDispatch, staffPresent, activeBikes, todaySuppliers }
    },
  })

  if (isLoading) {
    return <div className="p-8 text-center text-text-muted">Loading Security Dashboard...</div>
  }

  const volumeData = [
    { day: 'Mon', intake: 12, dispatch: 8 },
    { day: 'Tue', intake: 19, dispatch: 15 },
    { day: 'Wed', intake: 15, dispatch: 11 },
    { day: 'Thu', intake: 22, dispatch: 18 },
    { day: 'Fri', intake: 18, dispatch: 20 },
    { day: 'Sat', intake: 5, dispatch: 4 },
    { day: 'Sun', intake: 2, dispatch: 1 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm border border-surface-border">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary flex items-center gap-2">
            <Shield size={24} /> Security Command Center
          </h2>
          <p className="text-sm text-text-secondary mt-1">Real-time overview of gate operations and facility access.</p>
        </div>
        <button className="bg-status-error hover:bg-status-error-dark text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors flex items-center gap-2">
          Emergency Lockdown
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-md shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Today's Suppliers</div>
          <div className="text-3xl font-bold text-primary">{data?.todaySuppliers || 0}</div>
          <div className="text-xs text-status-success-dark mt-1">Processed</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Dispatches Today</div>
          <div className="text-3xl font-bold text-primary">{data?.todayDispatch || 0}</div>
          <div className="text-xs text-status-success-dark mt-1">Cleared for exit</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Active Visitors</div>
          <div className="text-3xl font-bold text-primary">{data?.activeVisitors || 0}</div>
          <div className="text-xs text-status-pending-dark mt-1">Currently on premises</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Staff Present</div>
          <div className="text-3xl font-bold text-primary">{data?.staffPresent || 0}</div>
          <div className="text-xs text-text-secondary mt-1">Clocked in today</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Active Bikes</div>
          <div className="text-3xl font-bold text-primary">{data?.activeBikes || 0}</div>
          <div className="text-xs text-text-secondary mt-1">Dispatched out</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Volume Chart */}
        <div className="bg-white rounded-md shadow-sm border border-surface-border lg:col-span-2 flex flex-col hover:border-primary/30 transition-all">
          <div className="p-4 border-b border-surface-border">
            <h3 className="font-header font-bold uppercase tracking-wide text-sm text-primary">Traffic Volume (Last 7 Days)</h3>
          </div>
          <div className="p-4 w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 4 }} />
                <Bar dataKey="intake" name="Intake" fill="#002B79" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="dispatch" name="Dispatch" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-md shadow-sm border border-surface-border flex flex-col hover:border-primary/30 transition-all">
          <div className="p-4 border-b border-surface-border flex justify-between items-center bg-surface-muted/30">
            <h3 className="font-header font-bold uppercase tracking-wide text-sm text-primary flex items-center gap-2"><Clock size={16}/> Live Activity Feed</h3>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-[300px]">
             {data?.visitors.slice(0, 4).map((v: any, i) => (
                <div key={`v-${i}`} className="p-3 border-b border-surface-border hover:bg-surface-active transition-colors flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-text-primary">Visitor: {v.visitorName}</div>
                    <div className="text-xs text-text-secondary">{v.purpose}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-text-muted">{v.timeIn}</div>
                    <Badge status={v.timeOut ? "inactive" : "active"} />
                  </div>
                </div>
             ))}
             {data?.dispatch.slice(0, 3).map((d: any, i) => (
                <div key={`d-${i}`} className="p-3 border-b border-surface-border hover:bg-surface-active transition-colors flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-text-primary">Dispatch: {d.truckNo}</div>
                    <div className="text-xs text-text-secondary">Driver: {d.driverName}</div>
                  </div>
                  <div className="text-right">
                    <Badge status="success" />
                  </div>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  )
}
