import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { auth, USE_MOCK_DATA } from '../api/core'
import { useAuth } from '../auth'
import { ChevronDown, ChevronUp, AlertCircle, Mail, Lock } from 'lucide-react'
import { getRoleRedirect } from '../lib/rbac'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

// ── Shared input primitive ─────────────────────────────────────────────────────
// No shared Input component exists in the component library yet.
// This local wrapper matches FormField's visual style so inputs are consistent.
function AuthInput({
  id,
  type,
  value,
  onChange,
  label,
  placeholder,
  icon: Icon,
  autoComplete,
}: {
  id: string
  type: string
  value: string
  onChange: (v: string) => void
  label: string
  placeholder?: string
  icon: React.ElementType
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          id={id}
          type={type}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
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

// ── Page ───────────────────────────────────────────────────────────────────────

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setRole } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await auth.login({ email, password })
      const { role } = response.user
      localStorage.setItem('loryb_token', response.token)
      setRole(role)
      navigate({ to: getRoleRedirect(role) as any })
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    /*
     * Background: deep navy gradient using --color-primary (0 43 121) at two
     * opacity levels. Restrained — the form card is the focal point.
     * No new token created: uses the existing --color-primary and
     * --color-surface-base triplets via inline style.
     */
    <div
      className="min-h-screen flex items-center justify-center px-4 font-sans"
      style={{
        background: `
          radial-gradient(ellipse at 60% 0%, rgb(var(--color-primary) / 0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 0% 100%, rgb(var(--color-primary) / 0.08) 0%, transparent 50%),
          rgb(var(--color-surface-base))
        `,
      }}
    >
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* ── Brand mark ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/logo.png"
            alt="Loryb Group of Companies"
            className="h-12 w-auto object-contain"
          />
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              Welcome back
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Sign in to the Loryb Ops Platform
            </p>
          </div>
        </div>

        {/* ── Form card ───────────────────────────────────────────────────── */}
        <div className="card p-8 flex flex-col gap-5">

          {/* Error banner */}
          {error && (
            <div className="alert alert-danger flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <AuthInput
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              label="Email address"
              placeholder="you@lorybgroup.com"
              icon={Mail}
              autoComplete="email"
            />

            <AuthInput
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              label="Password"
              placeholder="Enter your password"
              icon={Lock}
              autoComplete="current-password"
            />

            {/* Remember me + forgot */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded-sm border-surface-border text-primary focus:ring-primary/30 accent-primary"
                />
                <span className="text-xs text-text-secondary">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 mt-1 justify-center font-semibold tracking-wide disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* ── Demo accounts accordion ─────────────────────────────────────── */}
        {USE_MOCK_DATA && (
          <div className="card overflow-hidden">
            <button
              onClick={() => setShowHint(h => !h)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text-secondary hover:bg-surface-active transition-colors"
            >
              <span>Demo accounts</span>
              {showHint
                ? <ChevronUp size={15} className="text-text-muted" />
                : <ChevronDown size={15} className="text-text-muted" />
              }
            </button>

            {showHint && (
              <div className="border-t border-surface-border overflow-x-auto">
                <table className="w-full text-xs text-text-secondary">
                  <thead>
                    <tr className="bg-surface-active text-left">
                      <th className="px-4 py-2 font-semibold text-text-primary">Role</th>
                      <th className="px-4 py-2 font-semibold text-text-primary">Email</th>
                      <th className="px-4 py-2 font-semibold text-text-primary">Password</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {[
                      ['CEO',       'ceo@lorybgroup.com',       'Ceo@12345'],
                      ['Admin',     'admin@lorybgroup.com',     'Admin@12345'],
                      ['Security',  'security@lorybgroup.com',  'Security@123'],
                      ['Warehouse', 'warehouse@lorybgroup.com', 'Warehouse@123'],
                      ['Logistics', 'logistics@lorybgroup.com', 'Logistics@123'],
                      ['Finance',   'finance@lorybgroup.com',   'Finance@123'],
                    ].map(([role, emailVal, pass]) => (
                      <tr key={role} className="hover:bg-surface-active transition-colors">
                        <td className="px-4 py-2 font-medium text-text-primary">{role}</td>
                        <td
                          className="px-4 py-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => setEmail(emailVal)}
                          title="Click to fill"
                        >
                          {emailVal}
                        </td>
                        <td
                          className="px-4 py-2 font-mono cursor-pointer hover:text-primary transition-colors"
                          onClick={() => setPassword(pass)}
                          title="Click to fill"
                        >
                          {pass}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Footer link ─────────────────────────────────────────────────── */}
        <p className="text-center text-xs text-text-muted">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            Request access
          </Link>
        </p>
      </div>
    </div>
  )
}
