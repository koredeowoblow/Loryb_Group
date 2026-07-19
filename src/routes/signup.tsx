import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Security',
  })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    // Simulation: Success
    navigate({ to: '/login' as any })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 font-sans text-text-primary">
      <div className="card max-w-md w-full space-y-8 p-10">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Loryb Group of Companies" className="h-16 w-auto mb-4" />
          <h2 className="mt-2 text-center text-3xl font-bold font-header tracking-tight text-text-primary">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Request access to the Loryb Ops Platform
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-status-error/10 text-status-error border border-status-error/20 p-3 rounded text-sm font-medium text-center">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">First Name</label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-surface-border rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface-muted focus:bg-surface transition-colors"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Last Name</label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-surface-border rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface-muted focus:bg-surface transition-colors"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-text-primary mb-1">Email address</label>
            <input
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-surface-border rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface-muted focus:bg-surface transition-colors"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-3 py-2 border border-surface-border rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface-muted focus:bg-surface transition-colors"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Confirm Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-3 py-2 border border-surface-border rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface-muted focus:bg-surface transition-colors"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-text-primary mb-1">Requested Role</label>
            <select
              className="appearance-none block w-full px-3 py-2 border border-surface-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface-muted focus:bg-surface transition-colors"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Security">Security Team</option>
              <option value="Warehouse">Warehouse Staff</option>
              <option value="Logistics">Logistics / Fleet</option>
              <option value="Finance">Finance Team</option>
            </select>
            <p className="text-xs text-text-muted mt-1">Role assignments require admin approval.</p>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary w-full py-2.5"
            >
              Request Access
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-text-secondary">Already have an account? </span>
          <Link to="/login" className="font-bold text-primary hover:text-primary-hover transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
