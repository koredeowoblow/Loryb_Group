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
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          id={id} type={type} required autoComplete={autoComplete} placeholder={placeholder}
          value={value} onChange={e => onChange(e.target.value)}
          className="
            w-full pl-[48px] pr-4 py-4 text-base font-medium
            bg-transparent border-2 border-surface-border rounded-md
            text-text-primary placeholder:text-text-muted
            transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary
            hover:border-text-muted
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
      setError('Passwords do not match. Please try again.')
      return
    }
    navigate({ to: '/login' as any })
  }

  return (
    <div className="min-h-screen flex font-sans bg-surface-base">
      {/* ── Left brand panel (lg+ only) ─────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col justify-between p-16 relative overflow-hidden shrink-0"
        style={{ background: "rgb(var(--color-primary))" }}
        aria-hidden="true"
      >
        {/* Abstract geometric background */}
        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full bg-white blur-[150px]" />
        </div>

        {/* Top: logo + wordmark */}
        <div className="relative z-10 flex items-center gap-4 animate-stagger-1">
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            className="h-12 w-auto object-contain brightness-0 invert"
          />
          <span className="text-white text-xl font-bold tracking-tight">
            Loryb Group
          </span>
        </div>

        {/* Middle: tagline — dramatically scaled up */}
        <div className="relative z-10 animate-stagger-2">
          <h1 className="text-white text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight max-w-lg mb-6">
            Loryb Operations
            <br />
            <span className="text-white/70">Network</span>
          </h1>
          <p className="text-white/80 text-lg max-w-md leading-relaxed font-medium">
            Request an account to access secure enterprise logistics, warehousing, and finance tools.
          </p>
        </div>

        {/* Bottom: accent gold bar */}
        <div className="relative z-10 animate-stagger-3">
          <div
            className="h-2 w-24 rounded-full mb-6"
            style={{ background: "rgb(var(--color-accent))" }}
          />
          <p className="text-white/70 text-sm font-semibold tracking-wide uppercase">
            © {new Date().getFullYear()} Loryb Group of Companies
          </p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 py-12 min-h-screen relative overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile-only brand mark */}
          <div className="flex lg:hidden items-center gap-3 mb-12 animate-stagger-1">
            <img src="/logo.png" alt="Loryb Group" className="h-10 w-auto object-contain" />
            <span className="text-2xl font-bold tracking-tight text-primary">
              Loryb Group
            </span>
          </div>

          {/* Heading */}
          <div className="mb-10 animate-stagger-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Request access
            </h2>
            <p className="text-base font-medium text-text-secondary mt-2">
              Enter your details to get started.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {error && (
              <div className="alert alert-danger px-4 py-4 animate-stagger-1 border-l-4 border-l-status-danger rounded-r-md">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium text-sm leading-snug">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              <div className="grid grid-cols-2 gap-4 animate-stagger-2">
                <AuthInput id="firstName" type="text" value={firstName} onChange={setFirstName}
                  label="First name" placeholder="Ada" icon={User} autoComplete="given-name" />
                <AuthInput id="lastName" type="text" value={lastName} onChange={setLastName}
                  label="Last name" placeholder="Okafor" icon={User} autoComplete="family-name" />
              </div>

              <div className="animate-stagger-3">
                <AuthInput id="email" type="email" value={email} onChange={setEmail}
                  label="Email address" placeholder="you@lorybgroup.com" icon={Mail} autoComplete="email" />
              </div>

              <div className="grid grid-cols-2 gap-4 animate-stagger-4">
                <AuthInput id="password" type="password" value={password} onChange={setPassword}
                  label="Password" placeholder="••••••••" icon={Lock} autoComplete="new-password" />
                <AuthInput id="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword}
                  label="Confirm password" placeholder="••••••••" icon={Lock} autoComplete="new-password" />
              </div>

              {/* Role selector */}
              <div className="flex flex-col gap-2 animate-stagger-5">
                <label htmlFor="role" className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Requested role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="
                    w-full px-4 py-4 text-base font-medium
                    bg-transparent border-2 border-surface-border rounded-md
                    text-text-primary
                    transition-all duration-200 cursor-pointer
                    focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary
                    hover:border-text-muted
                  "
                >
                  <option value="Security">Security Team</option>
                  <option value="Warehouse">Warehouse Staff</option>
                  <option value="Logistics">Logistics / Fleet</option>
                  <option value="Finance">Finance Team</option>
                </select>
                <p className="text-xs font-medium text-text-muted mt-1">An administrator must approve your role before you can sign in.</p>
              </div>

              <div className="animate-stagger-5 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full py-4 text-base justify-center font-bold tracking-wide shadow-lg hover:shadow-xl"
                >
                  Request account
                </button>
              </div>
            </form>
            
            {/* Footer */}
            <p className="text-center text-sm font-medium text-text-muted mt-8 animate-stagger-5">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary-hover transition-colors underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
