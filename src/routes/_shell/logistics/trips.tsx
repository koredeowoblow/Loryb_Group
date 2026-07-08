import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, Trip } from '../../../api'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { DateTimeField } from '../../../components/ui/DateTimeField'

export const Route = createFileRoute('/_shell/logistics/trips')({
  component: TripsPage,
})

const schema = z.object({
  truckNo: z.string().min(1, 'Required'),
  driverName: z.string().min(1, 'Required'),
  origin: z.string().min(1, 'Required'),
  destination: z.string().min(1, 'Required'),
  status: z.enum(['pending', 'in-transit', 'delivered']),
  etaOrCompletedAt: z.string().min(1, 'Required'),
  continentalWaybillNo: z.string().min(1, 'Required'),
  lbWaybillNo: z.string().min(1, 'Required'),
  gatePassNo: z.string().min(1, 'Required'),
})

function TripCard({ trip }: { trip: Trip }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm border border-surface-border flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="font-bold text-sm text-primary">{trip.truckNo}</div>
        <div className="text-[0.65rem] uppercase tracking-wider bg-surface-muted px-1.5 py-0.5 rounded text-text-secondary font-bold">
          {trip.gatePassNo}
        </div>
      </div>
      <div className="text-xs text-text-secondary">
        <span className="font-semibold">{trip.origin}</span> → <span className="font-semibold">{trip.destination}</span>
      </div>
      <div className="flex justify-between items-end mt-2">
        <div className="text-xs text-text-muted">{trip.driverName}</div>
        <div className="text-[0.65rem] text-text-muted">{new Date(trip.etaOrCompletedAt).toLocaleDateString()}</div>
      </div>
    </div>
  )
}

function TripsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useQuery({ queryKey: ['trips'], queryFn: api.trips.list })
  const { data: trucks } = useQuery({ queryKey: ['trucks'], queryFn: api.trucks.list })
  const { data: drivers } = useQuery({ queryKey: ['drivers'], queryFn: api.drivers.list })

  const truckOptions = useMemo(() => (trucks || []).map(t => ({ label: t.truckNo, value: t.truckNo })), [trucks])
  const driverOptions = useMemo(() => (drivers || []).map(d => ({ label: d.driverName, value: d.driverName })), [drivers])

  const mutation = useMutation({
    mutationFn: (payload: Omit<Trip, 'id'>) => api.trips.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: { truckNo: '', driverName: '', origin: '', destination: '', status: 'pending', etaOrCompletedAt: '', continentalWaybillNo: '', lbWaybillNo: '', gatePassNo: '' },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value as any)
    },
  })

  const filteredData = data?.filter(t => 
    t.truckNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.destination.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const pending = filteredData.filter(t => t.status === 'pending')
  const inTransit = filteredData.filter(t => t.status === 'in-transit')
  const delivered = filteredData.filter(t => t.status === 'delivered')

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Trip Scheduling Board</h2>
          <p className="text-sm text-text-secondary mt-1">Manage and track fleet dispatches across the delivery lifecycle.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Schedule Trip
        </button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted font-header">Total Active Trips</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search truck, driver or destination..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-md shadow-sm border border-surface-border overflow-hidden p-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-surface-border border-t-primary rounded-full animate-spin"></div>
          <div className="text-sm font-medium text-text-muted">Loading trip board...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {/* Pending Column */}
          <div className="bg-surface-active rounded-md p-3 flex flex-col border border-surface-border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-header font-bold text-sm uppercase tracking-wider text-text-secondary">Pending</h3>
              <span className="bg-white text-xs font-bold px-2 py-0.5 rounded shadow-sm border border-surface-border">{pending.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
              {pending.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-text-muted p-4 text-center border-2 border-dashed border-surface-border rounded">
                   <span className="text-2xl mb-1">📋</span>
                   <p className="text-xs">No pending trips</p>
                 </div>
              ) : (
                pending.map(trip => <TripCard key={trip.id} trip={trip} />)
              )}
            </div>
          </div>

          {/* In Transit Column */}
          <div className="bg-surface-active rounded-md p-3 flex flex-col border border-surface-border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-header font-bold text-sm uppercase tracking-wider text-status-warning">In Transit</h3>
              <span className="bg-white text-xs font-bold px-2 py-0.5 rounded shadow-sm border border-status-warning/30 text-status-warning">{inTransit.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
              {inTransit.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-text-muted p-4 text-center border-2 border-dashed border-surface-border rounded">
                   <span className="text-2xl mb-1">🚚</span>
                   <p className="text-xs">No active transit</p>
                 </div>
              ) : (
                inTransit.map(trip => <TripCard key={trip.id} trip={trip} />)
              )}
            </div>
          </div>

          {/* Delivered Column */}
          <div className="bg-surface-active rounded-md p-3 flex flex-col border border-surface-border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-header font-bold text-sm uppercase tracking-wider text-status-success">Delivered</h3>
              <span className="bg-white text-xs font-bold px-2 py-0.5 rounded shadow-sm border border-status-success/30 text-status-success">{delivered.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
              {delivered.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-text-muted p-4 text-center border-2 border-dashed border-surface-border rounded">
                   <span className="text-2xl mb-1">🏁</span>
                   <p className="text-xs">No completed trips</p>
                 </div>
              ) : (
                delivered.map(trip => <TripCard key={trip.id} trip={trip} />)
              )}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Trip">
        {errorMsg && <div className="mb-4 text-sm bg-status-error/10 border border-status-error/20 text-status-error font-medium p-2 rounded">{errorMsg}</div>}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="truckNo" children={(field) => <SelectField field={field as any} label="Truck No" options={truckOptions} />} />
          <form.Field name="driverName" children={(field) => <SelectField field={field as any} label="Driver Name" options={driverOptions} />} />
          <form.Field name="origin" children={(field) => <FormField field={field as any} label="Origin" />} />
          <form.Field name="destination" children={(field) => <FormField field={field as any} label="Destination" />} />
          <form.Field name="status" children={(field) => (
            <SelectField field={field as any} label="Status" options={[{ label: 'Pending', value: 'pending' }, { label: 'In Transit', value: 'in-transit' }, { label: 'Delivered', value: 'delivered' }]} />
          )} />
          <form.Field name="etaOrCompletedAt" children={(field) => <DateTimeField field={field as any} label="ETA / Completed At" />} />
          <form.Field name="continentalWaybillNo" children={(field) => <FormField field={field as any} label="Continental Waybill No" />} />
          <form.Field name="lbWaybillNo" children={(field) => <FormField field={field as any} label="LB Waybill No" />} />
          <form.Field name="gatePassNo" children={(field) => <FormField field={field as any} label="Gate Pass No" />} />

          <div className="flex justify-end pt-4 border-t border-surface-border gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors">Cancel</button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit || isSubmitting} className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-white bg-primary hover:bg-primary-hover rounded shadow-sm border border-primary-light disabled:opacity-50 transition-colors">
                {isSubmitting ? 'Saving...' : 'Save Record'}
              </button>
            )} />
          </div>
        </form>
      </Modal>
    </div>
  )
}
