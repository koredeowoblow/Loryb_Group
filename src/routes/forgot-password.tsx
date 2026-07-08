import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

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
    // Simulation: Success
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 font-sans text-text-primary">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl border border-surface-border">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Loryb Group of Companies" className="h-16 w-auto mb-4" />
          <h2 className="mt-2 text-center text-3xl font-bold font-header tracking-tight text-primary">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Enter your email to receive recovery instructions
          </p>
        </div>

        {!isSubmitted ? (
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
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold font-header uppercase tracking-wider text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 bg-status-success/10 border border-status-success/20 p-4 rounded text-center">
            <h3 className="text-status-success font-bold font-header text-lg mb-2">Check your email</h3>
            <p className="text-sm text-text-secondary">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
          </div>
        )}
        
        <div className="text-center text-sm mt-6">
          <Link to="/login" className="font-bold text-primary hover:text-primary-hover transition-colors flex items-center justify-center gap-1">
            <span>&larr;</span> Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
