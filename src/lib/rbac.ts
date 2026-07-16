export const ROLE_REDIRECTS: Record<string, string> = {
  'CEO': '/ceo/overview',
  'Admin': '/ceo/overview',
  'Security': '/security/gate-log',
  'Warehouse': '/warehouse/stock-overview',
  'Logistics': '/logistics/fleet',
  'Finance': '/finance/overview',
};

export const AUTH_BYPASS_PATHS = [
  '/login',
  '/forgot-password',
  '/settings/profile',
  '/notifications',
  '/403'
];

export const ADMIN_RESTRICTED_PATHS = [
  '/settings/user-management',
  '/settings/org-settings',
  '/settings/rbac'
];

export function getRoleRedirect(role: string): string {
  return ROLE_REDIRECTS[role] || '/ceo/overview';
}
