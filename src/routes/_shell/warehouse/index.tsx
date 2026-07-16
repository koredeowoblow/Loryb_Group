import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_shell/warehouse/')({
  beforeLoad: () => {
    throw redirect({
      to: '/warehouse/stock-overview',
    })
  },
})

