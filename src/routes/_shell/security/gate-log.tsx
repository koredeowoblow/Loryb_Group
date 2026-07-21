import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { visitorLog as visitorLogApi, dispatchRecord as dispatchRecordApi, staffAttendance as staffAttendanceApi, motorcycleLog as motorcycleLogApi, suppliers as suppliersApi } from '../../../api/security'
import { Shield, Clock, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '../../../components/ui/Badge'
import { StatCard } from '../../../components/ui/StatCard'
import { ChartTooltip, CHART_COLORS, chartGridProps, chartAxisProps } from '../../../components/ui/ChartWrapper'
import { Button } from '../../../components/ui/Button'

export const Route = createFileRoute('/_shell/security/gate-log')({ component: GateLogDashboard })

function GateLogDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['security-dashboard-detailed'],
    queryFn: async () => {
      const [visitors, dispatch, staff, motorcycles, suppliers] = await Promise.all([
        visitorLogApi.list(),
        dispatchRecordApi.list(),
        staffAttendanceApi.list(),
        motorcycleLogApi.list(),
        suppliersApi.list(),
      ])
      return {
        visitors,
        dispatch,
        activeVisitors:  visitors.filter(v => !v.timeOut).length,
        todayDispatch:   dispatch.length,
        staffPresent:    staff.filter(s => !s.timeOut).length,
        activeBikes:     motorcycles.filter(m => !m.timeOut).length,
        todaySuppliers:  suppliers.length,
      }
    },
  })

  // Build 7-day traffic volume from real visitor / dispatch records
  const _dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const _today = new Date()
  const volumeData = Array.from({ length: 7 }, (_, i) => {
    const target = new Date(_today)
    target.setDate(_today.getDate() - (6 - i))
    const targetStr = target.toISOString().slice(0, 10)
    const dayLabel = _dayNames[target.getDay()]
    const intakeCount = (data?.visitors ?? []).filter(
      (v: any) => String(v.date ?? v.timeIn ?? v.createdAt ?? '').slice(0, 10) === targetStr
    ).length
    const dispatchCount = (data?.dispatch ?? []).filter(
      (d: any) => String(d.date ?? d.createdAt ?? '').slice(0, 10) === targetStr
    ).length
    return { day: dayLabel, intake: intakeCount, dispatch: dispatchCount }
  })

  return (
    <div className="space-y-6">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Shield size={22} className="text-primary opacity-80" />
            Security Gate
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Real-time overview of gate operations and facility access</p>
        </div>
        <Button variant="danger" icon={<AlertTriangle size={15} />}>
          Emergency Lockdown
        </Button>
      </div>

      {/* ── KPI row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Suppliers Today"  value={data?.todaySuppliers ?? '—'} subtitle="Processed"        />
        <StatCard title="Dispatches"       value={data?.todayDispatch  ?? '—'} subtitle="Cleared for exit"  />
        <StatCard title="Active Visitors"  value={data?.activeVisitors ?? '—'} subtitle="On premises"       />
        <StatCard title="Staff Present"    value={data?.staffPresent   ?? '—'} subtitle="Clocked in"        />
        <StatCard title="Active Bikes"     value={data?.activeBikes    ?? '—'} subtitle="Dispatched out"     />
      </div>

      {/* ── Charts + feed ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Volume Chart */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="px-4 py-3 border-b border-surface-border">
            <h3 className="text-sm font-semibold text-text-primary">Traffic Volume — Last 7 Days</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={volumeData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid {...chartGridProps} />
                <XAxis dataKey="day" {...chartAxisProps} />
                <YAxis {...chartAxisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgb(241 243 248 / 0.6)' }} />
                <Bar dataKey="intake"   name="Intake"   fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={36} />
                <Bar dataKey="dispatch" name="Dispatch" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS.primary }} />Intake
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS.success }} />Dispatch
              </span>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="card flex flex-col">
          <div className="px-4 py-3 border-b border-surface-border flex items-center gap-2">
            <Clock size={15} className="text-text-muted" />
            <h3 className="text-sm font-semibold text-text-primary">Live Activity Feed</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-surface-border flex-1 min-h-0">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-4 py-3 animate-pulse flex justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3 w-32 bg-surface-active rounded-sm" />
                      <div className="h-2.5 w-20 bg-surface-active rounded-sm" />
                    </div>
                    <div className="h-5 w-14 bg-surface-active rounded-sm" />
                  </div>
                ))
              : <>
                  {data?.visitors.slice(0, 4).map((v: any, i) => (
                    <div key={`v-${i}`} className="px-4 py-3 hover:bg-surface-active transition-colors flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{v.visitorName ?? v.name}</div>
                        <div className="text-xs text-text-muted">{v.purpose}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-text-muted mb-1">{v.timeIn}</div>
                        <Badge status={v.timeOut ? 'inactive' : 'active'} />
                      </div>
                    </div>
                  ))}
                  {data?.dispatch.slice(0, 3).map((d: any, i) => (
                    <div key={`d-${i}`} className="px-4 py-3 hover:bg-surface-active transition-colors flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-text-primary">Dispatch: {d.truckNo}</div>
                        <div className="text-xs text-text-muted">Driver: {d.driverName}</div>
                      </div>
                      <Badge status="Cleared" />
                    </div>
                  ))}
                </>
            }
          </div>
        </div>

      </div>
    </div>
  )
}
