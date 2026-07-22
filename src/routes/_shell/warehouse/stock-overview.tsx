import { createFileRoute } from '@tanstack/react-router'
import { binCard, grn, inventoryAlerts } from '../../../api/warehouse'

export const Route = createFileRoute('/_shell/warehouse/stock-overview')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData({ queryKey: ['binCards'], queryFn: binCard.list }),
      queryClient.ensureQueryData({ queryKey: ['grn'], queryFn: grn.list }),
      queryClient.ensureQueryData({ queryKey: ['alerts'], queryFn: inventoryAlerts.list })
    ])
  }
})
