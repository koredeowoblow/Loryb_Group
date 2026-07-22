import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './auth'
import './index.css'
import { routeTree } from './routeTree.gen'

// Normalize '/index.html' to '/' to prevent TanStack Router 404 on initial load
if (typeof window !== 'undefined' && window.location.pathname === '/index.html') {
  window.history.replaceState(null, '', '/')
}

const queryClient = new QueryClient()

const router = createRouter({ 
  routeTree,
  context: { auth: undefined! as any }
})

export function AppRouter() {
  const auth = useAuth()
  
  return <RouterProvider router={router as any} context={{ auth }} />
}

declare module '@tanstack/react-router' {
  interface Register {
    router: any
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
