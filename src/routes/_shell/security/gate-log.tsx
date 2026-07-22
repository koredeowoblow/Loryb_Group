import { createFileRoute } from '@tanstack/react-router'
import { visitorLog as visitorLogApi, dispatchRecord as dispatchRecordApi, staffAttendance as staffAttendanceApi, motorcycleLog as motorcycleLogApi, suppliers as suppliersApi } from '../../../api/security'

export const Route = createFileRoute('/_shell/security/gate-log')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['security-dashboard-detailed'],
      queryFn: async () => {
        const [visitors, dispatch, staff, motorcycles, suppliers] = await Promise.all([
          visitorLogApi.list(),
          dispatchRecordApi.list(),
          staffAttendanceApi.list(),
          motorcycleLogApi.list(),
          suppliersApi.list(),
        ])
        return { visitors, dispatch, staff, motorcycles, suppliers }
      }
    })
  }
})
