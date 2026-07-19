import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address')
      return
    }
    setError('')
    setIsSubmitted(true)
  }

  return (
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

        {/* Brand mark */}
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.png" alt="Loryb Group of Companies" className="h-12 w-auto object-contain" />
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-text-primary">Reset password</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Enter your email to receive recovery instructions
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="card p-8 flex flex-col gap-5">
          {!isSubmitted ? (
            <>
              {error && (
                <div className="alert alert-danger flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@lorybgroup.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
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

                <button type="submit" className="btn btn-primary w-full py-2.5 justify-center font-semibold tracking-wide">
                  Send reset link
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle size={40} className="text-status-success" strokeWidth={1.5} />
              <div>
                <p className="font-semibold text-text-primary">Check your inbox</p>
                <p className="text-sm text-text-secondary mt-1">
                  If an account exists for <span className="font-medium text-text-primary">{email}</span>, 
                  you'll receive a reset link shortly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Back link */}
        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </div>
    </div>
  )
}
