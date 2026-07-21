import { createFileRoute, Outlet, Link, useRouterState, redirect, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import {
  LayoutDashboard, Shield, Warehouse, Truck, DollarSign,
  ChevronDown, ChevronRight, LogOut, Settings as SettingsIcon,
  Menu, X, Sun, Moon,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth, Role } from '../auth'
import { AUTH_BYPASS_PATHS, ADMIN_RESTRICTED_PATHS, getRoleRedirect } from '../lib/rbac'

export const Route = createFileRoute('/_shell')({
  component: ShellLayout,
  beforeLoad: ({ context, location }) => {
    const role = context.auth.role
    const path = location.pathname
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
  const { role } = useAuth()
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const router = useRouterState()
  const isLoading = router.status === 'pending' || router.isLoading

  return (
    <div className="flex h-screen bg-surface-base text-text-primary overflow-hidden font-sans">
      <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Page-load progress bar */}
        {isLoading && (
          <div className="progress-bar-track">
            <div className="progress-bar-fill" />
          </div>
        )}

        <TopNav
          role={role}
          toggleSidebar={() => setSidebarOpen(s => !s)}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div key={router.location.pathname} className="page-enter">
            <Outlet />
          </div>
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
      { label: 'Staff Movement',    to: '/security/staff-movement'    },
      { label: 'Staff Attendance',  to: '/security/staff-attendance'  },
      { label: 'Attendance Scanner',to: '/security/attendance-scanner'},
      { label: 'Dispatch',          to: '/security/dispatch'          },
      { label: 'Item Bought',       to: '/security/item-bought'       },
      { label: 'Labourers Log',     to: '/security/labourers-log'     },
      { label: 'Light Token',       to: '/security/light-token'       },
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
      { label: 'Goods Received Note', to: '/warehouse/grn'           },
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

function Sidebar({ role, isOpen, setIsOpen }: { role: Role; isOpen: boolean; setIsOpen: (v: boolean) => void }) {
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
      'bg-surface-raised border-r border-surface-border flex flex-col z-30',
      'overflow-y-auto transition-transform duration-300',
      'fixed md:static inset-y-0 left-0 w-64',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    )}>
      {/* Logo row */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-surface-border shrink-0 overflow-hidden">
        <div className="w-8 h-8 shrink-0 overflow-hidden rounded-sm flex items-center justify-center">
          <img src="/logo.png" alt="" aria-hidden="true" className="h-8 w-auto object-cover object-left" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-base font-bold text-text-primary leading-tight tracking-tight">
            LORYB GROUP
          </span>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider leading-none">
            Of Companies
          </span>
        </div>
        <button
          className="md:hidden ml-auto min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2 rounded-sm text-text-secondary hover:text-primary hover:bg-surface-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Main navigation">
        <ul className="flex flex-col px-3 gap-6">
          {navItems.map(item => {
            const Icon = item.icon
            const isExpanded = expanded[item.to]

            return (
              <li key={item.to} className="flex flex-col gap-1">
                {/* Section header button */}
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [item.to]: !prev[item.to] }))}
                  aria-expanded={isExpanded}
                  className={clsx(
                    'flex w-full min-h-[44px] items-center justify-between px-3 py-[10px] rounded-sm',
                    'text-base font-bold transition-colors group text-text-secondary hover:bg-surface-active hover:text-text-primary',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className="opacity-60 transition-transform group-hover:scale-105 group-hover:opacity-100"
                    />
                    {item.label}
                  </span>
                  {isExpanded
                    ? <ChevronDown size={14} className="opacity-40" />
                    : <ChevronRight size={14} className="opacity-40" />
                  }
                </button>

                {/* Sub-items */}
                {isExpanded && (
                  <ul className="flex flex-col gap-0.5">
                    {item.subItems.map((sub: any) => {
                      if (sub.roles && !sub.roles.includes(role)) return null
                      const isActive = currentPath === sub.to
                      return (
                        <li key={sub.to} className="relative">
                          <Link
                            to={sub.to}
                            onClick={() => setIsOpen(false)}
                            className={clsx(
                              'relative flex min-h-[44px] w-full items-center py-[10px] rounded-sm text-base transition-colors',
                              isActive
                                ? 'bg-surface-active text-text-primary font-semibold'
                                : 'text-text-secondary hover:bg-surface-active hover:text-text-primary',
                            )}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-sm" />
                            )}
                            <span className="block pl-[42px] pr-3">
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
      <div className="px-3 py-3 border-t border-surface-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="status-dot status-dot-success" />
          <span className="text-sm font-medium text-text-secondary">{role}</span>
        </div>
        <button
          onClick={() => navigate({ to: '/login' as any })}
          className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2 rounded-sm text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-danger/50"
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
  role: Role
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
          {role.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
