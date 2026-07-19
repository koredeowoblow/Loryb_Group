import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/403')({
  component: AccessDeniedPage,
})

function AccessDeniedPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-surface-muted px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-primary mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Access Denied</h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          You don't have permission to access this module. Please contact your administrator if you believe this is an error.
        </p>
        <Link 
          to="/"
          className="btn btn-primary px-6 py-3"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
