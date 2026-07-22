import { createFileRoute, Outlet, Link, useRouterState, redirect, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef, Suspense } from 'react'
import {
  LayoutDashboard, Shield, Warehouse, Truck, DollarSign,
  ChevronDown, ChevronRight, LogOut, Settings as SettingsIcon,
  Menu, X, Sun, Moon,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth, Role } from '../auth'
import { parseJwt } from '../lib/jwt'
import { AUTH_BYPASS_PATHS, ADMIN_RESTRICTED_PATHS, getRoleRedirect } from '../lib/rbac'
import { GlobalLoader } from '../components/ui/GlobalLoader'
export const Route = createFileRoute('/_shell')({
  component: ShellLayout,
  beforeLoad: ({ context, location }) => {
    let role = context.auth.role
    const path = location.pathname
    
    if (!role) {
      const token = localStorage.getItem('loryb_token')
      if (token) {
        const decoded = parseJwt(token)
        if (decoded && decoded.role) {
          if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
            role = decoded.role as Role
          }
        }
      }
    }

    if (!role) {
      throw redirect({ to: '/login' })
    }
    if (role === 'CEO') return
    if (AUTH_BYPASS_PATHS.includes(path)) return
    if (role === 'Admin') {
      if (ADMIN_RESTRICTED_PATHS.some(p => path.startsWith(p))) throw redirect({ to: '/403' })
      return
    }
    const rolePath = role.toLowerCase()
    if (['Security', 'Warehouse', 'Logistics', 'Finance'].includes(role) && !path.startsWith(`/${rolePath}`)) {
      throw redirect({ to: getRoleRedirect(role) })
    }
  },
})

// ─── Shell ────────────────────────────────────────────────────────────────────

