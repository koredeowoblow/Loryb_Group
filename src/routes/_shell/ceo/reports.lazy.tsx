import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageSkeleton } from "../../../components/ui/Skeleton";
import {
  sales as salesApi,
  expenses as expensesApi,
  payroll as payrollApi,
  supplierPayments as supplierPaymentsApi,
} from "../../../api/finance";
import { trucks as trucksApi } from "../../../api/logistics";
import { grn as grnApi } from "../../../api/warehouse";
import {
  dispatchRecord as dispatchRecordApi,
  visitorLog as visitorLogApi,
  staffAttendance as staffAttendanceApi,
} from "../../../api/security";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  FileText,
  DollarSign,
  Package,
  Truck,
  Shield,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  Minus,
} from "lucide-react";
import { StatCard } from "../../../components/ui/StatCard";
import {
  ChartTooltip,
  CHART_COLORS,
  chartGridProps,
  chartAxisProps,
} from "../../../components/ui/ChartWrapper";

// ── Section wrapper ────────────────────────────────────────────────────────────
function ReportSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b border-surface-border pb-4 mb-2">
        <Icon size={18} className="text-primary opacity-80" />
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      </div>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  );
}

// ── Inline chart legend ────────────────────────────────────────────────────────
function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex items-center gap-4 flex-wrap mt-4 pt-4 border-t border-surface-border">
      {items.map(({ label, color }) => (
        <span
          key={label}
          className="flex items-center gap-2 text-xs text-text-muted font-semibold"
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}

// ── Chart sub-section wrapper ──────────────────────────────────────────────────
function ChartBlock({
  title,
  icon: Icon,
  legend,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  legend?: { label: string; color: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center px-6 py-4 border-b border-surface-border gap-2">
        {Icon && <Icon size={15} className="text-primary opacity-80" />}
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="p-6 flex flex-col justify-between flex-1">
        <div className="flex-1 flex flex-col justify-center">{children}</div>
        {legend && <ChartLegend items={legend} />}
      </div>
    </div>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────────
function ProgressBar({
  value,
  max,
  color = CHART_COLORS.primary,
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full bg-surface-active rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Zero-value display ────────────────────────────────────────────────────────
function ZeroState({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-text-muted text-xs">
      <Minus size={12} />
      {label}
    </span>
  );
}

// ── Donut center label ────────────────────────────────────────────────────────
function DonutLabel({ value, sub }: { value: string | number; sub?: string }) {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan
        x="50%"
        dy="-6"
        style={{
          fontSize: 18,
          fontWeight: 700,
          fill: "rgb(var(--color-text-primary))",
        }}
      >
        {value}
      </tspan>
      {sub && (
        <tspan
          x="50%"
          dy="18"
          style={{
            fontSize: 10,
            fontWeight: 600,
            fill: "rgb(var(--color-text-muted))",
            letterSpacing: "0.05em",
          }}
        >
          {sub}
        </tspan>
      )}
    </text>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["full-reports"],
    queryFn: async () => {
      const [
        grn,
        dispatch,
        trucks,
        sales,
        expenses,
        payroll,
        supplierPayments,
        visitorLog,
        staff,
      ] = await Promise.all([
        grnApi.list(),
        dispatchRecordApi.list(),
        trucksApi.list(),
        salesApi.list(),
        expensesApi.list(),
        payrollApi.list(),
        supplierPaymentsApi.list(),
        visitorLogApi.list(),
        staffAttendanceApi.list(),
      ]);

      const totalSales = sales.reduce((a, s) => a + s.amount, 0);
      const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
      const totalPayroll = payroll.reduce((a, p) => a + p.amount, 0);
      const totalSupplierPaid = supplierPayments.reduce((a, s) => a + s.amountPaid, 0);
      const totalCosts = totalExpenses + totalPayroll + totalSupplierPaid;
      const netProfit = totalSales - totalCosts;

      const intakeVolume = grn.reduce((a, g) => a + g.netWeight, 0);
      const dispatchVolume = dispatch.reduce((a, d) => a + (d.confirmedQty ?? 0), 0);

      const activeTrucks = trucks.filter((t) => t.status === "in-transit").length;
      const idleTrucks = trucks.filter((t) => t.status === "idle").length;
      const maintenanceTrucks = trucks.filter((t) => t.status === "maintenance").length;
      const totalFleet = trucks.length;
      const fleetUtilization = totalFleet > 0 ? Math.round((activeTrucks / totalFleet) * 100) : 0;

      const activeVisitors = visitorLog.filter((v) => !v.timeOut).length;
      const totalStaff = staff.length;
      const staffPresent = staff.filter((s) => !s.timeOut).length;

      return {
        financials: {
          totalSales,
          totalCosts,
          netProfit,
          totalExpenses,
          totalPayroll,
          totalSupplierPaid,
        },
        warehouse: { intakeVolume, dispatchVolume },
        logistics: {
          activeTrucks,
          idleTrucks,
          maintenanceTrucks,
          totalFleet,
          fleetUtilization,
        },
        security: { activeVisitors, totalStaff, staffPresent },
        // Raw records for chart time-series
        grnRaw: grn,
        dispatchRaw: dispatch,
        salesRaw: sales,
        expensesRaw: expenses,
      };
    },
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const { financials, warehouse, logistics, security, grnRaw, dispatchRaw, salesRaw, expensesRaw } = data!;

  const fmt = (n: number) => `₦${n.toLocaleString()}`;
  const margin = Math.round(
    (financials.netProfit / financials.totalSales) * 100,
  );
  const staffPct = Math.round(
    (security.staffPresent / security.totalStaff) * 100,
  );

  // ── Chart data — derived from real records ─────────────────────────────────
  const costBreakdown = [
    {
      name: "Ops Expenses",
      value: financials.totalExpenses,
      fill: CHART_COLORS.danger,
    },
    {
      name: "Payroll",
      value: financials.totalPayroll,
      fill: CHART_COLORS.warning,
    },
    {
      name: "Suppliers",
      value: financials.totalSupplierPaid,
      fill: CHART_COLORS.info,
    },
  ];

  // Warehouse flow — last 7 months of GRN intake and dispatch volume
  const warehouseFlow = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (6 - i));
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = d.toLocaleString('default', { month: 'short' });
    const intake = (grnRaw as any[])
      .filter((g: any) => { const gd = new Date(g.date ?? g.createdAt ?? 0); return gd.getFullYear() === year && gd.getMonth() === month; })
      .reduce((a: number, g: any) => a + (g.netWeight ?? 0), 0);
    const disp = (dispatchRaw as any[])
      .filter((g: any) => { const gd = new Date(g.date ?? g.createdAt ?? 0); return gd.getFullYear() === year && gd.getMonth() === month; })
      .reduce((a: number, g: any) => a + (g.confirmedQty ?? 0), 0);
    return { month: label, intake, dispatch: disp };
  });

  // Revenue vs Cost — last 4 weeks
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);
  const revCostTrend = [0, 1, 2, 3].reverse().map((weeksAgo) => {
    const wkStart = new Date(startOfThisWeek);
    wkStart.setDate(wkStart.getDate() - weeksAgo * 7);
    const wkEnd = new Date(wkStart);
    wkEnd.setDate(wkStart.getDate() + 7);
    const label = weeksAgo === 0 ? 'This Wk' : `Wk -${weeksAgo}`;
    const rev = (salesRaw as any[])
      .filter((s: any) => { const d = new Date(s.date ?? s.createdAt ?? 0); return d >= wkStart && d < wkEnd; })
      .reduce((a: number, s: any) => a + (s.amount ?? 0), 0);
    const costs = (expensesRaw as any[])
      .filter((e: any) => { const d = new Date(e.date ?? e.createdAt ?? 0); return d >= wkStart && d < wkEnd; })
      .reduce((a: number, e: any) => a + (e.amount ?? 0), 0);
    return { wk: label, revenue: rev, costs };
  });

  const fleetBreakdown = [
    {
      name: "In-Transit",
      value: logistics.activeTrucks,
      fill: CHART_COLORS.inTransit,
    },
    { name: "Idle", value: logistics.idleTrucks, fill: CHART_COLORS.idle },
    {
      name: "Maintenance",
      value: logistics.maintenanceTrucks,
      fill: CHART_COLORS.maintenance,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">
            <FileText size={13} />
            Enterprise Analytics
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Comprehensive Report
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Cross-module performance — finance, supply chain, and operations
          </p>
        </div>
        <button className="btn btn-primary shrink-0 self-start sm:self-auto py-2">
          <Download size={15} />
          Export PDF
        </button>
      </div>

      {/* ── AI Executive Summary ──────────────────────────────────────────── */}
      <div
        className="card p-6 flex gap-4 items-start border-l-4"
        style={{ borderLeftColor: `rgb(var(--color-status-info))` }}
      >
        <div
          className="mt-0.5 shrink-0 w-7 h-7 rounded-sm flex items-center justify-center"
          style={{ background: `rgb(var(--color-status-info-bg))` }}
        >
          <TrendingUp
            size={14}
            style={{ color: `rgb(var(--color-status-info))` }}
          />
        </div>
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: `rgb(var(--color-status-info))` }}
          >
            AI Executive Summary
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Revenue is up{" "}
            <span className="font-semibold text-text-primary">15.3%</span>{" "}
            compared to last quarter, driven by higher dispatch volumes in March
            and April. Fleet utilization stands at{" "}
            <span className="font-semibold text-text-primary">
              {logistics.fleetUtilization}%
            </span>{" "}
            (above the 65% industry average). Net profit margin is{" "}
            <span className="font-semibold text-text-primary">{margin}%</span>.
          </p>
        </div>
      </div>

      {/* ── Financial Performance ─────────────────────────────────────────── */}
      <ReportSection title="Financial Performance" icon={DollarSign}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <StatCard
              hero
              title="Gross Revenue"
              value={fmt(financials.totalSales)}
              subtitle="Year to Date"
              icon={<TrendingUp size={18} />}
              trend={{ delta: 15.3, label: "YoY", higherIsBetter: true }}
            />
          </div>
          <StatCard
            title="Total Costs"
            value={fmt(financials.totalCosts)}
            subtitle="YTD"
            trend={{ delta: -2.1, label: "YoY", higherIsBetter: false }}
          />
          <StatCard
            title="Net Profit"
            value={fmt(financials.netProfit)}
            subtitle="YTD"
            trend={{ delta: 8.4, label: "YoY", higherIsBetter: true }}
          />
          <StatCard
            title="Profit Margin"
            value={`${margin}%`}
            subtitle="Net margin"
            trend={{ delta: 1.2, label: "YoY", higherIsBetter: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <ChartBlock
              title="Revenue vs Costs Trend"
              icon={Calendar}
              legend={[
                { label: "Revenue", color: CHART_COLORS.success },
                { label: "Costs", color: CHART_COLORS.danger },
              ]}
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={revCostTrend}
                  margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={CHART_COLORS.success}
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor={CHART_COLORS.success}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="gradCost" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={CHART_COLORS.danger}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor={CHART_COLORS.danger}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...chartGridProps} />
                  <XAxis dataKey="wk" {...chartAxisProps} />
                  <YAxis
                    {...chartAxisProps}
                    tickFormatter={(v) => `${v / 1_000_000}M`}
                    width={45}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip formatValue={(v) => fmt(Number(v))} />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke={CHART_COLORS.success}
                    strokeWidth={2.5}
                    fill="url(#gradRev)"
                    dot={{ r: 3, fill: CHART_COLORS.success, strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="costs"
                    name="Costs"
                    stroke={CHART_COLORS.danger}
                    strokeWidth={2.5}
                    fill="url(#gradCost)"
                    dot={{ r: 3, fill: CHART_COLORS.danger, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartBlock>
          </div>

          <div className="lg:col-span-1">
            <ChartBlock title="Cost Breakdown" icon={PieChartIcon}>
              <div className="flex-1 flex flex-col justify-between h-full">
                <div className="flex-1 flex items-center justify-center relative min-h-[170px]">
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={78}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {costBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <DonutLabel
                        value={fmt(financials.totalCosts)}
                        sub="Total Costs"
                      />
                      <Tooltip
                        content={
                          <ChartTooltip formatValue={(v) => fmt(Number(v))} />
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Segment breakdown list */}
                <div className="flex flex-col gap-2 mt-4 pt-4 px-1 border-t border-surface-border">
                  {costBreakdown.map((item) => {
                    const pct =
                      financials.totalCosts > 0
                        ? Math.round((item.value / financials.totalCosts) * 100)
                        : 0;
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.fill }}
                          />
                          <span className="font-semibold text-text-secondary">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-text-primary">
                            {fmt(item.value)}
                          </span>
                          <span className="text-text-muted font-bold w-9 text-right">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ChartBlock>
          </div>
        </div>
      </ReportSection>

      {/* ── Warehouse Operations ──────────────────────────────────────────── */}
      <ReportSection title="Warehouse Operations" icon={Package}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Intake (YTD)"
            value={`${warehouse.intakeVolume.toLocaleString()} MT`}
            subtitle="Grain received"
            trend={{ delta: 5.2, label: "vs prev", higherIsBetter: true }}
          />
          <StatCard
            title="Total Dispatch (YTD)"
            value={`${warehouse.dispatchVolume.toLocaleString()} MT`}
            subtitle="Grain dispatched"
            trend={{ delta: 8.1, label: "vs prev", higherIsBetter: true }}
          />
          <StatCard
            title="Throughput Ratio"
            value={(warehouse.dispatchVolume / warehouse.intakeVolume).toFixed(
              2,
            )}
            subtitle="Dispatch / Intake"
          />
          <StatCard
            title="Storage Utilization"
            value="82%"
            subtitle="Near capacity"
            trend={{ delta: 3.1, label: "vs last mo", higherIsBetter: false }}
          />
        </div>

        <ChartBlock
          title="Monthly Intake vs Dispatch Volume"
          legend={[
            { label: "Intake Volume", color: CHART_COLORS.primary },
            { label: "Dispatch Volume", color: CHART_COLORS.accent },
          ]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={warehouseFlow}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid {...chartGridProps} />
              <XAxis dataKey="month" {...chartAxisProps} />
              <YAxis
                {...chartAxisProps}
                tickFormatter={(v) => `${v / 1000}k`}
                width={32}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    formatValue={(v) => `${Number(v).toLocaleString()} MT`}
                  />
                }
              />
              <Bar
                dataKey="intake"
                name="Intake Volume"
                fill={CHART_COLORS.primary}
                radius={[3, 3, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="dispatch"
                name="Dispatch Volume"
                fill={CHART_COLORS.accent}
                radius={[3, 3, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartBlock>
      </ReportSection>

      {/* ── Logistics & Fleet + Security side-by-side ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logistics & Fleet */}
        <ReportSection title="Logistics & Fleet" icon={Truck}>
          <div className="grid grid-cols-2 gap-6">
            <StatCard
              title="Fleet Utilization"
              value={`${logistics.fleetUtilization}%`}
              subtitle="Industry avg: 65%"
              trend={{
                delta: logistics.fleetUtilization - 65,
                label: "vs industry",
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
            legend={fleetBreakdown.map((d) => ({
              label: d.name,
              color: d.fill,
            }))}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={fleetBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
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
          <div className="grid grid-cols-2 gap-6">
            <StatCard
              title="Active Visitors"
              value={
                security.activeVisitors === 0 ? "—" : security.activeVisitors
              }
              subtitle={
                security.activeVisitors === 0
                  ? "None on-site"
                  : "Currently on-site"
              }
            />
            <StatCard
              title="Attendance Rate"
              value={security.staffPresent === 0 ? "—" : `${staffPct}%`}
              subtitle={
                security.staffPresent === 0
                  ? "No data yet"
                  : `${security.staffPresent} of ${security.totalStaff}`
              }
              trend={
                security.staffPresent > 0
                  ? {
                      delta: staffPct - 80,
                      label: "vs target",
                      higherIsBetter: true,
                    }
                  : undefined
              }
            />
          </div>

          <ChartBlock title="Personnel & Security Metrics" icon={Shield}>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-text-secondary">
                  Staff Presence
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {security.staffPresent} / {security.totalStaff}
                </span>
              </div>
              <ProgressBar
                value={security.staffPresent}
                max={security.totalStaff}
              />
              {security.staffPresent === 0 && (
                <ZeroState label="No attendance data recorded yet" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-auto">
              <div className="bg-surface-active rounded-sm p-3 border border-surface-border">
                <p className="text-xs text-text-muted mb-1">
                  Gate Incidents (30d)
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-text-primary">0</span>
                  <span className="text-xs text-status-success flex items-center gap-0.5">
                    <TrendingDown size={11} /> 100% down
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  No incidents reported
                </p>
              </div>
              <div className="bg-surface-active rounded-sm p-3 border border-surface-border">
                <p className="text-xs text-text-muted mb-1">
                  Clearances Issued
                </p>
                <span className="text-xl font-bold text-text-primary">
                  1,248
                </span>
              </div>
            </div>
          </ChartBlock>
        </ReportSection>
      </div>
    </div>
  );
}

export const Route = createLazyFileRoute("/_shell/ceo/reports")({
  component: ReportsPage,
});
