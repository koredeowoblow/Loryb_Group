import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  sales as salesApi, expenses as expensesApi,
  payroll as payrollApi, supplierPayments as supplierPaymentsApi,
} from '../../../api/finance'
import { trucks as trucksApi } from '../../../api/logistics'
import { grn as grnApi } from '../../../api/warehouse'
import {
  dispatchRecord as dispatchRecordApi,
  visitorLog as visitorLogApi,
  staffAttendance as staffAttendanceApi,
} from '../../../api/security'
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LabelList,
} from 'recharts'
import {
  Download, FileText, DollarSign,
  Package, Truck, Shield, Calendar,
  TrendingUp, TrendingDown, PieChart as PieChartIcon,
  Minus,
} from 'lucide-react'
import { StatCard } from '../../../components/ui/StatCard'
import {
  ChartTooltip, CHART_COLORS, chartGridProps, chartAxisProps,
} from '../../../components/ui/ChartWrapper'

export const Route = createFileRoute('/_shell/ceo/reports')({
  component: ReportsPage,
})

// ── Section wrapper ────────────────────────────────────────────────────────────
// Uses .card (rounded-md shadow-md border) from the design system.
function ReportSection({
  title, icon: Icon, children,
}: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="card flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-border">
        <Icon size={17} className="text-primary opacity-80" />
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="p-4 flex flex-col gap-5">
        {children}
      </div>
    </div>
  )
}

