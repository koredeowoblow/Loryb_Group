import { createFileRoute, Outlet, Link, useRouterState, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { LayoutDashboard, Shield, Warehouse, Truck, DollarSign, ChevronDown, ChevronRight, LogOut, Settings as SettingsIcon, Menu, X, Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import clsx from 'clsx'
import { useAuth, Role } from '../auth'
import { AUTH_BYPASS_PATHS, ADMIN_RESTRICTED_PATHS, getRoleRedirect } from '../lib/rbac'

export const Route = createFileRoute('/_shell')({
  component: ShellLayout,
  beforeLoad: ({ context, location }) => {
    const role = context.auth.role
    const path = location.pathname

    if (role === 'CEO') return // CEO sees everything
    
    if (AUTH_BYPASS_PATHS.includes(path)) {
      return
    }

    if (role === 'Admin') {
      if (ADMIN_RESTRICTED_PATHS.some(p => path.startsWith(p))) {
        throw redirect({ to: '/403' })
      }
      return
    }

    const rolePath = role.toLowerCase();
    if (['Security', 'Warehouse', 'Logistics', 'Finance'].includes(role) && !path.startsWith(`/${rolePath}`)) {
      throw redirect({ to: getRoleRedirect(role) })
    }
  }
})

function ShellLayout() {
  const { role } = useAuth()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])
  
  const router = useRouterState()
  const isLoading = router.status === 'pending' || router.isLoading

  return (
    <div className="flex h-screen bg-surface-muted text-text-primary overflow-hidden font-sans transition-colors duration-200">
      <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-surface-muted z-50">
            <div className="h-full bg-primary animate-pulse"></div>
          </div>
        )}
        <TopNav role={role} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
              setSidebarOpen(false)
            }
          }}
          aria-label="Close sidebar"
        />
      )}
    </div>
  )
}

