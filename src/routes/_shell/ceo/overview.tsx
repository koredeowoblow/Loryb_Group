import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../api'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { Shield, Warehouse, Truck, DollarSign, ChevronRight, AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/_shell/ceo/overview')({
  component: CEOOverviewPage,
})

function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-surface-border flex flex-col justify-center h-full">
      <div className="text-xs uppercase tracking-wider font-bold text-text-secondary mb-1 font-header">{title}</div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      {subtitle && <div className="text-xs text-text-muted mt-1">{subtitle}</div>}
    </div>
  )
}

function CEOOverviewPage() {
  // Top Level
  const { data: sales = [] } = useQuery({ queryKey: ['sales'], queryFn: api.sales.list })
  const { data: expenses = [] } = useQuery({ queryKey: ['expenses'], queryFn: api.expenses.list })
  const { data: trucks = [] } = useQuery({ queryKey: ['trucks'], queryFn: api.trucks.list })
  const { data: grn = [] } = useQuery({ queryKey: ['grn'], queryFn: api.grn.list })

  // Security
  const { data: suppliers = [] } = useQuery({ queryKey: ['suppliers'], queryFn: api.suppliers.list })
  const { data: dispatchRecord = [] } = useQuery({ queryKey: ['dispatchRecord'], queryFn: api.dispatchRecord.list })
  const { data: visitorLog = [] } = useQuery({ queryKey: ['visitorLog'], queryFn: api.visitorLog.list })


  // Warehouse
  const { data: inventoryAlerts = [] } = useQuery({ queryKey: ['inventoryAlerts'], queryFn: api.inventoryAlerts.list })

  // Logistics
  const { data: trips = [] } = useQuery({ queryKey: ['trips'], queryFn: api.trips.list })

  // Finance
  const { data: supplierPayments = [] } = useQuery({ queryKey: ['supplierPayments'], queryFn: api.supplierPayments.list })
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: api.invoices.list })

  // Top Stats Calcs
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0)
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0)
  const activeTrucks = trucks.filter(t => t.status === 'in-transit').length
  const totalIntake = grn.reduce((acc, g) => acc + g.netWeight, 0)

  // Security Calcs (simulating "today" simply by taking recent records since mock data is static)
  const todayIntakes = suppliers.length > 0 ? 4 : 0; // Mock stat
  const activeVisitors = visitorLog.filter(v => !v.timeOut).length || 2; 

  // Warehouse Calcs
  const lowStockAlerts = inventoryAlerts.filter(a => a.status === 'low' || a.status === 'critical').length || 1;
  const stockData = [
    { name: 'Maize', value: 45000, fill: '#002B79' },
    { name: 'Sorghum', value: 28000, fill: '#F59E0B' },
    { name: 'SoyaBeans', value: 15000, fill: '#10B981' }
  ]

  // Logistics Calcs
  const fleetIdle = trucks.filter(t => t.status === 'idle').length || 1;
  const fleetMaintenance = trucks.filter(t => t.status === 'maintenance').length || 1;
  const fleetTransit = trucks.filter(t => t.status === 'in-transit').length || 2;
  const fleetData = [
    { name: 'In-Transit', value: fleetTransit, fill: '#002B79' },
    { name: 'Idle', value: fleetIdle, fill: '#9CA3AF' },
    { name: 'Maintenance', value: fleetMaintenance, fill: '#EF4444' }
  ]
  const completedThisWeek = trips.filter(t => t.status === 'delivered').length || 12;
  const completedLastWeek = 8; // Simulated trend

  // Finance Calcs
  const outstandingSupplierTotal = supplierPayments.reduce((acc, p) => acc + (p.amountOwed - p.amountPaid), 0) || 450000;
  const outstandingInvoicesTotal = invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + i.amount, 0) || 1200000;
  
  // Dummy Trend Data
  const trendData = [
    { date: 'Week 1', revenue: 1200000, expenses: 800000 },
    { date: 'Week 2', revenue: 1500000, expenses: 950000 },
    { date: 'Week 3', revenue: 1800000, expenses: 850000 },
    { date: 'Week 4', revenue: 2100000, expenses: 1100000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-header tracking-tight text-primary">CEO Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} subtitle="Year to Date" />
        <StatCard title="Total Expenses" value={`₦${totalExpenses.toLocaleString()}`} subtitle="Year to Date" />
        <StatCard title="Fleet in Transit" value={activeTrucks} subtitle={`Out of ${trucks.length} Total Trucks`} />
        <StatCard title="Total Intake Volume" value={`${totalIntake.toLocaleString()} kg`} subtitle="Received via GRN" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Security Snapshot */}
        <div className="bg-white rounded-md shadow-sm border border-surface-border flex flex-col hover:border-primary/50 transition-colors">
          <div className="p-4 border-b border-surface-border flex justify-between items-center bg-surface-muted/30">
            <div className="flex items-center gap-2 text-primary">
              <Shield size={18} />
              <h3 className="font-header font-bold uppercase tracking-wide text-sm">Security Snapshot</h3>
            </div>
            <Link to="/security/gate-log" className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1">
              Full Dashboard <ChevronRight size={14} />
            </Link>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-muted rounded p-3 flex flex-col justify-center">
                <div className="text-2xl font-bold text-text-primary">{todayIntakes}</div>
                <div className="text-xs text-text-secondary font-medium">Supplier Intakes Today</div>
              </div>
              <div className="bg-surface-muted rounded p-3 flex flex-col justify-center">
                <div className="text-2xl font-bold text-text-primary">{activeVisitors}</div>
                <div className="text-xs text-text-secondary font-medium">Active Visitors</div>
              </div>
            </div>
            <div className="flex-1 mt-2">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Recent Gate Activity</h4>
              <div className="space-y-2">
                {visitorLog.slice(0, 3).map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center text-sm border-b border-surface-border pb-2 last:border-0">
                    <span className="font-medium text-text-primary">Visitor: {v.visitorName}</span>
                    <span className="text-xs text-text-muted">{v.timeIn}</span>
                  </div>
                ))}
                {dispatchRecord.slice(0, 2).map((d: any) => (
                  <div key={d.id} className="flex justify-between items-center text-sm border-b border-surface-border pb-2 last:border-0">
                    <span className="font-medium text-text-primary">Dispatch: {d.truckNo}</span>
                    <span className="text-xs text-status-success-dark font-medium">Cleared</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Warehouse Snapshot */}
        <div className="bg-white rounded-md shadow-sm border border-surface-border flex flex-col hover:border-primary/50 transition-colors">
          <div className="p-4 border-b border-surface-border flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary">
              <Warehouse size={18} />
              <h3 className="font-header font-bold uppercase tracking-wide text-sm">Warehouse Snapshot</h3>
            </div>
            <Link to="/warehouse/stock-overview" className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1">
              Full Dashboard <ChevronRight size={14} />
            </Link>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            {lowStockAlerts > 0 && (
              <div className="mb-4 bg-status-error/10 border border-status-error/20 p-2 rounded flex items-center gap-2 text-status-error-dark text-sm font-medium">
                <AlertTriangle size={16} />
                <span>{lowStockAlerts} active low-stock {lowStockAlerts === 1 ? 'alert' : 'alerts'}</span>
              </div>
            )}
            <div className="w-full">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={stockData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#6B7280' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 4, fontSize: 12, fontWeight: 'bold' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                    {stockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Logistics Snapshot */}
        <div className="bg-white rounded-md shadow-sm border border-surface-border flex flex-col hover:border-primary/50 transition-colors">
          <div className="p-4 border-b border-surface-border flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary">
              <Truck size={18} />
              <h3 className="font-header font-bold uppercase tracking-wide text-sm">Logistics Snapshot</h3>
            </div>
            <Link to="/logistics/fleet" className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1">
              Full Dashboard <ChevronRight size={14} />
            </Link>
          </div>
          <div className="p-4 flex-1 flex items-center justify-between gap-4">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={fleetData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                    {fleetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 4, fontSize: 12, fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              <div>
                <div className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Fleet Status</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" />In-Transit</span><span className="font-bold">{fleetTransit}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-surface-border" />Idle</span><span className="font-bold">{fleetIdle}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-error" />Maintenance</span><span className="font-bold">{fleetMaintenance}</span></div>
                </div>
              </div>
              <div className="pt-2 border-t border-surface-border">
                <div className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Weekly Trips Trend</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-text-primary">{completedThisWeek}</span>
                  <span className={`px-2 py-0.5 rounded text-[0.65rem] font-bold tracking-widest uppercase font-header ${completedThisWeek >= completedLastWeek ? 'bg-status-success/10 text-status-success-dark border border-status-success/20' : 'bg-status-error/10 text-status-error-dark border border-status-error/20'}`}>
                    {completedThisWeek >= completedLastWeek ? '+' : '-'}{Math.abs(completedThisWeek - completedLastWeek)} vs last week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Finance Snapshot */}
        <div className="bg-white rounded-md shadow-sm border border-surface-border flex flex-col hover:border-primary/50 transition-colors">
          <div className="p-4 border-b border-surface-border flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary">
              <DollarSign size={18} />
              <h3 className="font-header font-bold uppercase tracking-wide text-sm">Finance Snapshot</h3>
            </div>
            <Link to="/finance/overview" className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1">
              Full Dashboard <ChevronRight size={14} />
            </Link>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                 <div className="text-xs text-text-secondary font-medium mb-1">Outstanding Payables</div>
                 <div className="text-lg font-bold text-status-error-dark">₦{outstandingSupplierTotal.toLocaleString()}</div>
               </div>
               <div>
                 <div className="text-xs text-text-secondary font-medium mb-1">Outstanding Receivables</div>
                 <div className="text-lg font-bold text-status-success-dark">₦{outstandingInvoicesTotal.toLocaleString()}</div>
               </div>
            </div>
            <div className="w-full mt-2">
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={trendData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ stroke: '#E5E7EB' }} contentStyle={{ borderRadius: 4, fontSize: 12, fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#002B79" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="expenses" stroke="#F59E0B" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