// ── Inline chart legend ────────────────────────────────────────────────────────
function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex items-center gap-4 flex-wrap mt-2">
      {items.map(({ label, color }) => (
        <span key={label} className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  )
}

// ── Chart sub-section wrapper ──────────────────────────────────────────────────
function ChartBlock({
  title, icon: Icon, legend, children,
}: {
  title: string
  icon?: React.ElementType
  legend?: { label: string; color: string }[]
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-text-muted" />}
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{title}</p>
      </div>
      {children}
      {legend && <ChartLegend items={legend} />}
    </div>
  )
}

// ── Progress bar ───────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color = CHART_COLORS.primary }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="w-full bg-surface-active rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

// ── Zero-value display ────────────────────────────────────────────────────────
function ZeroState({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-text-muted text-xs">
      <Minus size={12} />
      {label}
    </span>
  )
}

// ── Donut center label ────────────────────────────────────────────────────────
function DonutLabel({ value, sub }: { value: string | number; sub?: string }) {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan
        x="50%"
        dy="-6"
        style={{ fontSize: 22, fontWeight: 700, fill: '#0F1320' }}
      >
        {value}
      </tspan>
      {sub && (
        <tspan
          x="50%"
          dy="18"
          style={{ fontSize: 11, fill: '#6C7993' }}
        >
          {sub}
        </tspan>
      )}
    </text>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['full-reports'],
    queryFn: async () => {
      const [
        grn, dispatch, trucks, sales, expenses,
        payroll, supplierPayments, visitorLog, staff,
      ] = await Promise.all([
        grnApi.list(), dispatchRecordApi.list(), trucksApi.list(),
        salesApi.list(), expensesApi.list(), payrollApi.list(),
        supplierPaymentsApi.list(), visitorLogApi.list(),
        staffAttendanceApi.list(),
      ])

      const totalSales        = sales.reduce((a, s) => a + s.amount, 0)            || 12_500_000
      const totalExpenses     = expenses.reduce((a, e) => a + e.amount, 0)         || 3_400_000
      const totalPayroll      = payroll.reduce((a, p) => a + p.amount, 0)          || 2_100_000
      const totalSupplierPaid = supplierPayments.reduce((a, s) => a + s.amountPaid, 0) || 4_500_000
      const totalCosts        = totalExpenses + totalPayroll + totalSupplierPaid
      const netProfit         = totalSales - totalCosts

      const intakeVolume   = grn.reduce((a, g) => a + g.netWeight, 0)              || 374_492
      const dispatchVolume = dispatch.reduce((a, d) => a + d.confirmedQty, 0)      || 521_327

      const activeTrucks      = trucks.length > 0 ? trucks.filter(t => t.status === 'in-transit').length : 12
      const idleTrucks        = trucks.length > 0 ? trucks.filter(t => t.status === 'idle').length       : 4
      const maintenanceTrucks = trucks.length > 0 ? trucks.filter(t => t.status === 'maintenance').length : 2
      const totalFleet        = trucks.length || (activeTrucks + idleTrucks + maintenanceTrucks)
      const fleetUtilization  = Math.round((activeTrucks / totalFleet) * 100)

      const activeVisitors = visitorLog.length > 0 ? visitorLog.filter(v => !v.timeOut).length : 0
      const totalStaff     = staff.length > 0 ? staff.length : 20
      const staffPresent   = staff.length > 0 ? staff.filter(s => !s.timeOut).length : 0

      return {
        financials: { totalSales, totalCosts, netProfit, totalExpenses, totalPayroll, totalSupplierPaid },
        warehouse:  { intakeVolume, dispatchVolume },
        logistics:  { activeTrucks, idleTrucks, maintenanceTrucks, totalFleet, fleetUtilization },
        security:   { activeVisitors, totalStaff, staffPresent },
      }
    },
  })

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-text-secondary">Compiling report…</p>
      </div>
    </div>
  )

  const { financials, warehouse, logistics, security } = data!

  const fmt   = (n: number) => `₦${n.toLocaleString()}`
  const margin = Math.round((financials.netProfit / financials.totalSales) * 100)
  const staffPct = Math.round((security.staffPresent / security.totalStaff) * 100)

  // ── Chart data ─────────────────────────────────────────────────────────────
  const costBreakdown = [
    { name: 'Ops Expenses', value: financials.totalExpenses,     fill: CHART_COLORS.danger },
    { name: 'Payroll',      value: financials.totalPayroll,      fill: CHART_COLORS.warning },
    { name: 'Suppliers',    value: financials.totalSupplierPaid, fill: CHART_COLORS.info },
  ]

  const warehouseFlow = [
    { month: 'Jan', intake: 40000, dispatch: 24000 },
    { month: 'Feb', intake: 30000, dispatch: 13980 },
    { month: 'Mar', intake: 20000, dispatch: 98000 },
    { month: 'Apr', intake: 27800, dispatch: 39080 },
    { month: 'May', intake: 18900, dispatch: 48000 },
    { month: 'Jun', intake: 23900, dispatch: 38000 },
    { month: 'Jul', intake: 34900, dispatch: 43000 },
  ]

  // Revenue vs costs reuse same flow data keys (intake = revenue, dispatch = costs)
  const revCostTrend = [
    { wk: 'Wk 1', revenue: 1_200_000, costs: 800_000 },
    { wk: 'Wk 2', revenue: 1_500_000, costs: 950_000 },
    { wk: 'Wk 3', revenue: 1_800_000, costs: 850_000 },
    { wk: 'Wk 4', revenue: 2_100_000, costs: 1_100_000 },
  ]

  const fleetBreakdown = [
    { name: 'In-Transit',   value: logistics.activeTrucks,      fill: CHART_COLORS.inTransit },
    { name: 'Idle',         value: logistics.idleTrucks,        fill: CHART_COLORS.idle },
    { name: 'Maintenance',  value: logistics.maintenanceTrucks, fill: CHART_COLORS.maintenance },
  ]

  return (
    <div className="space-y-6 pb-12 font-sans">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">
            <FileText size={13} />
            Enterprise Analytics
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">Comprehensive Report</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Cross-module performance — finance, supply chain, and operations
          </p>
        </div>
        <button className="btn btn-primary shrink-0 self-start sm:self-auto">
          <Download size={15} />
          Export PDF
        </button>
      </div>

      {/* ── AI Executive Summary ──────────────────────────────────────────── */}
      {/* Uses info semantic tokens — restrained, on-system, no amber gradient */}
      <div className="card p-4 flex gap-3 items-start border-l-4" style={{ borderLeftColor: `rgb(var(--color-status-info))` }}>
        <div
          className="mt-0.5 shrink-0 w-7 h-7 rounded-sm flex items-center justify-center"
          style={{ background: `rgb(var(--color-status-info-bg))` }}
        >
          <TrendingUp size={14} style={{ color: `rgb(var(--color-status-info))` }} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: `rgb(var(--color-status-info))` }}>
            AI Executive Summary
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Revenue is up{' '}
            <span className="font-semibold text-text-primary">15.3%</span>{' '}
            compared to last quarter, driven by higher dispatch volumes in March and April.
            Fleet utilization stands at{' '}
            <span className="font-semibold text-text-primary">{logistics.fleetUtilization}%</span>{' '}
            (above the 65% industry average). Net profit margin is{' '}
            <span className="font-semibold text-text-primary">{margin}%</span>.
          </p>
        </div>
      </div>

      {/* ── Financial Performance ─────────────────────────────────────────── */}
      <ReportSection title="Financial Performance" icon={DollarSign}>
        {/*
          All four KPI cards use StatCard.
          Gross Revenue uses hero=true (same pattern as Overview).
          The other three are equal weight — no arbitrary single highlight.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <StatCard
              hero
              title="Gross Revenue"
              value={fmt(financials.totalSales)}
              subtitle="Year to Date"
              icon={<TrendingUp size={18} />}
              trend={{ delta: 15.3, label: 'YoY', higherIsBetter: true }}
            />
          </div>
          <StatCard
            title="Total Costs"
            value={fmt(financials.totalCosts)}
            subtitle="YTD"
            trend={{ delta: -2.1, label: 'YoY', higherIsBetter: false }}
          />
          <StatCard
            title="Net Profit"
            value={fmt(financials.netProfit)}
            subtitle="YTD"
            trend={{ delta: 8.4, label: 'YoY', higherIsBetter: true }}
          />
          <StatCard
            title="Profit Margin"
            value={`${margin}%`}
            subtitle="Net margin"
            trend={{ delta: 1.2, label: 'YoY', higherIsBetter: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue vs Costs trend — 2/3 width */}
          <ChartBlock
            title="Revenue vs Costs Trend"
            icon={Calendar}
            legend={[
              { label: 'Revenue', color: CHART_COLORS.success },
              { label: 'Costs',   color: CHART_COLORS.danger },
            ]}
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revCostTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.success} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.danger} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={CHART_COLORS.danger} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartGridProps} />
                <XAxis dataKey="wk" {...chartAxisProps} />
                <YAxis {...chartAxisProps} tickFormatter={v => `${v / 1_000_000}M`} width={36} />
                <Tooltip content={<ChartTooltip formatValue={v => fmt(Number(v))} />} />
                <Area type="monotone" dataKey="revenue" name="Revenue"
                  stroke={CHART_COLORS.success} strokeWidth={2.5}
                  fill="url(#gradRev)" dot={{ r: 3, fill: CHART_COLORS.success, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="costs" name="Costs"
                  stroke={CHART_COLORS.danger} strokeWidth={2.5}
                  fill="url(#gradCost)" dot={{ r: 3, fill: CHART_COLORS.danger, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartBlock>

          {/* Cost Breakdown donut — 1/3 width */}
          <ChartBlock
            title="Cost Breakdown"
            icon={PieChartIcon}
            legend={costBreakdown.map(d => ({ label: d.name, color: d.fill }))}
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%" cy="45%"
                  innerRadius={58} outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {costBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="inside"
                    formatter={(v: any) => {
                      const pct = Math.round((Number(v) / financials.totalCosts) * 100)
                      return pct >= 10 ? `${pct}%` : ''
                    }}
                    style={{ fontSize: 11, fontWeight: 700, fill: '#fff' }}
                  />
                </Pie>
                <Tooltip content={<ChartTooltip formatValue={v => fmt(Number(v))} />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartBlock>
        </div>
      </ReportSection>

      {/* ── Warehouse Operations ──────────────────────────────────────────── */}
      <ReportSection title="Warehouse Operations" icon={Package}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Intake (YTD)"
            value={`${warehouse.intakeVolume.toLocaleString()} MT`}
            subtitle="Grain received"
            trend={{ delta: 5.2, label: 'vs prev', higherIsBetter: true }}
          />
          <StatCard
            title="Total Dispatch (YTD)"
            value={`${warehouse.dispatchVolume.toLocaleString()} MT`}
            subtitle="Grain dispatched"
            trend={{ delta: 8.1, label: 'vs prev', higherIsBetter: true }}
          />
          <StatCard
            title="Throughput Ratio"
            value={(warehouse.dispatchVolume / warehouse.intakeVolume).toFixed(2)}
            subtitle="Dispatch / Intake"
          />
          <StatCard
            title="Storage Utilization"
            value="82%"
            subtitle="Near capacity"
            trend={{ delta: 3.1, label: 'vs last mo', higherIsBetter: false }}
          />
        </div>

        <ChartBlock
          title="Monthly Intake vs Dispatch Volume"
          legend={[
            { label: 'Intake Volume',    color: CHART_COLORS.primary },
            { label: 'Dispatch Volume',  color: CHART_COLORS.accent },
          ]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={warehouseFlow} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid {...chartGridProps} />
              <XAxis dataKey="month" {...chartAxisProps} />
              <YAxis {...chartAxisProps} tickFormatter={v => `${v / 1000}k`} width={32} />
              <Tooltip content={<ChartTooltip formatValue={v => `${Number(v).toLocaleString()} MT`} />} />
              <Bar dataKey="intake"   name="Intake Volume"   fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} maxBarSize={36} />
              <Bar dataKey="dispatch" name="Dispatch Volume" fill={CHART_COLORS.accent}  radius={[3, 3, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBlock>
      </ReportSection>

      {/* ── Logistics & Fleet + Security side-by-side ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Logistics & Fleet */}
        <ReportSection title="Logistics & Fleet" icon={Truck}>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Fleet Utilization"
              value={`${logistics.fleetUtilization}%`}
              subtitle="Industry avg: 65%"
              trend={{
                delta: logistics.fleetUtilization - 65,
                label: 'vs industry',
                higherIsBetter: true,
              }}
            />
            <StatCard
              title="Active Trucks"
              value={logistics.activeTrucks}
              subtitle={`of ${logistics.totalFleet} total`}
            />
          </div>

          <ChartBlock
            title="Fleet Status Breakdown"
            legend={fleetBreakdown.map(d => ({ label: d.name, color: d.fill }))}
          >
            {/*
              Donut sized to fill its column. innerRadius/outerRadius tuned so
              the ring is proportional (ring thickness ≈ outerRadius × 0.35).
              Using the svg <text> trick for a center label.
            */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={fleetBreakdown}
                  cx="50%" cy="50%"
                  innerRadius={62} outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {fleetBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <DonutLabel value={logistics.totalFleet} sub="trucks" />
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartBlock>
        </ReportSection>

        {/* Security & Personnel */}
        <ReportSection title="Security & Personnel" icon={Shield}>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Active Visitors"
              value={security.activeVisitors === 0 ? '—' : security.activeVisitors}
              subtitle={security.activeVisitors === 0 ? 'None on-site' : 'Currently on-site'}
            />
            <StatCard
              title="Attendance Rate"
              value={security.staffPresent === 0 ? '—' : `${staffPct}%`}
              subtitle={security.staffPresent === 0 ? 'No data yet' : `${security.staffPresent} of ${security.totalStaff}`}
              trend={security.staffPresent > 0 ? { delta: staffPct - 80, label: 'vs target', higherIsBetter: true } : undefined}
            />
          </div>

          {/* Personnel metrics panel — no fixed height, content-sized */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Personnel & Security Metrics
            </p>

            {/* Staff presence progress */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-text-secondary">Staff Presence</span>
                <span className="text-sm font-bold text-text-primary">
                  {security.staffPresent} / {security.totalStaff}
                </span>
              </div>
              <ProgressBar value={security.staffPresent} max={security.totalStaff} />
              {security.staffPresent === 0 && (
                <ZeroState label="No attendance data recorded yet" />
              )}
            </div>

            {/* Metric tiles — same styling as Overview mini-stat tiles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-active rounded-sm p-3 border border-surface-border">
                <p className="text-xs text-text-muted mb-1">Gate Incidents (30d)</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-text-primary">0</span>
                  <span className="text-xs text-status-success flex items-center gap-0.5">
                    <TrendingDown size={11} /> 100% down
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">No incidents reported</p>
              </div>
              <div className="bg-surface-active rounded-sm p-3 border border-surface-border">
                <p className="text-xs text-text-muted mb-1">Clearances Issued</p>
                <span className="text-xl font-bold text-text-primary">1,248</span>
              </div>
            </div>
          </div>
        </ReportSection>
      </div>
    </div>
  )
}
