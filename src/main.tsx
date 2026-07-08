import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './auth'
import './index.css'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient()

const hashHistory = createHashHistory()

const router = createRouter({ 
  routeTree,
  history: hashHistory,
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
