import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { ShoppingCart } from 'lucide-react'

import { itemBought } from '../../../api/security'
import { ItemBought } from '../../../types'
import { validateFormWithZod } from '../../../lib/zodValidator'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { DateTimeField } from '../../../components/ui/DateTimeField'
import { DataTable, Column } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'

export const Route = createFileRoute('/_shell/security/item-bought')({
  component: ItemBoughtPage,
})

const schema = z.object({
  supplierName: z.string().min(1, 'Required'),
  truckNo: z.string().min(1, 'Required'),
  goodsType: z.string().min(1, 'Required'),
  goodsQty: z.number().min(0, 'Must be >= 0'),
  dateTimeIn: z.string().min(1, 'Required'),
  dateTimeOut: z.string().optional(),
})

function ItemBoughtPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['itemBought'],
    queryFn: itemBought.list,
  })

  const mutation = useMutation({
    mutationFn: itemBought.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemBought'] })
      setIsModalOpen(false)
    },
    onError: () => setErrorMsg('Failed to save record. Please try again.')
  })

  const form = useForm({
    defaultValues: {
      supplierName: '',
      truckNo: '',
      goodsType: '',
      goodsQty: 0,
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

  const columns: Column<ItemBought>[] = [
    { key: 'supplierName', header: 'Supplier Name', sortable: true },
    { key: 'truckNo', header: 'Truck No' },
    { key: 'goodsType', header: 'Goods Type' },
    { key: 'goodsQty', header: 'Qty', sortable: true },
    { key: 'dateTimeIn', header: 'Time In', sortable: true },
    { 
      key: 'dateTimeOut', 
      header: 'Time Out',
      render: (row) => row.dateTimeOut 
        ? <span className="text-text-muted">{row.dateTimeOut}</span> 
        : <Badge status="active" />
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ShoppingCart size={22} className="text-primary opacity-80" />
            Item Bought
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Track incoming purchases and goods</p>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search suppliers or goods..."
        searchKeys={['supplierName', 'truckNo', 'goodsType']}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Record Purchase
          </Button>
        }
      />

      {/* ── Create Modal ────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Item Bought"
        description="Record a new incoming purchase."
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
                  Record Purchase
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
          id="item-bought-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <form.Field name="supplierName" children={(field) => <FormField field={field} label="Supplier Name" />} />
            <form.Field name="truckNo" children={(field) => <FormField field={field} label="Truck No" />} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <form.Field name="goodsType" children={(field) => <FormField field={field} label="Goods Type" />} />
            <form.Field name="goodsQty" children={(field) => <FormField field={field as any} label="Goods Qty" type="number" />} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <form.Field name="dateTimeIn" children={(field) => <DateTimeField field={field} label="Date/Time In" />} />
            <form.Field name="dateTimeOut" children={(field) => <DateTimeField field={field} label="Date/Time Out (Optional)" />} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

