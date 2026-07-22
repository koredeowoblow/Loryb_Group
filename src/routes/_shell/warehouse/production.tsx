import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Factory } from 'lucide-react'

import { production, branches, staff } from '../../../api/core'
import { Production } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { SelectField } from '../../../components/ui/SelectField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'

export const Route = createFileRoute('/_shell/warehouse/production')({
  component: ProductionPage,
})

const schema = z.object({
  branchId: z.string().min(1, 'Required'),
  staffId: z.string().min(1, 'Required'),
  metricType: z.string().min(1, 'Required'),
  value: z.string().min(1, 'Required'),
  recordedAt: z.string().min(1, 'Required'),
})

function ProductionPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data: branchesData = [] } = useQuery({ 
    queryKey: ['branches'], 
    queryFn: async () => { const res = await branches.list(); return Array.isArray(res) ? res : (res as any).data || [] },
    enabled: isModalOpen
  })
  const { data: staffData = [] } = useQuery({ 
    queryKey: ['staff'], 
    queryFn: async () => { const res = await staff.list(); return Array.isArray(res) ? res : (res as any).data || [] },
    enabled: isModalOpen
  })
  
  const { data, isLoading } = useQuery({
    queryKey: ['production'],
    queryFn: async () => {
      const res = await production.list();
      return Array.isArray(res) ? res : (res as any).data || [];
    },
  })

  const mutation = useMutation({
    mutationFn: production.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: { branchId: '', staffId: '', metricType: '', value: '', recordedAt: '' },
    validators: { onChange: validateFormWithZod(schema) },
    onSubmit: async ({ value }) => {
      setErrorMsg('')
      await mutation.mutateAsync({ ...value, value: Number(value.value) } as any)
    },
  })

  const columns: Column<Production>[] = [
    { key: 'metricType', header: 'Metric', sortable: true },
    { key: 'value', header: 'Value', sortable: true, render: (row) => <span className="font-semibold">{row.value}</span> },
    { key: 'branchId', header: 'Branch', render: (row: any) => row.branchName || 'N/A' },
    { key: 'staffId', header: 'Staff', render: (row: any) => row.staffName || 'N/A' },
    { key: 'recordedAt', header: 'Recorded At', sortable: true, render: (row) => new Date(row.recordedAt).toLocaleString() },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Factory size={22} className="text-primary opacity-80" />
            Production Metrics
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Log and track flexible production outputs across branches</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search metrics..."
        searchKeys={['metricType']}
        actions={<Button onClick={() => setIsModalOpen(true)}>Log Metric</Button>}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Production Metric"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button onClick={(e) => { e.preventDefault(); form.handleSubmit() }} disabled={!canSubmit || isSubmitting} isLoading={isSubmitting}>
                Save Log
              </Button>
            )} />
          </>
        }>
        {errorMsg && <div className="alert alert-danger mb-4">{errorMsg}</div>}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="branchId" children={(field) => <SelectField field={field} label="Branch" options={branchesData.map((b:any)=>({label:b.name, value:b.id}))} />} />
          <form.Field name="staffId" children={(field) => <SelectField field={field} label="Staff Member" options={staffData.map((s:any)=>({label:s.name, value:s.id}))} />} />
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="metricType" children={(field) => <FormField field={field} label="Metric (e.g. Trips, Bags)" />} />
            <form.Field name="value" children={(field) => <FormField field={field} label="Value" type="number" />} />
          </div>
          <form.Field name="recordedAt" children={(field) => <DateTimeField field={field} label="Recorded Time" />} />
        </form>
      </Modal>
    </div>
  )
}
