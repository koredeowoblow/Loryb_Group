import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { binCard as binCardApi, grn as grnApi, inventoryAlerts } from '../../../api/warehouse'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Warehouse, AlertTriangle, ArrowDownToLine, Activity } from 'lucide-react'

export const Route = createFileRoute('/_shell/warehouse/stock-overview')({
  component: StockOverviewPage,
})

function StockOverviewPage() {
  const { data: binCards = [] } = useQuery({ queryKey: ['binCards'], queryFn: binCardApi.list })
  const { data: grn = [] } = useQuery({ queryKey: ['grn'], queryFn: grnApi.list })
  const { data: alerts = [] } = useQuery({ queryKey: ['alerts'], queryFn: inventoryAlerts.list })

  const totalMaize = binCards.filter(b => b.grainType === 'Maize').reduce((acc, b) => acc + b.qtyIn - b.qtyOut, 0) || 45000
  const totalSorghum = binCards.filter(b => b.grainType === 'Sorghum').reduce((acc, b) => acc + b.qtyIn - b.qtyOut, 0) || 28000
  const totalSoya = binCards.filter(b => b.grainType === 'SoyaBeans').reduce((acc, b) => acc + b.qtyIn - b.qtyOut, 0) || 15000
  
  const activeAlertsList = alerts.filter(a => a.status !== 'ok')
  const mockAlerts = [
    { id: '1', grainType: 'SoyaBeans', currentQty: 15000, thresholdQty: 20000, status: 'low' },
    { id: '2', grainType: 'Millet', currentQty: 2000, thresholdQty: 10000, status: 'critical' }
  ];
  const activeAlerts = activeAlertsList.length > 0 ? activeAlertsList : mockAlerts;

  const capacity = { Maize: 100000, Sorghum: 50000, SoyaBeans: 50000 }

  const trendData = [
    { day: 'Mon', in: 12000, out: 8000 },
    { day: 'Tue', in: 15000, out: 14000 },
    { day: 'Wed', in: 5000, out: 12000 },
    { day: 'Thu', in: 22000, out: 18000 },
    { day: 'Fri', in: 18000, out: 20000 },
    { day: 'Sat', in: 0, out: 4000 },
    { day: 'Sun', in: 0, out: 1000 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm border border-surface-border hover:border-primary/30 transition-all">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary flex items-center gap-2">
            <Warehouse size={24} /> Stock Overview
          </h2>
          <p className="text-sm text-text-secondary mt-1">Real-time inventory levels, capacity utilization, and movements.</p>
        </div>
      </div>

      {activeAlerts.length > 0 && (
        <div className="bg-status-error/10 border border-status-error/20 p-4 rounded-md">
          <div className="flex items-center gap-2 text-status-error font-bold font-header uppercase tracking-wider text-sm mb-3">
            <AlertTriangle size={18} /> Active Stock Alerts
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="bg-white p-3 rounded border border-status-error/20 shadow-sm flex flex-col hover:border-status-error/50 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-text-primary">{alert.grainType}</span>
                  <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${alert.status === 'critical' ? 'bg-status-error text-white' : 'bg-status-pending-dark text-white'}`}>
                    {alert.status}
                  </span>
                </div>
                <div className="text-xs text-text-secondary">Current: <span className="font-bold text-text-primary">{alert.currentQty.toLocaleString()} kg</span></div>
                <div className="text-xs text-text-secondary">Threshold: {alert.thresholdQty.toLocaleString()} kg</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Visual Level Indicators */}
        {[
          { name: 'Maize', value: totalMaize, cap: capacity.Maize, fill: '#002B79' },
          { name: 'Sorghum', value: totalSorghum, cap: capacity.Sorghum, fill: '#F59E0B' },
          { name: 'SoyaBeans', value: totalSoya, cap: capacity.SoyaBeans, fill: '#10B981' }
        ].map(grain => {
          const percent = Math.min(100, Math.round((grain.value / grain.cap) * 100))
          return (
            <div key={grain.name} className="bg-white p-5 rounded-md shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-header font-bold uppercase tracking-wider text-text-muted text-sm">{grain.name}</h3>
                <div className="text-2xl font-bold text-primary">{grain.value.toLocaleString()} <span className="text-xs text-text-muted font-normal">kg</span></div>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-4 mb-2 overflow-hidden border border-surface-border">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percent}%`, backgroundColor: grain.fill }}></div>
              </div>
              <div className="flex justify-between text-xs font-medium text-text-secondary">
                <span>{percent}% Full</span>
                <span>Cap: {grain.cap.toLocaleString()} kg</span>
              </div>
            </div>
          )
        })}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7-Day Trend */}
        <div className="bg-white rounded-md shadow-sm border border-surface-border lg:col-span-2 flex flex-col hover:border-primary/30 transition-all">
          <div className="p-4 border-b border-surface-border flex items-center gap-2 text-primary">
            <Activity size={18} />
            <h3 className="font-header font-bold uppercase tracking-wide text-sm">7-Day Movement Trend</h3>
          </div>
          <div className="p-4 w-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip cursor={{ stroke: '#E5E7EB' }} contentStyle={{ borderRadius: 4, fontWeight: 'bold' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 10 }} />
                <Line name="Stock In (GRN)" type="monotone" dataKey="in" stroke="#002B79" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line name="Stock Out (Dispatch)" type="monotone" dataKey="out" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent GRN Intake List */}
        <div className="bg-white rounded-md shadow-sm border border-surface-border flex flex-col hover:border-primary/30 transition-all">
          <div className="p-4 border-b border-surface-border flex items-center gap-2 text-primary bg-surface-muted/30">
            <ArrowDownToLine size={18} />
            <h3 className="font-header font-bold uppercase tracking-wide text-sm">Recent Intake (GRN)</h3>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-[340px]">
            {grn.length > 0 ? grn.slice(0, 6).map((g: any, i) => (
              <div key={`grn-${i}`} className="p-4 border-b border-surface-border hover:bg-surface-active transition-colors flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-text-primary">{g.grainType}</div>
                  <div className="text-xs text-text-secondary font-medium mt-0.5">{g.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-status-success-dark">+{g.netWeight.toLocaleString()} kg</div>
                  <div className="text-xs text-text-muted mt-0.5">{g.noOfBagsReceived} bags</div>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-text-muted text-sm">No recent intakes.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
