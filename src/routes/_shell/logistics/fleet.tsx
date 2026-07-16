import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trucks, trips as tripsApi } from '../../../api/logistics'
import { Truck } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { z } from 'zod'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { Badge } from '../../../components/ui/Badge'
import { Truck as TruckIcon, MapPin, Navigation, Clock, Activity } from 'lucide-react'

export const Route = createFileRoute('/_shell/logistics/fleet')({
  component: FleetPage,
})

const columnHelper = createColumnHelper<Truck>()

const columns = [
  columnHelper.accessor('truckNo', { header: 'Truck No', cell: info => <span className="font-bold text-primary">{info.getValue()}</span> }),
  columnHelper.accessor('capacity', { header: 'Capacity', cell: info => `${info.getValue().toLocaleString()} kg` }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <Badge status={info.getValue() as string} />
  }),
  columnHelper.accessor('assignedDriver', { header: 'Assigned Driver' }),
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

  const { data: trips } = useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.list,
  })

  const activeTrucks = data?.filter(t => t.status === 'in-transit').length || 0
  const maintenanceTrucks = data?.filter(t => t.status === 'maintenance').length || 0
  const totalCapacity = data?.reduce((acc, t) => acc + t.capacity, 0) || 0
  const activeTripsList = trips?.filter(t => t.status === 'in-transit') || []
  const activeTripsCount = activeTripsList.length

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

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
      <div className="flex justify-between items-center bg-surface p-4 rounded-none shadow-none border-2 border-surface-border">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary flex items-center gap-2">
            <TruckIcon size={24} /> Fleet & Logistics Command Center
          </h2>
          <p className="text-sm text-text-secondary mt-1">Live tracking of fleet status, capacity utilization, and active routes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light flex items-center gap-2"
        >
          <TruckIcon size={16} /> Register Truck
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-none shadow-none border-2 border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Active Fleet</div>
          <div className="text-3xl font-bold text-primary">{activeTrucks}</div>
          <div className="text-xs text-text-secondary mt-1">Out of {data?.length || 0} Total</div>
        </div>
        <div className="bg-surface p-4 rounded-none shadow-none border-2 border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Total Capacity</div>
          <div className="text-3xl font-bold text-primary">{totalCapacity.toLocaleString()} kg</div>
          <div className="text-xs text-text-secondary mt-1">Combined fleet volume</div>
        </div>
        <div className="bg-surface p-4 rounded-none shadow-none border-2 border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">In Maintenance</div>
          <div className="text-3xl font-bold text-status-error-dark">{maintenanceTrucks}</div>
          <div className="text-xs text-status-error-dark mt-1">Currently unavailable</div>
        </div>
        <div className="bg-surface p-4 rounded-none shadow-none border-2 border-surface-border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="text-xs font-bold font-header uppercase tracking-wider text-text-muted mb-1">Active Trips</div>
          <div className="text-3xl font-bold text-status-intransit-dark">{activeTripsCount}</div>
          <div className="text-xs text-status-intransit-dark mt-1">Trips currently running</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Charts & Status */}
        <div className="space-y-6">
          <div className="bg-surface p-4 rounded-none shadow-none border-2 border-surface-border flex flex-col h-64 hover:border-primary/30 transition-all">
            <div className="text-sm uppercase tracking-wider font-bold text-text-secondary mb-4 font-header border-b border-surface-border pb-2 flex items-center gap-2">
               <Activity size={16} /> Fleet Status
            </div>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Idle', value: data?.filter(t => t.status === 'idle').length || 0, fill: '#10B981' },
                      { name: 'In Transit', value: activeTrucks, fill: '#3B82F6' },
                      { name: 'Maintenance', value: maintenanceTrucks, fill: '#F59E0B' }
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Idle', value: data?.filter(t => t.status === 'idle').length || 0, fill: '#10B981' },
                      { name: 'In Transit', value: activeTrucks, fill: '#3B82F6' },
                      { name: 'Maintenance', value: maintenanceTrucks, fill: '#F59E0B' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-surface border border-surface-border shadow-lg rounded p-2 px-3">
                            <div className="text-xs font-bold text-text-secondary uppercase mb-1">{payload[0].name}</div>
                            <div className="text-sm font-bold" style={{ color: payload[0].payload.fill }}>{payload[0].value} Trucks</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-surface rounded-none shadow-none border-2 border-surface-border flex flex-col h-80 hover:border-primary/30 transition-all">
            <div className="p-4 border-b border-surface-border flex items-center gap-2 text-primary bg-surface-muted/30">
               <Navigation size={18} />
               <h3 className="font-header font-bold uppercase tracking-wide text-sm">Active Trips Tracking</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
               {activeTripsList.length > 0 ? activeTripsList.map(trip => (
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
                       <span className="text-[0.65rem] font-bold uppercase tracking-wider text-text-muted">{trip.origin}</span>
                     </div>
                     <div className="flex flex-col items-center bg-surface px-1">
                       <Navigation size={14} className="text-status-error-dark mb-1" />
                       <span className="text-[0.65rem] font-bold uppercase tracking-wider text-text-muted">{trip.destination}</span>
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
        <div className="xl:col-span-2 bg-surface rounded-none shadow-none border-2 border-surface-border overflow-hidden flex flex-col h-full min-h-[500px] hover:border-primary/30 transition-all">
          <div className="p-4 text-sm uppercase tracking-wider font-bold text-text-secondary font-header border-b border-surface-border shrink-0 bg-surface-muted/30">Fleet Registry Database</div>
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="p-8 text-center text-text-muted">Loading...</div>
            ) : (
              <table className="min-w-full divide-y divide-surface-border border-b border-surface-border">
                <thead className="bg-surface-muted">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-4 py-3 text-left text-[0.7rem] font-bold text-text-secondary uppercase tracking-wider bg-surface-muted border-b border-surface-border font-header">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-surface divide-y divide-surface-border text-sm">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-surface-active/60 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-text-primary border-b border-surface-border/50">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-text-muted">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Truck">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
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
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors"
            >
              Cancel
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-white bg-primary hover:bg-primary-hover rounded shadow-sm border border-primary-light disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Register'}
                </button>
              )}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

