import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../api'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'
import { Download, FileText, TrendingUp, TrendingDown, DollarSign, Package, Truck, Shield, Calendar, Sparkles, Filter, PieChart as PieChartIcon } from 'lucide-react'

export const Route = createFileRoute('/_shell/ceo/reports')({
  component: ReportsPage,
})

function ReportSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-surface-border">
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-surface-border/50">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <Icon size={22} />
        </div>
        <h3 className="text-xl font-bold font-header text-primary tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function StatBox({ label, value, trend, trendValue, highlight = false }: { label: string; value: string | number; trend?: 'up' | 'down'; trendValue?: string; highlight?: boolean }) {
  return (
    <div className={`p-5 rounded-xl border transition-all ${highlight ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-muted/30 border-surface-border hover:shadow-sm hover:bg-white'}`}>
      <p className={`text-xs uppercase tracking-wider font-bold mb-2 font-header ${highlight ? 'text-white/80' : 'text-text-muted'}`}>{label}</p>
      <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
      {trend && trendValue && (
        <div className={`text-xs mt-3 font-semibold flex items-center gap-1.5 ${highlight ? 'text-white/90' : trend === 'up' ? 'text-status-success' : 'text-status-error'}`}>
          <div className={`p-1 rounded-full ${highlight ? 'bg-white/20' : trend === 'up' ? 'bg-status-success/10' : 'bg-status-error/10'}`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          </div>
          {trendValue}
        </div>
      )}
    </div>
  )
}

