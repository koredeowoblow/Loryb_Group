import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_shell/overview')({
  component: OverviewPage,
})

function OverviewPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">CEO Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placeholder cards */}
      </div>
    </div>
  )
}

