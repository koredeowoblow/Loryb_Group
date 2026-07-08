import { createFileRoute, Outlet, Link, useRouterState, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { LayoutDashboard, Shield, Warehouse, Truck, DollarSign, ChevronDown, ChevronRight, LogOut, Settings as SettingsIcon } from 'lucide-react'
import clsx from 'clsx'
import { useAuth, Role } from '../auth'

export const Route = createFileRoute('/_shell')({
  component: ShellLayout,
  beforeLoad: ({ context, location }) => {
    const role = context.auth.role
    const path = location.pathname

    if (role === 'CEO') return // CEO sees everything
    
    // Auth bypass (always allow)
    if (path === '/login' || path === '/forgot-password' || path === '/settings/profile' || path === '/notifications' || path === '/403') {
      return
    }

    if (role === 'Admin') {
      if (path.startsWith('/settings/user-management') || path.startsWith('/settings/org-settings') || path.startsWith('/settings/rbac')) {
        throw redirect({ to: '/403' })
      }
      return
    }

    if (role === 'Security' && !path.startsWith('/security')) throw redirect({ to: '/security' })
    if (role === 'Warehouse' && !path.startsWith('/warehouse')) throw redirect({ to: '/warehouse/stock-overview' })
    if (role === 'Logistics' && !path.startsWith('/logistics')) throw redirect({ to: '/logistics/fleet' })
    if (role === 'Finance' && !path.startsWith('/finance')) throw redirect({ to: '/finance/overview' })
  }
})

function ShellLayout() {
  const { role } = useAuth()
  
  return (
    <div className="flex h-screen bg-surface-muted text-text-primary overflow-hidden font-sans">
      <Sidebar role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav role={role} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function Sidebar({ role }: { role: Role }) {
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
    <aside className="w-64 bg-white text-text-primary border-r border-surface-border flex flex-col z-10 shadow-sm overflow-y-auto">
      <div className="h-20 flex flex-col justify-center px-6 border-b border-surface-border bg-white sticky top-0 z-20">
          <img src="/logo.png" alt="Loryb Group of Companies" className="h-10 w-auto" />
      </div>
      
      <div className="px-6 mt-4">
        <div className="orbit-divider opacity-50 my-2" />
      </div>

      <nav className="flex-1 py-2 flex flex-col gap-1 px-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isModuleActive = currentPath.startsWith(item.to)
          const isExpanded = expandedMenus[item.to]

          return (
            <div key={item.to} className="flex flex-col mb-1">
              <button
                onClick={() => toggleMenu(item.to)}
                className={clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-md transition-all text-sm font-medium w-full',
                  isModuleActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface-active hover:text-primary'
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
                <div className="ml-9 mt-1 flex flex-col gap-0.5 border-l-2 border-surface-border pl-2">
                  {item.subItems.map(subItem => {
                    // Filter sub-items by role if subItem has roles array
                    if (subItem.roles && !subItem.roles.includes(role)) return null;

                    const isSubActive = currentPath === subItem.to
                    return (
                      <Link
                        key={subItem.to}
                        to={subItem.to}
                        className={clsx(
                          'px-3 py-1.5 rounded-md transition-all text-xs font-medium',
                          isSubActive
                            ? 'bg-primary text-white shadow-sm font-bold'
                            : 'text-text-secondary hover:bg-surface-active hover:text-primary'
                        )}
                      >
                        {subItem.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
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
          className="p-1.5 text-text-secondary hover:text-status-error hover:bg-status-error/10 rounded-md transition-colors"
          title="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}

function TopNav({ role }: { role: Role }) {
  return (
    <header className="h-16 bg-white border-b border-surface-border flex items-center px-6 justify-between shrink-0 shadow-sm z-0">
      <div className="flex items-center gap-2">
        <span className="w-2 h-4 bg-accent rounded-sm" />
        <div className="text-sm font-semibold text-primary font-header">Greenville LNG Site Operations</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold font-header shadow-sm border border-primary-light">
          {role.charAt(0)}
        </div>
      </div>
    </header>
  )
}