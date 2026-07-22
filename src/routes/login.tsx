import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { auth, USE_MOCK_DATA } from "../api/core";
import { useAuth } from "../auth";
import { ChevronDown, ChevronUp, AlertCircle, Mail, Lock, CheckCircle } from "lucide-react";
import { getRoleRedirect } from "../lib/rbac";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

// ── Input primitive ────────────────────────────────────────────────────────────
function AuthInput({
  id,
  type,
  value,
  onChange,
  label,
  placeholder,
  icon: Icon,
  autoComplete,
  disabled,
}: {
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  icon: React.ElementType;
  autoComplete?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-widest text-text-secondary"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          id={id}
          type={type}
          required
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both your email address and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await auth.login({ email, password });
      const { role } = response.user;
      localStorage.setItem("loryb_token", response.token);
      setRole(role);
      setToastMessage(`Welcome back! Sign-in successful.`);
      
      setTimeout(() => {
        navigate({ to: getRoleRedirect(role) as any });
      }, 1200);
    } catch (err: any) {
      setError("We couldn't verify those credentials. Please check your email and password and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-surface-base">
      {/* ── Left brand panel (lg+ only) ─────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col justify-between p-16 relative overflow-hidden shrink-0 bg-primary"
        aria-hidden="true"
      >
        {/* Abstract geometric background to replace the generic stripe */}
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
            Integrated operations.
            <br />
            <span className="text-white/70">One platform.</span>
          </h1>
          <p className="text-white/80 text-lg max-w-md leading-relaxed font-medium">
            Warehouse, Logistics, Finance, and Security — commanded from a single pane of glass.
          </p>
        </div>

        {/* Bottom: accent gold bar */}
        <div className="relative z-10 animate-stagger-3">
          <div className="h-2 w-24 rounded-full mb-6 bg-accent" />
          <p className="text-white/70 text-sm font-semibold tracking-wide uppercase">
            © {new Date().getFullYear()} Loryb Group of Companies
          </p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 py-12 min-h-screen relative">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile-only brand mark */}
          <div className="flex lg:hidden items-center gap-3 mb-12 animate-stagger-1">
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              className="h-10 w-auto object-contain"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <span className="text-2xl font-bold tracking-tight text-primary">
              Loryb Group
            </span>
          </div>

          {/* Heading */}
          <div className="mb-10 animate-stagger-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Welcome back
            </h2>
            <p className="text-base font-medium text-text-secondary mt-2">
              Sign in to access the command centre.
            </p>
          </div>

          {/* Removed the generic card border, letting the form breathe */}
          <div className="flex flex-col gap-8">
            {/* Error banner */}
            {error && (
              <div className="alert alert-danger px-4 py-4 animate-stagger-1 border-l-4 border-l-status-danger rounded-r-md">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium text-sm leading-snug">{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
              noValidate
            >
              <div className="animate-stagger-2">
                <AuthInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  label="Email address"
                  placeholder="you@lorybgroup.com"
                  icon={Mail}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="animate-stagger-3">
                <AuthInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  label="Password"
                  placeholder="Enter your password"
                  icon={Lock}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between gap-4 mt-2 animate-stagger-4">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    id="remember-me"
                    type="checkbox"
                    disabled={loading}
                    className="h-4 w-4 rounded-sm accent-primary cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="animate-stagger-4 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-base justify-center font-bold tracking-wide disabled:opacity-60 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating…
                    </span>
                  ) : (
                    "Sign in to Dashboard"
                  )}
                </button>
              </div>
            </form>

            {toastMessage && (
              <div className="fixed bottom-6 right-6 z-50 bg-[#10b981] text-white px-6 py-4 rounded-md shadow-2xl flex items-center gap-3 border border-emerald-500/20 animate-bounce">
                <CheckCircle size={20} className="text-white shrink-0 animate-pulse" />
                <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
              </div>
            )}

            {/* ── Demo accounts ─────────── */}
            {USE_MOCK_DATA && (
              <div className="mt-8 pt-8 border-t-2 border-surface-border animate-stagger-5">
                <button
                  onClick={() => setShowHint((h) => !h)}
                  className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors group"
                >
                  <span>Quick Sign-in (Demo)</span>
                  {showHint ? (
                    <ChevronUp size={16} className="group-hover:translate-y-[-2px] transition-transform" />
                  ) : (
                    <ChevronDown size={16} className="group-hover:translate-y-[2px] transition-transform" />
                  )}
                </button>

                {showHint && (
                  <div className="mt-6 overflow-x-auto rounded-md border border-surface-border bg-surface-raised shadow-sm">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface-active text-left border-b border-surface-border">
                          <th className="px-5 py-3 font-bold text-text-secondary uppercase tracking-wider text-xs">
                            Role
                          </th>
                          <th className="px-5 py-3 font-bold text-text-secondary uppercase tracking-wider text-xs">
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border">
                        {[
                          ["CEO", "ceo@lorybgroup.com", "Ceo@12345"],
                          ["Admin", "admin@lorybgroup.com", "Admin@12345"],
                          ["Security", "security@lorybgroup.com", "Security@123"],
                          ["Warehouse", "warehouse@lorybgroup.com", "Warehouse@123"],
                          ["Logistics", "logistics@lorybgroup.com", "Logistics@123"],
                          ["Finance", "finance@lorybgroup.com", "Finance@123"],
                        ].map(([role, emailVal, pass]) => (
                          <tr
                            key={role}
                            className="hover:bg-surface-active transition-colors cursor-pointer"
                            onClick={() => {
                              setEmail(emailVal);
                              setPassword(pass);
                            }}
                          >
                            <td className="px-5 py-3 font-bold text-text-primary">
                              {role}
                            </td>
                            <td className="px-5 py-3 font-mono text-text-secondary">
                              {emailVal}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <p className="text-center text-sm font-medium text-text-muted mt-8 animate-stagger-5">
              Need access?{" "}
              <Link
                to="/signup"
                className="font-bold text-primary hover:text-primary-hover transition-colors underline underline-offset-4"
              >
                Request an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
