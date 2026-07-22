import { createFileRoute } from '@tanstack/react-router'
import { trucks, trips } from '../../../api/logistics'

export const Route = createFileRoute('/_shell/logistics/fleet')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData({ queryKey: ['trucks'], queryFn: trucks.list }),
      queryClient.ensureQueryData({ queryKey: ['trips'], queryFn: trips.list })
    ])
  }
})
