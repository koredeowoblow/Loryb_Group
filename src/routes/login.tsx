import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { auth, USE_MOCK_DATA } from "../api/core";
import { useAuth } from "../auth";
import { ChevronDown, ChevronUp, AlertCircle, Mail, Lock } from "lucide-react";
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
}: {
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  icon: React.ElementType;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none"
        />
        <input
          id={id}
          type={type}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full pl-10 pr-4 py-3 text-sm
            bg-white border rounded-sm
            text-text-primary placeholder:text-gray-400
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
          "
          style={{ borderColor: 'rgb(180 188 208)' }}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await auth.login({ email, password });
      const { role } = response.user;
      localStorage.setItem("loryb_token", response.token);
      setRole(role);
      navigate({ to: getRoleRedirect(role) as any });
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-surface-base">
      {/* ── Left brand panel (lg+ only) ─────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[42%] xl:w-[38%] flex-col justify-between p-12 relative overflow-hidden shrink-0"
        style={{ background: "rgb(var(--color-primary))" }}
        aria-hidden="true"
      >
        {/* Diagonal stripe texture — pure CSS, no image asset */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #fff 0,
              #fff 1px,
              transparent 0,
              transparent 50%
            )`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top: logo + wordmark */}
        <div className="relative z-10 flex items-center gap-3">
          <img
            src="/logo.png"
            alt=""
            className="h-10 w-auto object-contain brightness-0 invert"
          />
          <span className="text-white text-lg font-bold tracking-tight">
            Loryb Group
          </span>
        </div>

        {/* Middle: tagline */}
        <div className="relative z-10">
          <p className="text-white/90 text-2xl font-bold leading-snug max-w-xs">
            Integrated operations.
            <br />
            One platform.
          </p>
          <p className="text-white/50 text-sm mt-3 max-w-xs leading-relaxed">
            Warehouse · Logistics · Finance · Security managed from a single
            command centre.
          </p>
        </div>

        {/* Bottom: accent gold bar */}
        <div className="relative z-10">
          <div
            className="h-1 w-16 rounded-full mb-4"
            style={{ background: "rgb(var(--color-accent))" }}
          />
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Loryb Group of Companies
          </p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 min-h-screen">
        <div className="w-full max-w-md">

          {/* Mobile-only brand mark — text-based, no image dependency */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <img
              src="/logo.png"
              alt=""
              className="h-8 w-auto object-contain"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: 'rgb(var(--color-primary))' }}
            >
              Loryb Group
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Welcome back
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Sign in to the Loryb Ops Platform
            </p>
          </div>

          {/* Form card with 4px left accent border */}
          <div
            className="bg-surface-raised rounded-md shadow-md border border-surface-border overflow-hidden"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor: 'rgb(var(--color-primary))',
            }}
          >
            <div className="px-8 py-8 flex flex-col gap-8">
              {/* Error banner */}
              {error && (
                <div className="alert alert-danger">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
                noValidate
              >
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

                {/* Remember me + forgot — same link style */}
                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded-sm accent-primary"
                    />
                    <span className="text-xs text-text-secondary">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-3.5 mt-2 justify-center font-semibold tracking-wide disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* ── Demo accounts — inside card, below divider ─────────── */}
              {USE_MOCK_DATA && (
                <div className="border-t border-surface-border -mx-8 px-8 pt-6">
                  <button
                    onClick={() => setShowHint((h) => !h)}
                    className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors"
                  >
                    <span>Demo accounts</span>
                    {showHint ? (
                      <ChevronUp size={13} />
                    ) : (
                      <ChevronDown size={13} />
                    )}
                  </button>

                  {showHint && (
                    <div className="mt-3 -mx-6 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-surface-active text-left">
                            <th className="px-4 py-2 font-semibold text-text-secondary">
                              Role
                            </th>
                            <th className="px-4 py-2 font-semibold text-text-secondary">
                              Email
                            </th>
                            <th className="px-4 py-2 font-semibold text-text-secondary">
                              Password
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                          {[
                            ["CEO", "ceo@lorybgroup.com", "Ceo@12345"],
                            ["Admin", "admin@lorybgroup.com", "Admin@12345"],
                            [
                              "Security",
                              "security@lorybgroup.com",
                              "Security@123",
                            ],
                            [
                              "Warehouse",
                              "warehouse@lorybgroup.com",
                              "Warehouse@123",
                            ],
                            [
                              "Logistics",
                              "logistics@lorybgroup.com",
                              "Logistics@123",
                            ],
                            [
                              "Finance",
                              "finance@lorybgroup.com",
                              "Finance@123",
                            ],
                          ].map(([role, emailVal, pass]) => (
                            <tr
                              key={role}
                              className="hover:bg-surface-active transition-colors"
                            >
                              <td className="px-4 py-2 font-medium text-text-primary">
                                {role}
                              </td>
                              <td
                                className="px-4 py-2 text-text-secondary cursor-pointer hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                                role="button"
                                tabIndex={0}
                                onClick={() => setEmail(emailVal)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setEmail(emailVal);
                                  }
                                }}
                                title="Click to fill email"
                              >
                                {emailVal}
                              </td>
                              <td
                                className="px-4 py-2 font-mono text-text-secondary cursor-pointer hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                                role="button"
                                tabIndex={0}
                                onClick={() => setPassword(pass)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setPassword(pass);
                                  }
                                }}
                                title="Click to fill password"
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
            </div>
          </div>

          {/* Footer — same link style as Forgot password */}
          <p className="text-center text-xs text-text-muted mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