function ShellLayout() {
  const { role, logout } = useAuth()
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const router = useRouterState()

  return (
    <div className="flex h-screen bg-surface-base text-text-primary overflow-hidden font-sans">
      <Sidebar role={role} logout={logout} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopNav
          role={role}
          toggleSidebar={() => setSidebarOpen(s => !s)}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={<GlobalLoader />}>
            <div key={router.location.pathname} className="page-enter">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-surface-base/80 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

const ALL_NAV = [
  {
    label: 'Admin & CEO', icon: LayoutDashboard, to: '/ceo',
    roles: ['CEO', 'Admin'],
    subItems: [
      { label: 'Overview', to: '/ceo/overview' },
      { label: 'Reports',  to: '/ceo/reports'  },
    ],
  },
  {
    label: 'Security', icon: Shield, to: '/security',
    roles: ['CEO', 'Admin', 'Security'],
    subItems: [
      { label: 'Gate Log',          to: '/security/gate-log'          },
      { label: 'Visitor Log',       to: '/security/visitor-log'       },
      { label: 'Motorcycle Log',    to: '/security/motorcycle-log'    },
      { label: 'Staff Logs',        to: '/security/staff-movement'    },
      { label: 'Staff Attendance',  to: '/security/staff-attendance'  },
      { label: 'Attendance Scanner',to: '/security/attendance-scanner'},
      { label: 'Dispatch',          to: '/security/dispatch'          },
      { label: 'Purchases',         to: '/security/item-bought'       },
      { label: 'Labourer Log',      to: '/security/labourers-log'     },
      { label: 'Power Tokens',      to: '/security/light-token'       },
      { label: 'Materials Handoff', to: '/security/materials-handoff' },
      { label: 'Suppliers',         to: '/security/suppliers'         },
    ],
  },
  {
    label: 'Warehouse', icon: Warehouse, to: '/warehouse',
    roles: ['CEO', 'Admin', 'Warehouse'],
    subItems: [
      { label: 'Stock Overview',      to: '/warehouse/stock-overview' },
      { label: 'Production',          to: '/warehouse/production'     },
      { label: 'GRNs',                to: '/warehouse/grn'            },
      { label: 'Bin Card',            to: '/warehouse/bin-card'       },
      { label: 'Alerts',              to: '/warehouse/alerts'         },
    ],
  },
  {
    label: 'Logistics', icon: Truck, to: '/logistics',
    roles: ['CEO', 'Admin', 'Logistics'],
    subItems: [
      { label: 'Fleet Registry',  to: '/logistics/fleet'       },
      { label: 'Trips Board',     to: '/logistics/trips'       },
      { label: 'Maintenance Log', to: '/logistics/maintenance' },
      { label: 'Driver Registry', to: '/logistics/drivers'     },
      { label: 'Waybills',        to: '/logistics/waybills'    },
    ],
  },
  {
    label: 'Finance', icon: DollarSign, to: '/finance',
    roles: ['CEO', 'Admin', 'Finance'],
    subItems: [
      { label: 'Overview',           to: '/finance/overview'           },
      { label: 'Sales & Revenue',    to: '/finance/sales'              },
      { label: 'Invoices',           to: '/finance/invoices'           },
      { label: 'Expenses',           to: '/finance/expenses'           },
      { label: 'Payroll',            to: '/finance/payroll'            },
      { label: 'Supplier Payments',  to: '/finance/supplier-payments'  },
    ],
  },
  {
    label: 'Settings', icon: SettingsIcon, to: '/settings',
    roles: ['CEO', 'Admin', 'Security', 'Warehouse', 'Logistics', 'Finance'],
    subItems: [
      { label: 'My Profile',       to: '/settings/profile'                              },
      { label: 'Branches',         to: '/settings/branches',        roles: ['CEO', 'Super_Admin', 'Admin'] },
      { label: 'Staff',            to: '/settings/staff',           roles: ['CEO', 'Super_Admin', 'Admin'] },
      { label: 'User Management',  to: '/settings/user-management', roles: ['CEO', 'Super_Admin'] },
      { label: 'RBAC & Permissions', to: '/settings/rbac',          roles: ['CEO', 'Super_Admin'] },
      { label: 'Org Settings',     to: '/settings/org-settings',    roles: ['CEO', 'Super_Admin'] },
    ],
  },
] as const

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ role, logout, isOpen, setIsOpen }: { role: Role | null; logout: () => void; isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const { location } = useRouterState()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const initialExpanded = Object.fromEntries(
    ALL_NAV.map(item => [item.to, currentPath.startsWith(item.to)])
  )
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded)

  useEffect(() => {
    setExpanded(prev => {
      const matched = ALL_NAV.find(item => currentPath.startsWith(item.to))
      if (matched && !prev[matched.to]) {
        return { ...prev, [matched.to]: true }
      }
      return prev
    })
  }, [currentPath])

  const navItems = ALL_NAV.filter(item => item.roles.includes(role as any))

  const asideRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      asideRef.current?.focus()
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }

      if (e.key === 'Tab' && asideRef.current) {
        const focusable = asideRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen])

  return (
    <aside
      ref={asideRef}
      tabIndex={-1}
      className={clsx(
      'bg-primary-dark text-white',
      'border-r border-white/10 flex flex-col z-30 shadow-xl',
      'transition-transform duration-300',
      'fixed md:static inset-y-0 left-0 w-64',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    )}>
      {/* Logo row */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10 shrink-0 overflow-hidden">
        <div className="w-8 h-8 shrink-0 overflow-hidden rounded-sm flex items-center justify-center bg-white/10 p-1">
          <img src="/logo.png" alt="" aria-hidden="true" className="h-full w-auto object-contain brightness-0 invert" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-base font-bold text-white leading-tight tracking-tight">
            LORYB GROUP
          </span>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-none mt-0.5">
            Command Centre
          </span>
        </div>
        <button
          className="md:hidden ml-auto min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2 rounded-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 overflow-y-auto" aria-label="Main navigation">
        <ul className="flex flex-col px-3 gap-4">
          {navItems.map(item => {
            const Icon = item.icon
            const isNonAdmin = role !== 'CEO' && role !== 'Admin'
            const isExpanded = isNonAdmin ? true : expanded[item.to]

            // For department-specific roles, flatten the navigation group
            if (isNonAdmin) {
              return (
                <li key={item.to} className="flex flex-col gap-1 mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-white/40 mb-1">
                    <Icon size={14} strokeWidth={2.5} />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest">{item.label}</span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {item.subItems.map((sub: any) => {
                      if (sub.roles && !sub.roles.includes(role)) return null
                      const isActive = currentPath === sub.to
                      return (
                        <li key={sub.to} className="relative">
                          <Link
                            to={sub.to}
                            onClick={() => setIsOpen(false)}
                            className={clsx(
                              'relative flex min-h-[40px] w-full items-center px-3 py-2 rounded-md text-[14px] transition-colors',
                              isActive
                                ? 'bg-white/10 text-white font-bold shadow-sm'
                                : 'text-white/60 hover:bg-white/5 hover:text-white font-medium',
                            )}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3/5 w-1 bg-accent rounded-r-md" />
                            )}
                            <span className="block truncate tracking-wide">
                              {sub.label}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            }

            return (
              <li key={item.to} className="flex flex-col gap-1">
                {/* Section header button */}
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [item.to]: !prev[item.to] }))}
                  aria-expanded={isExpanded}
                  className={clsx(
                    'flex w-full min-h-[44px] items-center justify-between px-3 py-[10px] rounded-md',
                    'text-sm font-bold transition-colors group text-white/70 hover:bg-white/5 hover:text-white',
                    isExpanded && 'text-white'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className={clsx(
                        "transition-all group-hover:scale-105 group-hover:text-white",
                        isExpanded ? "text-accent opacity-100" : "text-white/60"
                      )}
                    />
                    <span className="tracking-wide uppercase text-xs">{item.label}</span>
                  </span>
                  {isExpanded
                    ? <ChevronDown size={14} className="opacity-50" />
                    : <ChevronRight size={14} className="opacity-50" />
                  }
                </button>

                {/* Sub-items */}
                {isExpanded && (
                  <ul className="flex flex-col gap-[2px] mt-1 relative pb-1">
                    {/* Vertical connecting line aligned with parent icon center */}
                    <div className="absolute left-[21px] top-0 bottom-4 w-px bg-white/10" />
                    
                    {item.subItems.map((sub: any) => {
                      if (sub.roles && !sub.roles.includes(role)) return null
                      const isActive = currentPath === sub.to
                      return (
                        <li key={sub.to} className="relative pl-[40px] pr-3">
                          {/* Horizontal connector tick */}
                          <div className={clsx(
                            "absolute left-[21px] top-1/2 -translate-y-1/2 w-3 h-px",
                            isActive ? "bg-accent" : "bg-white/10"
                          )} />
                          
                          <Link
                            to={sub.to}
                            onClick={() => setIsOpen(false)}
                            className={clsx(
                              'relative flex min-h-[36px] w-full items-center px-3 py-1.5 rounded-md text-[13px] transition-colors',
                              isActive
                                ? 'bg-white/10 text-white font-bold shadow-sm'
                                : 'text-white/60 hover:bg-white/5 hover:text-white font-medium',
                            )}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3/5 w-[3px] bg-accent rounded-r-md" />
                            )}
                            <span className="block truncate tracking-wide">
                              {sub.label}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer: user + logout */}
      <div className="px-4 py-4 border-t border-white/10 flex items-center justify-between shrink-0 bg-black/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-accent text-primary-dark flex items-center justify-center font-bold text-sm shadow-md">
              {role ? role.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="status-dot status-dot-success absolute -bottom-0.5 -right-0.5 border-2 border-[rgb(var(--color-primary-dark))] shadow-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-tight">{role}</span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Active Session</span>
          </div>
        </div>
        <button
          onClick={() => {
            logout()
            navigate({ to: '/login' as any })
          }}
          className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center p-2 rounded-md text-white/50 hover:text-white hover:bg-status-danger/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-sm"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────

function TopNav({
  role, toggleSidebar,
}: {
  role: Role | null
  toggleSidebar: () => void
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const persisted = localStorage.getItem('loryb_theme')
      if (persisted === 'dark' || persisted === 'light') return persisted
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('loryb_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <header className="h-16 bg-surface-raised border-b border-surface-border flex items-center px-4 md:px-6 justify-between shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2 rounded-sm text-text-secondary hover:text-primary hover:bg-surface-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        {/* Brand accent bar */}
        <span className="hidden md:block w-1 h-6 rounded-full bg-accent" />
        <span className="text-base font-semibold text-text-primary">Loryb Group</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2 rounded-sm text-text-secondary hover:text-primary hover:bg-surface-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary text-text-inverse flex items-center justify-center text-sm font-bold ring-2 ring-primary/20 select-none">
          {role ? role.charAt(0).toUpperCase() : ''}
        </div>
      </div>
    </header>
  )
}
