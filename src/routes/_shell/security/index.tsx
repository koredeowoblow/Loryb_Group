import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_shell/security/')({
  beforeLoad: () => {
    throw redirect({
      to: '/security/gate-log',
    })
  },
})
