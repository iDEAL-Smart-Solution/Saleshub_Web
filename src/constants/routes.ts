/**
 * Centralized route path constants.
 */
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Shared dashboard root
  DASHBOARD: '/dashboard',

  // Dev
  DEV: '/dev',
  DEV_DASHBOARD: '/dev/dashboard',
  DEV_USERS: '/dev/users',
  DEV_PRODUCTS: '/dev/products',
  DEV_SETTINGS: '/dev/settings',

  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_SALES: '/admin/sales',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_KPI: '/admin/kpi',
  ADMIN_COMMISSIONS: '/admin/commissions',

  // Marketing Lead
  MARKETING_LEAD: '/marketing-lead',
  MARKETING_LEAD_DASHBOARD: '/marketing-lead/dashboard',
  MARKETING_LEAD_SALES: '/marketing-lead/sales',
  MARKETING_LEAD_CUSTOMERS: '/marketing-lead/customers',
  MARKETING_LEAD_PERFORMANCE: '/marketing-lead/performance',
  MARKETING_LEAD_COMMISSIONS: '/marketing-lead/commissions',
  MARKETING_LEAD_MARKETERS: '/marketing-lead/marketers',

  // Distributor
  DISTRIBUTOR: '/distributor',
  DISTRIBUTOR_DASHBOARD: '/distributor/dashboard',
  DISTRIBUTOR_MARKETERS: '/distributor/marketers',
  DISTRIBUTOR_SALES: '/distributor/sales',
  DISTRIBUTOR_COMMISSIONS: '/distributor/commissions',

  // Marketer
  MARKETER: '/marketer',
  MARKETER_DASHBOARD: '/marketer/dashboard',
  MARKETER_SALES: '/marketer/sales',
  MARKETER_KPI: '/marketer/kpi',
  MARKETER_PERFORMANCE: '/marketer/performance',
  MARKETER_COMMISSIONS: '/marketer/commissions',
  MARKETER_NOTIFICATIONS: '/marketer/notifications',

  // Fallback
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
  UNAUTHORIZED: '/401',
} as const