function Sidebar({ role, isOpen, setIsOpen }: { role: Role, isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const router = useRouterState()
  const navigate = useNavigate()
  const currentPath = router.location.pathname
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    '/ceo': true,
    '/security': true,
    '/warehouse': true,
    '/logistics': true,
    '/finance': true,
    '/settings': false,
  })

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => ({ ...prev, [path]: !prev[path] }))
  }

  const allNavItems = [
    { 
      label: 'Admin & CEO', icon: LayoutDashboard, to: '/ceo', roles: ['CEO', 'Admin'],
      subItems: [
        { label: 'Overview', to: '/ceo/overview' },
        { label: 'Reports', to: '/ceo/reports' },
      ]
    },
    { 
      label: 'Security', icon: Shield, to: '/security', roles: ['CEO', 'Admin', 'Security'],
      subItems: [
        { label: 'Gate Log', to: '/security/gate-log' },
        { label: 'Visitor Log', to: '/security/visitor-log' },
        { label: 'Motorcycle Log', to: '/security/motorcycle-log' },
        { label: 'Staff Movement', to: '/security/staff-movement' },
        { label: 'Staff Attendance', to: '/security/staff-attendance' },
        { label: 'Dispatch', to: '/security/dispatch' },
        { label: 'Item Bought', to: '/security/item-bought' },
        { label: 'Labourers Log', to: '/security/labourers-log' },
        { label: 'Light Token', to: '/security/light-token' },
        { label: 'Materials Handoff', to: '/security/materials-handoff' },
        { label: 'Suppliers', to: '/security/suppliers' },
      ]
    },
    { 
      label: 'Warehouse', icon: Warehouse, to: '/warehouse', roles: ['CEO', 'Admin', 'Warehouse'],
      subItems: [
        { label: 'Stock Overview', to: '/warehouse/stock-overview' },
        { label: 'Goods Received Note', to: '/warehouse/grn' },
        { label: 'Bin Card', to: '/warehouse/bin-card' },
        { label: 'Alerts', to: '/warehouse/alerts' },
      ]
    },
    { 
      label: 'Logistics', icon: Truck, to: '/logistics', roles: ['CEO', 'Admin', 'Logistics'],
      subItems: [
        { label: 'Fleet Registry', to: '/logistics/fleet' },
        { label: 'Trips Board', to: '/logistics/trips' },
        { label: 'Maintenance Log', to: '/logistics/maintenance' },
        { label: 'Driver Registry', to: '/logistics/drivers' },
        { label: 'Waybills', to: '/logistics/waybills' },
      ]
    },
    { 
      label: 'Finance', icon: DollarSign, to: '/finance', roles: ['CEO', 'Admin', 'Finance'],
      subItems: [
        { label: 'Overview', to: '/finance/overview' },
        { label: 'Sales & Revenue', to: '/finance/sales' },
        { label: 'Invoices', to: '/finance/invoices' },
        { label: 'Expenses', to: '/finance/expenses' },
        { label: 'Payroll', to: '/finance/payroll' },
        { label: 'Supplier Payments', to: '/finance/supplier-payments' },
      ]
    },
    { 
      label: 'Settings', icon: SettingsIcon, to: '/settings', roles: ['CEO', 'Admin', 'Security', 'Warehouse', 'Logistics', 'Finance'],
      subItems: [
        { label: 'My Profile', to: '/settings/profile' },
        { label: 'User Management', to: '/settings/user-management', roles: ['CEO','Super_Admin'] },
        { label: 'RBAC & Permissions', to: '/settings/rbac', roles: ['CEO','Super_Admin'] },
        { label: 'Org Settings', to: '/settings/org-settings', roles: ['CEO','Super_Admin'] },
      ]
    },
  ]

  const navItems = allNavItems.filter(item => item.roles.includes(role))

  return (
    <aside className={clsx(
      "bg-surface text-text-primary border-r border-surface-border flex flex-col z-30 shadow-sm overflow-y-auto transition-transform duration-300 md:translate-x-0 fixed md:static inset-y-0 left-0 w-64",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-16 md:h-20 flex flex-row items-center justify-between px-6 border-b border-surface-border bg-surface sticky top-0 z-20 shrink-0">
          <img src="/logo.png" alt="Loryb Group of Companies" className="h-8 md:h-10 w-auto" />
          <button className="md:hidden p-3 text-text-secondary hover:text-primary" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
            <X size={20} />
          </button>
      </div>
      
      <div className="px-6 mt-2">
        <hr className="border-t border-surface-border my-2" />
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isModuleActive = currentPath.startsWith(item.to)
            const isExpanded = expandedMenus[item.to]

            return (
              <li key={item.to} className="flex flex-col mb-1">
              <button
                onClick={() => toggleMenu(item.to)}
                aria-expanded={isExpanded}
                className={clsx(
                  'flex items-center justify-between px-3 py-2.5 transition-all text-sm font-medium w-full border-l-2',
                  isModuleActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-transparent text-text-secondary hover:bg-surface-active hover:text-primary'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={clsx(isModuleActive ? "text-primary" : "opacity-70")} />
                  <span className="font-header tracking-wide">{item.label}</span>
                </div>
                <div className="opacity-50">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
              </button>
              
              {isExpanded && item.subItems && (
                <ul className="ml-9 mt-1 flex flex-col gap-0.5 border-l-2 border-surface-border pl-2">
                  {item.subItems.map(subItem => {
                    // Filter sub-items by role if subItem has roles array
                    if (subItem.roles && !subItem.roles.includes(role)) return null;

                    const isSubActive = currentPath === subItem.to
                    return (
                      <li key={subItem.to}>
                        <Link
                          to={subItem.to}
                          className={clsx(
                            'block px-3 py-1.5 transition-all text-xs font-medium',
                            isSubActive
                              ? 'bg-primary text-white font-bold hazard-tape shadow-none'
                              : 'text-text-secondary hover:bg-surface-active hover:text-primary'
                          )}
                        >
                          {subItem.label}
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
      <div className="p-4 border-t border-surface-border bg-surface-muted/50 text-xs text-text-muted flex justify-between items-center sticky bottom-0 z-20">
        <div className="flex flex-col">
          <span className="flex items-center gap-1.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span>Logged in as <strong>{role}</strong></span>
          </span>
        </div>
        <button 
          onClick={() => navigate({ to: '/login' as any })}
          className="p-3 text-text-secondary hover:text-status-error hover:bg-status-error/10 rounded-md transition-colors"
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}

function TopNav({ role, toggleSidebar, isDarkMode, toggleDarkMode }: { role: Role, toggleSidebar: () => void, isDarkMode: boolean, toggleDarkMode: () => void }) {
  return (
    <header className="h-16 bg-surface border-b border-surface-border flex items-center px-4 md:px-6 justify-between shrink-0 shadow-sm z-10 transition-colors duration-200">
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-3 md:hidden text-text-secondary hover:text-primary transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="hidden md:block w-2 h-4 bg-accent rounded-sm" />
        <div className="text-sm font-semibold text-primary font-header truncate">Loryb Group of Companies</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-text-secondary hover:bg-surface-active hover:text-primary transition-colors"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold font-header shadow-sm border border-primary-light text-sm">
          {role.charAt(0)}
        </div>
      </div>
    </header>
  )
}
