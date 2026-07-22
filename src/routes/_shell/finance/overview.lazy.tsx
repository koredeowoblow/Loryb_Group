import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { sales as salesApi, expenses as expensesApi, payroll as payrollApi, supplierPayments as supplierPaymentsApi } from '../../../api/finance'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, Legend } from 'recharts'
import { DollarSign, TrendingUp, Wallet, Receipt, CreditCard, Banknote } from 'lucide-react'
import { CHART_COLORS, ChartTooltip, chartGridProps } from '../../../components/ui/ChartWrapper'

import { PageSkeleton } from '../../../components/ui/Skeleton'

function FinancialOverviewPage() {
  const { data: sales = [], isLoading: isLoadingSales } = useQuery({ queryKey: ['sales'], queryFn: salesApi.list })
  const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery({ queryKey: ['expenses'], queryFn: expensesApi.list })
  const { data: payroll = [], isLoading: isLoadingPayroll } = useQuery({ queryKey: ['payroll'], queryFn: payrollApi.list })
  const { data: supplierPayments = [], isLoading: isLoadingSupplierPayments } = useQuery({ queryKey: ['supplierPayments'], queryFn: supplierPaymentsApi.list })

  if (isLoadingSales || isLoadingExpenses || isLoadingPayroll || isLoadingSupplierPayments) {
    return <PageSkeleton />
  }

  const totalSales = sales.reduce((acc, s) => acc + s.amount, 0)
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)
  const totalPayroll = payroll.reduce((acc, p) => acc + p.amount, 0)
  const totalSupplierPaid = supplierPayments.reduce((acc, s) => acc + s.amountPaid, 0)
  const totalSupplierOwed = supplierPayments.reduce((acc, s) => acc + Math.max(0, (s.amountOwed ?? 0) - (s.amountPaid ?? 0)), 0)
  
  const netCashflow = totalSales - (totalExpenses + totalPayroll + totalSupplierPaid)

  const cashflowData = [
    { name: 'Revenue', value: totalSales, fill: CHART_COLORS.success }, 
    { name: 'Ops Expenses', value: totalExpenses, fill: CHART_COLORS.danger }, 
    { name: 'Payroll', value: totalPayroll, fill: CHART_COLORS.warning }, 
    { name: 'Suppliers', value: totalSupplierPaid, fill: CHART_COLORS.primary }, 
  ]

  // Build last 6 months of revenue vs expenses from real records
  const trendData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - (5 - i))
    const year = d.getFullYear()
    const month = d.getMonth()
    const label = d.toLocaleString('default', { month: 'short' })
    const rev = sales
      .filter((s: any) => { const sd = new Date(s.date ?? s.createdAt ?? 0); return sd.getFullYear() === year && sd.getMonth() === month })
      .reduce((a: number, s: any) => a + (s.amount ?? 0), 0)
    const exp = expenses
      .filter((e: any) => { const ed = new Date(e.date ?? e.createdAt ?? 0); return ed.getFullYear() === year && ed.getMonth() === month })
      .reduce((a: number, e: any) => a + (e.amount ?? 0), 0)
    return { month: label, revenue: rev, expenses: exp }
  })

  // Month-over-month cashflow growth
  const thisMonth = trendData[trendData.length - 1]
  const lastMonth = trendData[trendData.length - 2]
  const lastNetCashflow = (lastMonth?.revenue ?? 0) - (lastMonth?.expenses ?? 0)
  const growthPct = lastNetCashflow !== 0
    ? Math.round(((netCashflow - lastNetCashflow) / Math.abs(lastNetCashflow)) * 100)
    : null
  // Suppress unused variable warning from thisMonth
  void thisMonth

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center panel p-4">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary flex items-center gap-2">
            <DollarSign size={24} /> Financial Command Center
          </h2>
          <p className="text-sm text-text-secondary mt-1">High-level financial snapshot, cash flow analysis, and expenditure trends.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel p-5 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted">Net Cashflow</div>
            <TrendingUp size={16} className="text-status-success-dark" />
          </div>
          <div className="text-3xl font-bold text-primary">₦ {netCashflow.toLocaleString()}</div>
          <div className="text-xs text-status-success-dark mt-2 font-medium flex items-center gap-1">
          {growthPct !== null ? (
            <>
              <TrendingUp size={12} />
              {growthPct >= 0 ? '+' : ''}{growthPct}% from last month
            </>
          ) : (
            <span>No prior month data</span>
          )}
          </div>
        </div>

        <div className="panel p-5 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted">Total Revenue</div>
            <Wallet size={16} className="text-status-success-dark" />
          </div>
          <div className="text-3xl font-bold text-status-success-dark">₦ {totalSales.toLocaleString()}</div>
          <div className="text-xs text-text-secondary mt-2">Inbound Sales Revenue</div>
        </div>

        <div className="panel p-5 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted">Total Expenditures</div>
            <Receipt size={16} className="text-status-danger-dark" />
          </div>
          <div className="text-3xl font-bold text-status-danger-dark">₦ {(totalExpenses + totalPayroll + totalSupplierPaid).toLocaleString()}</div>
          <div className="text-xs text-text-secondary mt-2">Combined Outbound Costs</div>
        </div>

        <div className="panel p-5 bg-surface-muted/30 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted">Outstanding Payables</div>
            <CreditCard size={16} className="text-status-warning" />
          </div>
          <div className="text-3xl font-bold text-status-warning">₦ {totalSupplierOwed.toLocaleString()}</div>
          <div className="text-xs text-text-secondary mt-2">Supplier Owed Balances</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 6 Month Trend */}
        <div className="bg-surface panel-table lg:col-span-2 flex flex-col h-80 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="p-4 border-b border-surface-border/50 flex items-center gap-2 text-primary">
            <TrendingUp size={18} />
            <h3 className="font-header font-bold uppercase tracking-wide text-sm">Revenue vs Expenses (6 Months)</h3>
          </div>
          <div className="p-4 flex-1 min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3}/>
                     <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.3}/>
                     <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₦${val/1000000}M`} />
                 <CartesianGrid {...chartGridProps} />
                 <Tooltip cursor={{ stroke: 'rgb(var(--color-surface-border))' }} content={<ChartTooltip formatValue={(val: any) => `₦${Number(val).toLocaleString()}`} />} />
                 <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 10 }} />
                 <Area type="monotone" name="Revenue" dataKey="revenue" stroke={CHART_COLORS.success} fillOpacity={1} fill="url(#colorRev)" />
                 <Area type="monotone" name="Expenses" dataKey="expenses" stroke={CHART_COLORS.danger} fillOpacity={1} fill="url(#colorExp)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Cashflow Breakdown Bar Chart */}
        <div className="panel p-4 h-80 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="text-sm uppercase tracking-wider font-bold text-text-secondary mb-4 font-header border-b border-surface-border pb-2 flex items-center gap-2">
            <Activity size={16} /> Fund Allocation Breakdown
          </div>
          <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid {...chartGridProps} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#6B7280' }} dy={10} angle={-45} textAnchor="end" />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={<ChartTooltip formatValue={(val: any) => `₦${Number(val).toLocaleString()}`} />}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {cashflowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="panel p-4 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all">
        <div className="text-sm uppercase tracking-wider font-bold text-text-secondary mb-4 font-header border-b border-surface-border pb-2">Recent Supplier Payments</div>
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {!supplierPayments || supplierPayments.length === 0 ? (
            <div className="col-span-full h-32 flex flex-col items-center justify-center text-text-muted">
              <Banknote size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />
              <div className="text-sm font-medium">No recent payments</div>
            </div>
          ) : (
            supplierPayments.slice(0, 6).map((s: any) => (
              <div key={s.id} className="flex justify-between items-center p-4 bg-surface-active rounded border border-surface-border/50 hover:border-primary/30 transition-colors">
                <div>
                  <div className="font-bold text-sm text-primary">{s.supplierName}</div>
                  <div className="text-xs text-text-muted mt-1">{s.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-status-success-dark">₦ {s.amountPaid.toLocaleString()}</div>
                  <div className="text-xs uppercase tracking-wider font-bold text-text-muted mt-1">Remaining: ₦{s.amountOwed.toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function Activity({ size, className }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  )
}

export const Route = createLazyFileRoute('/_shell/finance/overview')({
  component: FinancialOverviewPage,
})
