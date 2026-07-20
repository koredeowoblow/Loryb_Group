import { UserCircle } from 'lucide-react'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { drivers, trucks as trucksApi } from '../../../api/logistics'
import { Driver } from '../../../types'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/logistics/drivers')({
  component: DriversPage,
})

const columns: Column<Driver>[] = [
  { key: 'driverName', header: 'Driver Name', sortable: true },
  { key: 'phoneNo', header: 'Phone' },
  { key: 'licenseNo', header: 'License No' },
  { key: 'licenseExpiry', header: 'License Expiry', sortable: true },
  { key: 'assignedTruckNo', header: 'Assigned Truck', sortable: true },
  { key: 'status', header: 'Status', render: (row: Driver) => <Badge status={row.status as any} /> },
]

const schema = z.object({
  driverName: z.string().min(1, 'Required'),
  phoneNo: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format'),
  licenseNo: z.string().min(1, 'Required'),
  licenseExpiry: z.string().min(1, 'Required'),
  assignedTruckNo: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

function DriversPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: drivers.list,
  })

  // Pull trucks for the select field
  const { data: trucks } = useQuery({
    queryKey: ['trucks'],
    queryFn: trucksApi.list,
  })

  const truckOptions = useMemo(() => {
    return (trucks || []).map(t => ({
      label: t.truckNo,
      value: t.truckNo,
    }))
  }, [trucks])

  const filteredData = data?.filter(row => {
    const matchesSearch = 
      row.driverName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      row.phoneNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (row.assignedTruckNo && row.assignedTruckNo.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const activeCount = filteredData.filter(d => d.status === 'active').length

  const mutation = useMutation({
    mutationFn: (payload: Omit<Driver, 'id'>) => drivers.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      setIsModalOpen(false)
    },
    onError: () => {
      setErrorMsg('Failed to save record. Please try again.')
    }
  })

  const form = useForm({
    defaultValues: {
      driverName: '',
      phoneNo: '',
      licenseNo: '',
      licenseExpiry: '',
      assignedTruckNo: '',
      status: 'active' as const,
    },
    validators: {
      onChange: validateFormWithZod(schema),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync(value)
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">Driver Registry</h2>
          <p className="text-sm text-text-secondary mt-1">Manage driver credentials, contact info, and truck assignments.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-text-inverse px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Register Driver
        </button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">Total Drivers</div>
            <div className="text-lg font-bold text-primary">{filteredData.length}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-status-success font-header">Active</div>
            <div className="text-lg font-bold text-status-success">{activeCount}</div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search name, phone, or truck..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="panel-table flex flex-col flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={searchTerm || statusFilter !== 'All' 
            ? "We couldn't find any drivers matching your current filters. Try adjusting your search criteria."
            : "There are currently no drivers in the registry. Register the first driver to assign them to a truck."}
          emptyIcon={<UserCircle size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />}
          actions={
            (!searchTerm && statusFilter === 'All') && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
              >
                Register Driver
              </button>
            )
          }
          className="rounded-none shadow-none border-2 border-surface-border"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Driver">
        {errorMsg && <div className="mb-4 text-sm bg-status-danger/10 border border-status-error/20 text-status-danger font-medium p-2 rounded">{errorMsg}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="driverName" children={(field) => <FormField field={field as any} label="Driver Name" />} />
          <form.Field name="phoneNo" children={(field) => <FormField field={field as any} label="Phone No" />} />
          <form.Field name="licenseNo" children={(field) => <FormField field={field as any} label="License No" />} />
          <form.Field name="licenseExpiry" children={(field) => <FormField field={field as any} label="License Expiry" type="date" />} />
          
          <form.Field name="assignedTruckNo" children={(field) => (
            <SelectField field={field as any} label="Assigned Truck (Optional)" options={[{ label: 'None', value: '' }, ...truckOptions]} />
          )} />
          
          <form.Field name="status" children={(field) => (
            <SelectField field={field as any} label="Status" options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]} />
          )} />

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
                  className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-text-inverse bg-primary hover:bg-primary-hover rounded shadow-sm border border-primary-light disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add Driver'}
                </button>
              )}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
