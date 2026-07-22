import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trucks, logisticsOverview } from '../../../api/logistics'
import { Truck } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Badge } from '../../../components/ui/Badge'
import { z } from 'zod'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { Button } from '../../../components/ui/Button'
import { Truck as TruckIcon, MapPin, Navigation, Clock, Activity } from 'lucide-react'
import { CHART_COLORS, ChartTooltip } from '../../../components/ui/ChartWrapper'

export const Route = createLazyFileRoute('/_shell/logistics/fleet')({
  component: FleetPage,
})

const columns: Column<Truck>[] = [
  { key: 'truckNo', header: 'Truck No', sortable: true, render: (row) => <span className="font-bold text-primary">{row.truckNo}</span> },
  { key: 'capacity', header: 'Capacity', render: (row) => `${row.capacity.toLocaleString()} kg` },
  { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
  { key: 'assignedDriver', header: 'Assigned Driver' },
]

const schema = z.object({
  truckNo: z.string().min(1, 'Required'),
  capacity: z.number().positive('Must be > 0'),
  status: z.enum(['idle', 'in-transit', 'maintenance']),
  assignedDriver: z.string().optional(),
})

function FleetPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['trucks'],
    queryFn: trucks.list,
  })

  const { data: snapshot } = useQuery({
    queryKey: ['logisticsSnapshot'],
    queryFn: logisticsOverview.getSnapshot,
  })

  const {
    activeTrucks = 0,
    maintenanceTrucks = 0,
    idleTrucks = 0,
    totalCapacity = 0,
    activeTrips = []
  } = snapshot || {}

  const activeTripsCount = activeTrips.length

  const mutation = useMutation({
    mutationFn: (payload: Omit<Truck, 'id'>) => trucks.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] })
      setIsModalOpen(false)
    },
    onError: () => {
      setErrorMsg('Failed to save record. Please try again.')
    }
  })



  const form = useForm({
    defaultValues: {
      truckNo: '',
      capacity: 0,
      status: 'idle' as 'idle' | 'in-transit' | 'maintenance',
      assignedDriver: '',
    },
    validators: {
      onChange: validateFormWithZod(schema),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      if (data?.some(t => t.truckNo === value.truckNo)) {
        setErrorMsg('Truck No must be unique')
        return
      }
      await mutation.mutateAsync(value)
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center panel p-4">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary flex items-center gap-2">
            <TruckIcon size={24} /> Fleet & Logistics Command Center
          </h2>
          <p className="text-sm text-text-secondary mt-1">Live tracking of fleet status, capacity utilization, and active routes.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<TruckIcon size={16} />}>
          Register Truck
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel p-4 hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Active Fleet</div>
          <div className="text-3xl font-bold text-primary">{activeTrucks}</div>
          <div className="text-xs text-text-secondary mt-1">Out of {data?.length || 0} Total</div>
        </div>
        <div className="panel p-4 hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Total Capacity</div>
          <div className="text-3xl font-bold text-primary">{totalCapacity.toLocaleString()} kg</div>
          <div className="text-xs text-text-secondary mt-1">Combined fleet volume</div>
        </div>
        <div className="panel p-4 hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">In Maintenance</div>
          <div className="text-3xl font-bold text-status-danger-dark">{maintenanceTrucks}</div>
          <div className="text-xs text-status-danger-dark mt-1">Currently unavailable</div>
        </div>
        <div className="panel p-4 hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Active Trips</div>
          <div className="text-3xl font-bold text-status-intransit-dark">{activeTripsCount}</div>
          <div className="text-xs text-status-intransit-dark mt-1">Trips currently running</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Charts & Status */}
        <div className="space-y-6">
          <div className="panel p-4 flex flex-col h-64 hover:border-primary/30 transition-all">
            <div className="text-sm uppercase tracking-wider font-bold text-text-secondary mb-4 font-header border-b border-surface-border pb-2 flex items-center gap-2">
               <Activity size={16} /> Fleet Status
            </div>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Idle', value: idleTrucks, fill: CHART_COLORS.success },
                      { name: 'In Transit', value: activeTrucks, fill: CHART_COLORS.info },
                      { name: 'Maintenance', value: maintenanceTrucks, fill: CHART_COLORS.warning }
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Idle', value: idleTrucks, fill: CHART_COLORS.success },
                      { name: 'In Transit', value: activeTrucks, fill: CHART_COLORS.info },
                      { name: 'Maintenance', value: maintenanceTrucks, fill: CHART_COLORS.warning }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip formatValue={(v: any) => `${v} Trucks`} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-surface panel-table flex flex-col h-80 hover:border-primary/30 transition-all">
            <div className="p-4 border-b border-surface-border flex items-center gap-2 text-primary bg-surface-muted/30">
               <Navigation size={18} />
               <h3 className="font-header font-bold uppercase tracking-wide text-sm">Active Trips Tracking</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
               {activeTrips.length > 0 ? activeTrips.map((trip: any) => (
                 <div key={trip.id} className="p-4 border-b border-surface-border hover:bg-surface-active transition-colors">
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-primary">{trip.truckNo}</span>
                     <Badge status="in-transit" />
                   </div>
                   <div className="text-xs text-text-secondary mb-3">Driver: <span className="font-medium text-text-primary">{trip.driverName}</span></div>
                   <div className="flex justify-between items-center relative">
                     <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-surface-border -z-10"></div>
                     <div className="flex flex-col items-center bg-surface px-1">
                       <MapPin size={14} className="text-status-success-dark mb-1" />
                       <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{trip.origin}</span>
                     </div>
                     <div className="flex flex-col items-center bg-surface px-1">
                       <Navigation size={14} className="text-status-danger-dark mb-1" />
                       <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{trip.destination}</span>
                     </div>
                   </div>
                 </div>
               )) : (
                 <div className="p-6 text-center text-text-muted text-sm flex flex-col items-center gap-2">
                    <Clock size={24} className="text-surface-border" />
                    No active trips currently in transit.
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right Col: Fleet Registry Table */}
        <div className="xl:col-span-2 flex flex-col h-full flex-1 min-h-0">
          <DataTable
            columns={columns}
            data={data || []}
            rowKey="id"
            isLoading={isLoading}
            emptyMessage="No trucks registered in the fleet."
            emptyIcon={<TruckIcon size={48} />}
            className="h-full border-2 border-surface-border hover:border-primary/30 transition-all rounded-none shadow-none"
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Truck">
        {errorMsg && <div className="mb-4 text-sm bg-status-danger/10 border border-status-error/20 text-status-danger font-medium p-2 rounded">{errorMsg}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="truckNo" children={(field) => <FormField field={field as any} label="Truck No" />} />
          <form.Field name="capacity" children={(field) => <FormField field={field as any} label="Capacity (kg)" type="number" />} />
          <form.Field name="status" children={(field) => (
            <SelectField field={field as any} label="Initial Status" options={[
              { label: 'Idle', value: 'idle' },
              { label: 'In Transit', value: 'in-transit' },
              { label: 'Maintenance', value: 'maintenance' },
            ]} />
          )} />
          <form.Field name="assignedDriver" children={(field) => <FormField field={field as any} label="Assigned Driver (Optional)" />} />

          <div className="flex justify-end pt-4 border-t border-surface-border gap-2">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Register'}
              </Button>
            )} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

