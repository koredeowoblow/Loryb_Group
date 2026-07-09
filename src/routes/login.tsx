import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { auth, USE_MOCK_DATA } from '../api/core'
import { useAuth } from '../auth'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const { setRole } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      const response = await auth.login(formData)
      const { role } = response.user
      setRole(role)
      
      const roleRedirects: Record<string, string> = {
        'CEO': '/ceo/overview',
        'Admin': '/ceo/overview',
        'Security': '/security/gate-log',
        'Warehouse': '/warehouse/stock-overview',
        'Logistics': '/logistics/fleet',
        'Finance': '/finance/overview',
      }
      
      navigate({ to: (roleRedirects[role] || '/ceo/overview') as any })
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 font-sans text-text-primary">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl border border-surface-border">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Loryb Group of Companies" className="h-16 w-auto mb-4" />
          <h2 className="mt-2 text-center text-3xl font-bold font-header tracking-tight text-primary">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Sign in to the Loryb Ops Platform
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-status-error/10 text-status-error border border-status-error/20 p-3 rounded text-sm font-medium text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-text-primary mb-1">Email address</label>
            <input
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-surface-border rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface-muted focus:bg-white transition-colors"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-primary mb-1">Password</label>
            <input
              type="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-surface-border rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface-muted focus:bg-white transition-colors"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-surface-border rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-bold text-primary hover:text-primary-hover transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold font-header uppercase tracking-wider text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        {USE_MOCK_DATA && (
          <div className="mt-6 border border-surface-border rounded-md overflow-hidden overflow-x-auto bg-surface-muted">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text-primary hover:bg-surface-active transition-colors"
            >
              <span>Demo Accounts (Mock Data Mode)</span>
              {showHint ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showHint && (
              <div className="p-4 border-t border-surface-border bg-white text-xs text-text-secondary">
                <table className="w-full">
                  <thead>
                    <tr className="text-left font-bold text-text-primary border-b border-surface-border">
                      <th className="pb-2">Role</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Password</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    <tr><td className="py-2">CEO</td><td>ceo@lorybgroup.com</td><td className="font-mono">Ceo@12345</td></tr>
                    <tr><td className="py-2">Admin</td><td>admin@lorybgroup.com</td><td className="font-mono">Admin@12345</td></tr>
                    <tr><td className="py-2">Security</td><td>security@lorybgroup.com</td><td className="font-mono">Security@123</td></tr>
                    <tr><td className="py-2">Warehouse</td><td>warehouse@lorybgroup.com</td><td className="font-mono">Warehouse@123</td></tr>
                    <tr><td className="py-2">Logistics</td><td>logistics@lorybgroup.com</td><td className="font-mono">Logistics@123</td></tr>
                    <tr><td className="py-2">Finance</td><td>finance@lorybgroup.com</td><td className="font-mono">Finance@123</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center text-sm">
          <span className="text-text-secondary">Don't have an account? </span>
          <Link to="/signup" className="font-bold text-primary hover:text-primary-hover transition-colors">
            Request access
          </Link>
        </div>
      </div>
    </div>
  )
}
