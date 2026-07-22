import { createRootRouteWithContext, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-surface-muted px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Page Not Found</h2>
        <p className="text-text-muted mb-8">
          We can't find that page. It might have been moved or deleted.
        </p>
        <Link 
          to="/"
          className="inline-block bg-primary hover:bg-primary-hover text-text-inverse px-6 py-3 rounded-md font-medium transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}

import { useAuth } from '../auth'

interface MyRouterContext {
  auth: ReturnType<typeof useAuth>
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const router = useRouterState()
    const isLoading = router.status === 'pending' || router.isLoading

    return (
      <>
        {isLoading && (
          <div className="progress-bar-track !fixed !top-0 !left-0 !right-0 !h-1 !z-[9999]">
            <div className="progress-bar-fill" />
          </div>
        )}
        <Outlet />
      </>
    )
  },
  notFoundComponent: NotFound,
})