function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['full-reports'],
    queryFn: async () => {
      const [
        grn, dispatch, trucks, sales, expenses, 
        payroll, supplierPayments, visitorLog, staff
      ] = await Promise.all([
        api.grn.list(), api.dispatchRecord.list(), api.trucks.list(), 
        api.sales.list(), api.expenses.list(), api.payroll.list(), 
        api.supplierPayments.list(), api.visitorLog.list(), 
        api.staffAttendance.list()
      ])

      // Financials
      const totalSales = sales.reduce((acc, s) => acc + s.amount, 0) || 12500000;
      const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0) || 3400000;
      const totalPayroll = payroll.reduce((acc, p) => acc + p.amount, 0) || 2100000;
      const totalSupplierPaid = supplierPayments.reduce((acc, s) => acc + s.amountPaid, 0) || 4500000;
      const totalCosts = totalExpenses + totalPayroll + totalSupplierPaid;
      const netProfit = totalSales - totalCosts;

      // Warehouse
      const intakeVolume = grn.reduce((acc, g) => acc + g.netWeight, 0) || 374492;
      const dispatchVolume = dispatch.reduce((acc, d) => acc + d.confirmedQty, 0) || 521327;

      // Logistics
      const activeTrucks = trucks.length > 0 ? trucks.filter(t => t.status === 'in-transit').length : 12;
      const idleTrucks = trucks.length > 0 ? trucks.filter(t => t.status === 'idle').length : 4;
      const maintenanceTrucks = trucks.length > 0 ? trucks.filter(t => t.status === 'maintenance').length : 2;
      const fleetUtilization = trucks.length > 0 ? Math.round((activeTrucks / trucks.length) * 100) : 75;

      // Security
      const activeVisitors = visitorLog.length > 0 ? visitorLog.filter(v => !v.timeOut).length : 12;
      const totalStaff = staff.length > 0 ? staff.length : 145;
      const staffPresent = staff.length > 0 ? staff.filter(s => !s.timeOut).length : 118;

      return {
        financials: { totalSales, totalCosts, netProfit, totalExpenses, totalPayroll, totalSupplierPaid },
        warehouse: { intakeVolume, dispatchVolume },
        logistics: { activeTrucks, idleTrucks, maintenanceTrucks, fleetUtilization },
        security: { activeVisitors, totalStaff, staffPresent }
      }
    },
  })

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-text-secondary animate-pulse">Compiling Enterprise Report...</p>
      </div>
    </div>
  )

  const { financials, warehouse, logistics, security } = data || {};

  const costBreakdownData = [
    { name: 'Ops Expenses', value: financials?.totalExpenses || 0, fill: '#EF4444' },
    { name: 'Payroll', value: financials?.totalPayroll || 0, fill: '#F59E0B' },
    { name: 'Suppliers', value: financials?.totalSupplierPaid || 0, fill: '#3B82F6' },
  ]

  const warehouseFlowData = [
    { month: 'Jan', intake: 40000, dispatch: 24000 },
    { month: 'Feb', intake: 30000, dispatch: 13980 },
    { month: 'Mar', intake: 20000, dispatch: 98000 },
    { month: 'Apr', intake: 27800, dispatch: 39080 },
    { month: 'May', intake: 18900, dispatch: 48000 },
    { month: 'Jun', intake: 23900, dispatch: 38000 },
    { month: 'Jul', intake: 34900, dispatch: 43000 },
  ]

  const fleetData = [
    { name: 'Active', value: logistics?.activeTrucks || 0, fill: '#10B981' },
    { name: 'Idle', value: logistics?.idleTrucks || 0, fill: '#9CA3AF' },
    { name: 'Maintenance', value: logistics?.maintenanceTrucks || 0, fill: '#EF4444' },
  ]

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 bg-white p-6 rounded-xl shadow-sm border border-surface-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2 font-header">
            <FileText size={16} /> Enterprise Analytics
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Comprehensive Report
          </h2>
          <p className="text-sm text-text-secondary mt-1 max-w-lg">
            A deep dive into cross-module performance metrics spanning finance, supply chain, and operations.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex items-center bg-surface-muted border border-surface-border rounded-lg p-1">
            <button className="px-4 py-1.5 text-sm font-semibold rounded-md bg-white shadow-sm text-primary">Monthly</button>
            <button className="px-4 py-1.5 text-sm font-semibold rounded-md text-text-muted hover:text-text-primary transition-colors">Quarterly</button>
            <button className="px-4 py-1.5 text-sm font-semibold rounded-md text-text-muted hover:text-text-primary transition-colors">YTD</button>
          </div>
          
          <button className="bg-white hover:bg-surface-muted text-text-primary border border-surface-border px-4 py-2 rounded-lg shadow-sm text-sm font-bold transition-colors flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
          
          <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg shadow-md text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 p-5 rounded-xl flex gap-4 items-start shadow-sm">
        <div className="bg-amber-100 p-2 rounded-full shrink-0">
          <Sparkles className="text-amber-600" size={20} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 text-sm mb-1 font-header uppercase tracking-wider">AI Executive Summary</h4>
          <p className="text-amber-800 text-sm leading-relaxed">
            Revenue is up <strong className="font-bold">15.3%</strong> compared to last quarter, driven by higher dispatch volumes in March and April. 
            Fleet utilization is optimal at <strong className="font-bold">{logistics?.fleetUtilization}%</strong>, though maintenance costs have slightly increased. 
            Overall net profit margins remain extremely healthy at <strong className="font-bold">{Math.round(((financials?.netProfit || 0) / (financials?.totalSales || 1)) * 100)}%</strong>.
          </p>
        </div>
      </div>

      <ReportSection title="Financial Performance" icon={DollarSign}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatBox label="Gross Revenue" value={`₦${financials?.totalSales.toLocaleString()}`} trend="up" trendValue="+15.3% YoY" highlight />
          <StatBox label="Total Costs" value={`₦${financials?.totalCosts.toLocaleString()}`} trend="down" trendValue="-2.1% YoY" />
          <StatBox label="Net Profit" value={`₦${financials?.netProfit.toLocaleString()}`} trend="up" trendValue="+8.4% YoY" />
          <StatBox label="Profit Margin" value={`${Math.round(((financials?.netProfit || 0) / (financials?.totalSales || 1)) * 100)}%`} trend="up" trendValue="+1.2% YoY" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-sm font-bold font-header uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
              <Calendar size={16} /> Revenue vs Costs Trend
            </h4>
            <div className="bg-surface-muted/20 border border-surface-border rounded-xl p-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={warehouseFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '5 5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => `₦${Number(value).toLocaleString()}`} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="intake" name="Revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="dispatch" name="Costs" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h4 className="text-sm font-bold font-header uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
              <PieChartIcon size={16} /> Cost Breakdown
            </h4>
            <div className="bg-surface-muted/20 border border-surface-border rounded-xl p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={costBreakdownData} cx="50%" cy="45%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip cursor={false} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => `₦${Number(value).toLocaleString()}`} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </ReportSection>

      <ReportSection title="Warehouse Operations" icon={Package}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatBox label="Total Intake (YTD)" value={`${(warehouse?.intakeVolume || 0).toLocaleString()} MT`} trend="up" trendValue="+5.2% vs Prev" />
          <StatBox label="Total Dispatch (YTD)" value={`${(warehouse?.dispatchVolume || 0).toLocaleString()} MT`} trend="up" trendValue="+8.1% vs Prev" />
          <StatBox label="Throughput Ratio" value={((warehouse?.dispatchVolume || 0) / ((warehouse?.intakeVolume || 1))).toFixed(2)} />
          <StatBox label="Active Storage Utilization" value="82%" trend="up" trendValue="Near capacity" />
        </div>
        
        <div className="flex flex-col">
          <h4 className="text-sm font-bold font-header uppercase tracking-wider text-text-secondary mb-4">Monthly Intake vs Dispatch Volume</h4>
          <div className="bg-surface-muted/20 border border-surface-border rounded-xl p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={warehouseFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => `${Number(value).toLocaleString()} MT`} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600 }} />
                <Bar dataKey="intake" name="Intake Volume" fill="#002B79" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="dispatch" name="Dispatch Volume" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ReportSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ReportSection title="Logistics & Fleet" icon={Truck}>
          <div className="grid grid-cols-2 gap-5 mb-6">
            <StatBox label="Fleet Utilization" value={`${logistics?.fleetUtilization}%`} trend={logistics?.fleetUtilization && logistics.fleetUtilization > 70 ? 'up' : 'down'} trendValue="Industry Avg: 65%" />
            <StatBox label="Active Trucks" value={logistics?.activeTrucks || 0} />
          </div>
          <div className="flex flex-col">
             <h4 className="text-sm font-bold font-header uppercase tracking-wider text-text-secondary mb-4">Fleet Status Breakdown</h4>
             <div className="bg-surface-muted/20 border border-surface-border rounded-xl p-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={fleetData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                    {fleetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip cursor={false} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
             </div>
          </div>
        </ReportSection>

        <ReportSection title="Security & Personnel" icon={Shield}>
          <div className="grid grid-cols-2 gap-5 mb-6">
            <StatBox label="Active Visitors on Site" value={security?.activeVisitors || 0} />
            <StatBox label="Staff Attendance Rate" value={`${Math.round(((security?.staffPresent || 0) / (security?.totalStaff || 1)) * 100)}%`} trend="up" trendValue="Healthy" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-bold font-header uppercase tracking-wider text-text-secondary mb-4">Personnel & Security Metrics</h4>
            <div className="bg-surface-muted/20 border border-surface-border rounded-xl p-6 flex flex-col justify-center gap-6 h-[282px]">
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold font-header uppercase tracking-wider text-text-secondary">Staff Presence</span>
                  <span className="font-bold text-primary text-lg">{security?.staffPresent} / {security?.totalStaff}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.round(((security?.staffPresent || 0) / (security?.totalStaff || 1)) * 100)}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-white border border-surface-border p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Gate Incidents (30d)</div>
                  <div className="text-2xl font-bold text-status-warning flex items-center gap-2">
                    0 <span className="text-xs text-status-success flex items-center"><TrendingDown size={12} /> 100%</span>
                  </div>
                </div>
                <div className="bg-white border border-surface-border p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Clearances Issued</div>
                  <div className="text-2xl font-bold text-primary">1,248</div>
                </div>
              </div>
            </div>
          </div>
        </ReportSection>
      </div>

    </div>
  )
}
