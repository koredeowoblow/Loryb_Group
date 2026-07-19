import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Truck } from 'lucide-react'

import { suppliers } from '../../../api/security'
import { SupplierRecord } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { SelectField } from '../../../components/ui/SelectField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'
import { StatCard } from '../../../components/ui/StatCard'

export const Route = createFileRoute('/_shell/security/suppliers')({
  component: SuppliersPage,
})

const schema = z.object({
  supplierName: z.string().min(1, 'Required'),
  driverName: z.string().min(1, 'Required'),
  refPhoneNo: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format'),
  truckNo: z.string().min(1, 'Required'),
  qtyOfGrains: z.number().positive('Must be > 0'),
  confirmedQty: z.number().min(0, 'Must be >= 0'),
  grainType: z.enum(['Maize', 'Sorghum', 'SoyaBeans']),
  storeLocation: z.string().min(1, 'Required'),
  weightNo: z.string().min(1, 'Required'),
  rejectNo: z.number().default(0),
  dateTimeIn: z.string().min(1, 'Required'),
  dateTimeOut: z.string().optional(),
})

function SuppliersPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [grainFilter, setGrainFilter] = useState('All')

  const { data = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: suppliers.list,
  })

  const filteredData = useMemo(() => {
    return data.filter(row => grainFilter === 'All' || row.grainType === grainFilter)
  }, [data, grainFilter])

  const totalQty = filteredData.reduce((acc, row) => acc + row.qtyOfGrains, 0)

  const mutation = useMutation({
    mutationFn: suppliers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: {
      supplierName: '',
      driverName: '',
      refPhoneNo: '',
      truckNo: '',
      qtyOfGrains: 0,
      confirmedQty: 0,
      grainType: 'Maize' as 'Maize' | 'Sorghum' | 'SoyaBeans',
      storeLocation: '',
      weightNo: '',
      rejectNo: 0,
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

  const columns: Column<SupplierRecord>[] = [
    { key: 'supplierName', header: 'Supplier Name', sortable: true },
    { key: 'driverName', header: 'Driver' },
    { key: 'truckNo', header: 'Truck No' },
    { key: 'qtyOfGrains', header: 'Qty', sortable: true },
    { key: 'grainType', header: 'Grain Type' },
  ]

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Truck size={22} className="text-primary opacity-80" />
            Suppliers Record
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage and track inbound grain deliveries from suppliers</p>
        </div>
      </div>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Total Records" value={filteredData.length} subtitle="Based on current filters" />
        <StatCard title="Total Qty Received" value={`${totalQty.toLocaleString()} kg`} subtitle="Cumulative total" />
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={filteredData}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search supplier or truck no..."
        searchKeys={['supplierName', 'truckNo', 'driverName']}
        emptyIcon={<Truck />}
        emptyMessage={grainFilter !== 'All' 
          ? "We couldn't find any records matching your current filters."
          : "There are currently no inbound grain deliveries recorded."
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
              Log Supplier
            </Button>
          </div>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Supplier Record"
        description="Log a new inbound grain delivery."
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
                  Add Supplier
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
          id="supplier-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="supplierName" children={(field) => <FormField field={field} label="Supplier Name" />} />
            <form.Field name="truckNo" children={(field) => <FormField field={field} label="Truck No" />} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="driverName" children={(field) => <FormField field={field} label="Driver Name" />} />
            <form.Field name="refPhoneNo" children={(field) => <FormField field={field} label="Ref Phone No" type="tel" />} />
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
            <form.Field name="storeLocation" children={(field) => <FormField field={field} label="Store Location" />} />
            <form.Field name="weightNo" children={(field) => <FormField field={field} label="Weight No" />} />
            <form.Field name="rejectNo" children={(field) => <FormField field={field as any} label="Reject No" type="number" />} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <form.Field name="dateTimeIn" children={(field) => <DateTimeField field={field} label="Date/Time In" />} />
            <form.Field name="dateTimeOut" children={(field) => <DateTimeField field={field} label="Date/Time Out (Optional)" />} />
          </div>
        </form>
      </Modal>
    </div>
  )
}
