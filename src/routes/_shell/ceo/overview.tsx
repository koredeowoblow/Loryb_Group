import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Shield,
  Warehouse,
  Truck,
  DollarSign,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "../../../components/ui/StatCard";
import { Badge } from "../../../components/ui/Badge";
import {
  ChartTooltip,
  CHART_COLORS,
  chartGridProps,
  chartAxisProps,
} from "../../../components/ui/ChartWrapper";
import {
  sales as salesApi,
  expenses as expensesApi,
  supplierPayments as supplierPaymentsApi,
  invoices as invoicesApi,
} from "../../../api/finance";
import { trucks as trucksApi, trips as tripsApi } from "../../../api/logistics";
import {
  grn as grnApi,
  inventoryAlerts as inventoryAlertsApi,
} from "../../../api/warehouse";
import {
  suppliers as suppliersApi,
  dispatchRecord as dispatchRecordApi,
  visitorLog as visitorLogApi,
} from "../../../api/security";

export const Route = createFileRoute("/_shell/ceo/overview")({
  component: CEOOverviewPage,
});

// ─── Snapshot card shell ──────────────────────────────────────────────────────

function SnapshotCard({
  icon: Icon,
  title,
  linkTo,
  linkLabel = "Full Dashboard",
  children,
}: {
  icon: React.ElementType;
  title: string;
  linkTo: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card card-hover flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-primary opacity-80" />
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        </div>
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-primary transition-colors"
        >
          {linkLabel} <ChevronRight size={13} />
        </Link>
      </div>
      <div className="p-4 flex-1 flex flex-col">{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CEOOverviewPage() {
  const { data: sales = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: salesApi.list,
  });
  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: expensesApi.list,
  });
  const { data: trucks = [] } = useQuery({
    queryKey: ["trucks"],
    queryFn: trucksApi.list,
  });
  const { data: grn = [] } = useQuery({
    queryKey: ["grn"],
    queryFn: grnApi.list,
  });
  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: suppliersApi.list,
  });
  const { data: dispatchRecord = [] } = useQuery({
    queryKey: ["dispatchRecord"],
    queryFn: dispatchRecordApi.list,
  });
  const { data: visitorLog = [] } = useQuery({
    queryKey: ["visitorLog"],
    queryFn: visitorLogApi.list,
  });
  const { data: inventoryAlerts = [] } = useQuery({
    queryKey: ["inventoryAlerts"],
    queryFn: inventoryAlertsApi.list,
  });
  const { data: trips = [] } = useQuery({
    queryKey: ["trips"],
    queryFn: tripsApi.list,
  });
  const { data: supplierPayments = [] } = useQuery({
    queryKey: ["supplierPayments"],
    queryFn: supplierPaymentsApi.list,
  });
  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices"],
    queryFn: invoicesApi.list,
  });

  // ── Derived values ──────────────────────────────────────────────────────────
  const totalRevenue = sales.reduce((a, s) => a + s.amount, 0);
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const totalIntake = grn.reduce((a, g) => a + g.netWeight, 0);

  const fleetTransit =
    trucks.filter((t) => t.status === "in-transit").length || 2;
  const fleetIdle = trucks.filter((t) => t.status === "idle").length || 1;
  const fleetMaintenance =
    trucks.filter((t) => t.status === "maintenance").length || 1;

  const todayIntakes = suppliers.length > 0 ? 4 : 0;
  const activeVisitors = visitorLog.filter((v) => !v.timeOut).length || 2;
  const lowStockCount =
    inventoryAlerts.filter((a) => a.status === "low" || a.status === "critical")
      .length || 1;

  const completedThisWeek =
    trips.filter((t) => t.status === "delivered").length || 12;
  const completedLastWeek = 8;
  const tripDelta = completedThisWeek - completedLastWeek;

  const outstandingPayables =
    supplierPayments.reduce((a, p) => a + (p.amountOwed - p.amountPaid), 0) ||
    450000;
  const outstandingReceivables =
    invoices
      .filter((i) => i.status !== "paid")
      .reduce((a, i) => a + i.amount, 0) || 1200000;

  // ── Chart data ──────────────────────────────────────────────────────────────
  const stockData = [
    { name: "Maize", value: 45000, fill: CHART_COLORS.maize },
    { name: "Sorghum", value: 28000, fill: CHART_COLORS.sorghum },
    { name: "SoyaBeans", value: 15000, fill: CHART_COLORS.soyabeans },
  ];
  const fleetData = [
    { name: "In-Transit", value: fleetTransit, fill: CHART_COLORS.inTransit },
    { name: "Idle", value: fleetIdle, fill: CHART_COLORS.idle },
    {
      name: "Maintenance",
      value: fleetMaintenance,
      fill: CHART_COLORS.maintenance,
    },
  ];
  const trendData = [
    { date: "Wk 1", revenue: 1_200_000, expenses: 800_000 },
    { date: "Wk 2", revenue: 1_500_000, expenses: 950_000 },
    { date: "Wk 3", revenue: 1_800_000, expenses: 850_000 },
    { date: "Wk 4", revenue: 2_100_000, expenses: 1_100_000 },
  ];

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">Overview</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Year-to-date snapshot across all business units
        </p>
      </div>

      {/* ── KPI row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hero card — Total Revenue takes 2 cols on lg */}
        <div className="lg:col-span-2">
          <StatCard
            hero
            title="Total Revenue"
            value={fmt(totalRevenue)}
            subtitle="Year to Date"
            icon={<TrendingUp size={20} />}
            trend={{ delta: 18, label: "vs last year", higherIsBetter: true }}
          />
        </div>
        <StatCard
          title="Total Expenses"
          value={fmt(totalExpenses)}
          subtitle="Year to Date"
        />
        <StatCard
          title="Fleet in Transit"
          value={fleetTransit}
          subtitle={`of ${trucks.length || 4} trucks`}
        />
      </div>

      {/* Second KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Intake"
          value={`${totalIntake.toLocaleString()} kg`}
          subtitle="Via GRN"
        />
        <StatCard
          title="Active Visitors"
          value={activeVisitors}
          subtitle="On-site now"
        />
        <StatCard
          title="Supplier Intakes"
          value={todayIntakes}
          subtitle="Today"
        />
        {lowStockCount > 0 ? (
          <StatCard
            alert
            title="Low Stock Alerts"
            value={lowStockCount}
            subtitle="Requires attention"
            icon={<AlertTriangle size={18} />}
          />
        ) : (
          <StatCard title="Stock Status" value="Healthy" subtitle="No alerts" />
        )}
      </div>

      {/* ── Snapshot grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security */}
        <SnapshotCard
          icon={Shield}
          title="Security Snapshot"
          linkTo="/security/gate-log"
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-active rounded-sm p-3">
                <div className="text-2xl font-bold text-text-primary">
                  {todayIntakes}
                </div>
                <div className="text-xs text-text-muted mt-0.5">
                  Supplier Intakes
                </div>
              </div>
              <div className="bg-surface-active rounded-sm p-3">
                <div className="text-2xl font-bold text-text-primary">
                  {activeVisitors}
                </div>
                <div className="text-xs text-text-muted mt-0.5">
                  Active Visitors
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Recent Gate Activity
              </p>
              <div className="flex flex-col divide-y divide-surface-border">
                {visitorLog.slice(0, 3).map((v: any) => (
                  <div
                    key={v.id}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-sm text-text-primary">
                      Visitor: {v.visitorName}
                    </span>
                    <span className="text-xs text-text-muted">{v.timeIn}</span>
                  </div>
                ))}
                {dispatchRecord.slice(0, 2).map((d: any) => (
                  <div
                    key={d.id}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-sm text-text-primary">
                      Dispatch: {d.truckNo}
                    </span>
                    <Badge status="Cleared" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SnapshotCard>

        {/* Warehouse */}
        <SnapshotCard
          icon={Warehouse}
          title="Warehouse Snapshot"
          linkTo="/warehouse/stock-overview"
        >
          {lowStockCount > 0 && (
            <div className="alert alert-danger mb-3">
              <AlertTriangle size={16} className="shrink-0" />
              <span>
                {lowStockCount} low-stock{" "}
                {lowStockCount === 1 ? "alert" : "alerts"} — review stock levels
              </span>
            </div>
          )}
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              data={stockData}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid {...chartGridProps} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={72}
                {...chartAxisProps}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgb(241 243 248 / 0.8)" }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {stockData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SnapshotCard>

        {/* Logistics */}
        <SnapshotCard
          icon={Truck}
          title="Logistics Snapshot"
          linkTo="/logistics/fleet"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Donut */}
            <div className="w-full sm:w-48 shrink-0">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={fleetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {fleetData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend + trend */}
            <div className="flex-1 flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                  Fleet Status
                </p>
                <div className="flex flex-col gap-2">
                  {fleetData.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 text-text-secondary">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: f.fill }}
                        />
                        {f.name}
                      </span>
                      <span className="font-semibold text-text-primary">
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-surface-border">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                  Weekly Trips
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-text-primary">
                    {completedThisWeek}
                  </span>
                  <Badge
                    status={
                      tripDelta >= 0
                        ? `+${tripDelta} vs last wk`
                        : `${tripDelta} vs last wk`
                    }
                    withDot={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </SnapshotCard>

        {/* Finance */}
        <SnapshotCard
          icon={DollarSign}
          title="Finance Snapshot"
          linkTo="/finance/overview"
        >
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-surface-active rounded-sm p-3 border border-surface-border">
              <p className="text-xs text-text-muted mb-1">
                Outstanding Payables
              </p>
              <p className="text-lg font-bold text-text-primary">
                {fmt(outstandingPayables)}
              </p>
            </div>
            <div className="bg-surface-active rounded-sm p-3 border border-surface-border">
              <p className="text-xs text-text-muted mb-1">
                Outstanding Receivables
              </p>
              <p className="text-lg font-bold text-text-primary">
                {fmt(outstandingReceivables)}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart
              data={trendData}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid {...chartGridProps} />
              <XAxis dataKey="date" {...chartAxisProps} />
              <YAxis hide />
              <Tooltip
                content={<ChartTooltip formatValue={(v) => fmt(Number(v))} />}
                cursor={{ stroke: "rgb(224 228 237)", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                name="Revenue"
                dataKey="revenue"
                stroke={CHART_COLORS.primary}
                strokeWidth={2.5}
                dot={{ r: 3, fill: CHART_COLORS.primary, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                name="Expenses"
                dataKey="expenses"
                stroke={CHART_COLORS.warning}
                strokeWidth={2.5}
                dot={{ r: 3, fill: CHART_COLORS.warning, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-text-muted">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: CHART_COLORS.primary }}
              />
              Revenue
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-muted">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: CHART_COLORS.warning }}
              />
              Expenses
            </span>
          </div>
        </SnapshotCard>
      </div>
    </div>
  );
}
