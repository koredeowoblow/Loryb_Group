import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { User, Mail, Lock, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

// ── Shared auth input ──────────────────────────────────────────────────────────
function AuthInput({
  id, type, value, onChange, label, placeholder, icon: Icon, autoComplete,
}: {
  id: string; type: string; value: string; onChange: (v: string) => void
  label: string; placeholder?: string; icon: React.ElementType; autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          id={id} type={type} required autoComplete={autoComplete} placeholder={placeholder}
          value={value} onChange={e => onChange(e.target.value)}
          className="
            w-full pl-9 pr-3 py-2.5 text-sm
            bg-surface-base border border-surface-border rounded-sm
            text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60
            transition-colors
          "
        />
      </div>
    </div>
  )
}

function SignupPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('Security')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    navigate({ to: '/login' as any })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 font-sans"
      style={{
        background: `
          radial-gradient(ellipse at 60% 0%, rgb(var(--color-primary) / 0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 0% 100%, rgb(var(--color-primary) / 0.08) 0%, transparent 50%),
          rgb(var(--color-surface-base))
        `,
      }}
    >
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Brand mark */}
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.png" alt="Loryb Group of Companies" className="h-12 w-auto object-contain" />
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-text-primary">Request access</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Submit your details for admin approval
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="card p-8 flex flex-col gap-5">
          {error && (
            <div className="alert alert-danger flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <AuthInput id="firstName" type="text" value={firstName} onChange={setFirstName}
                label="First name" placeholder="Ada" icon={User} autoComplete="given-name" />
              <AuthInput id="lastName" type="text" value={lastName} onChange={setLastName}
                label="Last name" placeholder="Okafor" icon={User} autoComplete="family-name" />
            </div>

            <AuthInput id="email" type="email" value={email} onChange={setEmail}
              label="Email address" placeholder="you@lorybgroup.com" icon={Mail} autoComplete="email" />

            <div className="grid grid-cols-2 gap-3">
              <AuthInput id="password" type="password" value={password} onChange={setPassword}
                label="Password" placeholder="••••••••" icon={Lock} autoComplete="new-password" />
              <AuthInput id="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword}
                label="Confirm" placeholder="••••••••" icon={Lock} autoComplete="new-password" />
            </div>

            {/* Role selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Requested role
              </label>
              <select
                id="role"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="
                  w-full px-3 py-2.5 text-sm
                  bg-surface-base border border-surface-border rounded-sm
                  text-text-primary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60
                  transition-colors cursor-pointer
                "
              >
                <option value="Security">Security Team</option>
                <option value="Warehouse">Warehouse Staff</option>
                <option value="Logistics">Logistics / Fleet</option>
                <option value="Finance">Finance Team</option>
              </select>
              <p className="text-xs text-text-muted">Role assignments require admin approval.</p>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full py-2.5 mt-1 justify-center font-semibold tracking-wide"
            >
              Submit request
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
