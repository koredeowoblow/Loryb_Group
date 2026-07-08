import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './auth'
import './index.css'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient()

export function AppRouter() {
  const auth = useAuth()
  
  const router = createRouter({ 
    routeTree,
    context: { auth }
  })

  return <RouterProvider router={router as any} />
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
