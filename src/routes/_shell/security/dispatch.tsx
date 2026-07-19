import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Send } from 'lucide-react'

import { dispatchRecord } from '../../../api/security'
import { DispatchRecord } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { SelectField } from '../../../components/ui/SelectField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'
import { StatCard } from '../../../components/ui/StatCard'

export const Route = createFileRoute('/_shell/security/dispatch')({
  component: DispatchPage,
})

const schema = z.object({
  transporterName: z.string().min(1, 'Required'),
  driverName: z.string().min(1, 'Required'),
  truckNo: z.string().min(1, 'Required'),
  driverPhone: z.string().min(1, 'Required'),
  qtyOfGrains: z.number().min(0, 'Must be >= 0'),
  confirmedQty: z.number().min(0, 'Must be >= 0'),
  grainType: z.enum(['Maize', 'Sorghum', 'SoyaBeans']),
  weight: z.number().min(0, 'Required'),
  continentalWaybillNo: z.string().min(1, 'Required'),
  lbWaybillNo: z.string().min(1, 'Required'),
  destination: z.string().min(1, 'Required'),
  gatePassNo: z.string().min(1, 'Required'),
  driverSignature: z.string().min(1, 'Required'),
  dateTimeIn: z.string().min(1, 'Required'),
  dateTimeOut: z.string().optional(),
})

function DispatchPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [grainFilter, setGrainFilter] = useState('All')
  const [errorMsg, setErrorMsg] = useState('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['dispatchRecord'],
    queryFn: dispatchRecord.list,
  })

  const filteredData = useMemo(() => {
    return data.filter(row => grainFilter === 'All' || row.grainType === grainFilter)
  }, [data, grainFilter])

  const totalDispatched = filteredData.reduce((acc, row) => acc + row.qtyOfGrains, 0)

  const mutation = useMutation({
    mutationFn: dispatchRecord.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatchRecord'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: {
      transporterName: '',
      driverName: '',
      truckNo: '',
      driverPhone: '',
      qtyOfGrains: 0,
      confirmedQty: 0,
      grainType: 'Maize' as 'Maize' | 'Sorghum' | 'SoyaBeans',
      weight: 0,
      continentalWaybillNo: '',
      lbWaybillNo: '',
      destination: '',
      gatePassNo: '',
      driverSignature: '',
      dateTimeIn: '',
      dateTimeOut: '',
    },
    validators: {
      onChange: validateFormWithZod(schema),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value)
    },
  })

  const columns: Column<DispatchRecord>[] = [
    { key: 'transporterName', header: 'Transporter', sortable: true },
    { key: 'driverName', header: 'Driver' },
    { key: 'truckNo', header: 'Truck No' },
    { key: 'qtyOfGrains', header: 'Qty', sortable: true },
    { key: 'grainType', header: 'Grain Type' },
    { key: 'destination', header: 'Destination', sortable: true },
  ]

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Send size={22} className="text-primary opacity-80" />
            Dispatch Record
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage outbound grain dispatches and waybills</p>
        </div>
      </div>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Total Records" value={filteredData.length} subtitle="Based on current filters" />
        <StatCard title="Total Qty Dispatched" value={`${totalDispatched.toLocaleString()} kg`} subtitle="Cumulative total" />
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={filteredData}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search transporter or truck no..."
        searchKeys={['transporterName', 'truckNo', 'driverName']}
        emptyIcon={<Send />}
        emptyMessage={grainFilter !== 'All' 
          ? "We couldn't find any records matching your current filters."
          : "There are currently no outbound dispatches recorded."
        }
        actions={
          <div className="flex items-center gap-3">
            <select
              value={grainFilter}
              onChange={e => setGrainFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-surface-border rounded-sm bg-surface-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors text-text-primary"
            >
              <option value="All">All Grains</option>
              <option value="Maize">Maize</option>
              <option value="Sorghum">Sorghum</option>
              <option value="SoyaBeans">Soya Beans</option>
            </select>
            <Button onClick={() => setIsModalOpen(true)}>
              Log Dispatch
            </Button>
          </div>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Dispatch Record"
        description="Log a new outbound grain dispatch."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                  }}
                  disabled={!canSubmit || isSubmitting}
                  isLoading={isSubmitting}
                >
                  Log Dispatch
                </Button>
              )}
            />
          </>
        }
      >
        {errorMsg && (
          <div className="alert alert-danger mb-4">
            {errorMsg}
          </div>
        )}
        <form
          id="dispatch-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="transporterName" children={(field) => <FormField field={field} label="Transporter Name" />} />
            <form.Field name="truckNo" children={(field) => <FormField field={field} label="Truck No" />} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="driverName" children={(field) => <FormField field={field} label="Driver Name" />} />
            <form.Field name="driverPhone" children={(field) => <FormField field={field} label="Driver Phone" type="tel" />} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
            <form.Field name="qtyOfGrains" children={(field) => <FormField field={field as any} label="Qty of Grains" type="number" />} />
            <form.Field name="confirmedQty" children={(field) => <FormField field={field as any} label="Confirmed Qty" type="number" />} />
            <form.Field name="grainType" children={(field) => (
              <SelectField field={field} label="Grain Type" options={[
                { label: 'Maize', value: 'Maize' },
                { label: 'Sorghum', value: 'Sorghum' },
                { label: 'SoyaBeans', value: 'SoyaBeans' },
              ]} />
            )} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
            <form.Field name="weight" children={(field) => <FormField field={field as any} label="Weight" type="number" />} />
            <form.Field name="continentalWaybillNo" children={(field) => <FormField field={field} label="Cont. Waybill No" />} />
            <form.Field name="lbWaybillNo" children={(field) => <FormField field={field} label="LB Waybill No" />} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="destination" children={(field) => <FormField field={field} label="Destination" />} />
            <form.Field name="gatePassNo" children={(field) => <FormField field={field} label="Gate Pass No" />} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="dateTimeIn" children={(field) => <DateTimeField field={field} label="Date/Time In" />} />
            <form.Field name="dateTimeOut" children={(field) => <DateTimeField field={field} label="Date/Time Out (Optional)" />} />
          </div>
          
          <form.Field name="driverSignature" children={(field) => <FormField field={field} label="Driver Signature (Type Name)" />} />
        </form>
      </Modal>
    </div>
  )
}
