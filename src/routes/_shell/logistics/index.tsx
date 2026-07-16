import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_shell/logistics/')({
  beforeLoad: () => {
    throw redirect({
      to: '/logistics/fleet',
    })
  },
})

