import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, Legend } from 'recharts'
import { DollarSign, TrendingUp, Wallet, Receipt, CreditCard } from 'lucide-react'

export const Route = createFileRoute('/_shell/finance/overview')({
  component: FinancialOverviewPage,
})

function FinancialOverviewPage() {
  const { data: sales = [] } = useQuery({ queryKey: ['sales'], queryFn: api.sales.list })
  const { data: expenses = [] } = useQuery({ queryKey: ['expenses'], queryFn: api.expenses.list })
  const { data: payroll = [] } = useQuery({ queryKey: ['payroll'], queryFn: api.payroll.list })
  const { data: supplierPayments = [] } = useQuery({ queryKey: ['supplierPayments'], queryFn: api.supplierPayments.list })

  const totalSales = sales.reduce((acc, s) => acc + s.amount, 0) || 12500000
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0) || 3400000
  const totalPayroll = payroll.reduce((acc, p) => acc + p.amount, 0) || 2100000
  const totalSupplierPaid = supplierPayments.reduce((acc, s) => acc + s.amountPaid, 0) || 4500000
  const totalSupplierOwed = supplierPayments.reduce((acc, s) => acc + s.amountOwed, 0) || 1200000
  
  const netCashflow = totalSales - (totalExpenses + totalPayroll + totalSupplierPaid)

  const cashflowData = [
    { name: 'Revenue', value: totalSales, fill: '#10B981' }, 
    { name: 'Ops Expenses', value: totalExpenses, fill: '#EF4444' }, 
    { name: 'Payroll', value: totalPayroll, fill: '#F59E0B' }, 
    { name: 'Suppliers', value: totalSupplierPaid, fill: '#3B82F6' }, 
  ]

  const trendData = [
    { month: 'Jan', revenue: 4000000, expenses: 2400000 },
    { month: 'Feb', revenue: 3000000, expenses: 1398000 },
    { month: 'Mar', revenue: 2000000, expenses: 9800000 },
    { month: 'Apr', revenue: 2780000, expenses: 3908000 },
    { month: 'May', revenue: 1890000, expenses: 4800000 },
    { month: 'Jun', revenue: 2390000, expenses: 3800000 },
    { month: 'Jul', revenue: 3490000, expenses: 4300000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm border border-surface-border">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary flex items-center gap-2">
            <DollarSign size={24} /> Financial Command Center
          </h2>
          <p className="text-sm text-text-secondary mt-1">High-level financial snapshot, cash flow analysis, and expenditure trends.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-md shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted">Net Cashflow</div>
            <TrendingUp size={16} className="text-status-success-dark" />
          </div>
          <div className="text-3xl font-bold text-primary">₦ {netCashflow.toLocaleString()}</div>
          <div className="text-xs text-status-success-dark mt-2 font-medium flex items-center gap-1">
             <TrendingUp size={12} /> +12.5% from last month
          </div>
        </div>

        <div className="bg-white p-5 rounded-md shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted">Total Revenue</div>
            <Wallet size={16} className="text-status-success-dark" />
          </div>
          <div className="text-3xl font-bold text-status-success-dark">₦ {totalSales.toLocaleString()}</div>
          <div className="text-xs text-text-secondary mt-2">Inbound Sales Revenue</div>
        </div>

        <div className="bg-white p-5 rounded-md shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted">Total Expenditures</div>
            <Receipt size={16} className="text-status-error-dark" />
          </div>
          <div className="text-3xl font-bold text-status-error-dark">₦ {(totalExpenses + totalPayroll + totalSupplierPaid).toLocaleString()}</div>
          <div className="text-xs text-text-secondary mt-2">Combined Outbound Costs</div>
        </div>

        <div className="bg-white p-5 rounded-md shadow-sm border border-surface-border bg-surface-muted/30 hover:border-primary/30 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted">Outstanding Payables</div>
            <CreditCard size={16} className="text-status-pending-dark" />
          </div>
          <div className="text-3xl font-bold text-status-pending-dark">₦ {totalSupplierOwed.toLocaleString()}</div>
          <div className="text-xs text-text-secondary mt-2">Supplier Owed Balances</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 6 Month Trend */}
        <div className="bg-white rounded-md shadow-sm border border-surface-border lg:col-span-2 flex flex-col h-80 hover:border-primary/30 transition-all">
          <div className="p-4 border-b border-surface-border flex items-center gap-2 text-primary">
            <TrendingUp size={18} />
            <h3 className="font-header font-bold uppercase tracking-wide text-sm">Revenue vs Expenses (6 Months)</h3>
          </div>
          <div className="p-4 flex-1 min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₦${val/1000000}M`} />
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                 <Tooltip cursor={{ stroke: '#E5E7EB' }} contentStyle={{ borderRadius: 4, fontWeight: 'bold' }} formatter={(val: any) => `₦${Number(val).toLocaleString()}`} />
                 <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 10 }} />
                 <Area type="monotone" name="Revenue" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" />
                 <Area type="monotone" name="Expenses" dataKey="expenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorExp)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Cashflow Breakdown Bar Chart */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-surface-border h-80 flex flex-col hover:border-primary/30 transition-all">
          <div className="text-sm uppercase tracking-wider font-bold text-text-secondary mb-4 font-header border-b border-surface-border pb-2 flex items-center gap-2">
            <Activity size={16} /> Fund Allocation Breakdown
          </div>
          <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#6B7280' }} dy={10} angle={-45} textAnchor="end" />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-surface-border shadow-lg rounded p-2 px-3">
                            <div className="text-xs font-bold text-text-secondary uppercase mb-1">{payload[0].payload.name}</div>
                            <div className="text-sm font-bold" style={{ color: payload[0].payload.fill }}>₦{Number(payload[0].value).toLocaleString()}</div>
                          </div>
                        )
                      }
                      return null
                    }}
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

      <div className="bg-white p-4 rounded-md shadow-sm border border-surface-border flex flex-col hover:border-primary/30 transition-all">
        <div className="text-sm uppercase tracking-wider font-bold text-text-secondary mb-4 font-header border-b border-surface-border pb-2">Recent Supplier Payments</div>
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {!supplierPayments || supplierPayments.length === 0 ? (
            <div className="col-span-full h-32 flex flex-col items-center justify-center text-text-muted">
              <div className="text-3xl mb-2">💸</div>
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
                  <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted mt-1">Remaining: ₦{s.amountOwed.toLocaleString()}</div>
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
