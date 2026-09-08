import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROLES } from '@/constants/roles'

import RootLayout      from './RootLayout'
import AuthLayout      from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

import { ProtectedRoute, RoleRoute, GuestRoute } from '@/features/auth'

// Auth pages
import LoginPage           from '@/pages/auth/LoginPage'
import RegisterPage        from '@/pages/auth/RegisterPage'
import PendingApprovalPage from '@/pages/auth/PendingApprovalPage'
import ChangePasswordPage  from '@/pages/auth/ChangePasswordPage'

// Shared
import ProfilePage    from '@/pages/ProfilePage'
import DashboardPage  from '@/pages/DashboardPage'

// Dev
import DevDashboardPage from '@/pages/dev/DevDashboardPage'
import DevAdminsPage    from '@/pages/dev/DevAdminsPage'

// Admin
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import UsersPage          from '@/pages/admin/UsersPage'
import ProductsPage       from '@/pages/ProductsPage'
import CustomersPage      from '@/pages/CustomersPage'
import SalesPage          from '@/pages/SalesPage'
import NotificationsPage  from '@/pages/NotificationsPage'
import KpiPage            from '@/pages/KpiPage'
import PerformancePage    from '@/pages/PerformancePage'
import CommissionsPage    from '@/pages/CommissionsPage'

// Marketing Lead
import MarketingLeadDashboardPage    from '@/pages/marketing-lead/MarketingLeadDashboardPage'
import MarketingLeadPerformancePage  from '@/pages/marketing-lead/MarketingLeadPerformancePage'
import MarketingLeadCommissionsPage  from '@/pages/marketing-lead/MarketingLeadCommissionsPage'
import MarketingLeadMarketersPage    from '@/pages/marketing-lead/MarketingLeadMarketersPage'

// Distributor
import DistributorDashboardPage  from '@/pages/distributor/DistributorDashboardPage'
import DistributorMarketersPage  from '@/pages/distributor/DistributorMarketersPage'
import DistributorCommissionsPage from '@/pages/distributor/DistributorCommissionsPage'

// Marketer
import MarketerDashboardPage from '@/pages/marketer/MarketerDashboardPage'

// Errors
import NotFoundPage     from '@/pages/errors/NotFoundPage'
import ForbiddenPage    from '@/pages/errors/ForbiddenPage'
import UnauthorizedPage from '@/pages/errors/UnauthorizedPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // ── Public auth routes ────────────────────────────────────────────────
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: '/login',    element: <LoginPage /> },
              { path: '/register', element: <RegisterPage /> },
            ],
          },
        ],
      },

      // ── Pending approval — no dashboard layout ────────────────────────────
      {
        element: <AuthLayout />,
        children: [
          { path: '/pending-approval', element: <PendingApprovalPage /> },
        ],
      },

      // ── Protected routes ──────────────────────────────────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [

              { path: '/dashboard', element: <DashboardPage /> },
              { path: '/profile',                 element: <ProfilePage /> },
              { path: '/profile/change-password', element: <ChangePasswordPage /> },
              { path: '/notifications',           element: <NotificationsPage /> },

              // ── Dev ──────────────────────────────────────────────────────
              {
                element: <RoleRoute allowedRoles={[ROLES.DEV]} />,
                children: [
                  { path: '/dev',           element: <Navigate to="/dev/dashboard" replace /> },
                  { path: '/dev/dashboard', element: <DevDashboardPage /> },
                  { path: '/dev/admins',    element: <DevAdminsPage /> },
                  { path: '/dev/settings',  element: <DevDashboardPage /> },
                ],
              },

              // ── Admin (Dev included) ──────────────────────────────────────
              {
                element: <RoleRoute allowedRoles={[ROLES.DEV, ROLES.ADMIN]} />,
                children: [
                  { path: '/admin',             element: <Navigate to="/admin/dashboard" replace /> },
                  { path: '/admin/dashboard',   element: <AdminDashboardPage /> },
                  { path: '/admin/users',       element: <UsersPage /> },
                  { path: '/admin/products',    element: <ProductsPage /> },
                  { path: '/admin/customers',   element: <CustomersPage /> },
                  { path: '/admin/sales',       element: <SalesPage scope="all" canRecord /> },
                  { path: '/admin/kpi',         element: <KpiPage /> },
                  { path: '/admin/commissions', element: <CommissionsPage /> },
                ],
              },

              // ── Marketing Lead (Dev/Admin can also access) ────────────────
              {
                element: <RoleRoute allowedRoles={[ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD]} />,
                children: [
                  { path: '/marketing-lead',             element: <Navigate to="/marketing-lead/dashboard" replace /> },
                  { path: '/marketing-lead/dashboard',   element: <MarketingLeadDashboardPage /> },
                  { path: '/marketing-lead/marketers',   element: <MarketingLeadMarketersPage /> },
                  // ML can record sales (canRecord=true) AND approve sales
                  { path: '/marketing-lead/sales',       element: <SalesPage scope="all" canRecord /> },
                  { path: '/marketing-lead/customers',   element: <CustomersPage /> },
                  { path: '/marketing-lead/performance', element: <MarketingLeadPerformancePage /> },
                  { path: '/marketing-lead/commissions', element: <MarketingLeadCommissionsPage /> },
                ],
              },

              // ── Distributor (ONLY Distributor — not inherited) ────────────
              {
                element: <RoleRoute allowedRoles={[ROLES.DISTRIBUTOR]} />,
                children: [
                  { path: '/distributor',             element: <Navigate to="/distributor/dashboard" replace /> },
                  { path: '/distributor/dashboard',   element: <DistributorDashboardPage /> },
                  { path: '/distributor/marketers',   element: <DistributorMarketersPage /> },
                  // Distributor sees only their team's sales and can record
                  { path: '/distributor/sales',       element: <SalesPage scope="distributor" canRecord /> },
                  { path: '/distributor/commissions', element: <DistributorCommissionsPage /> },
                ],
              },

              // ── Marketer ──────────────────────────────────────────────────
              {
                element: <RoleRoute allowedRoles={[ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD, ROLES.MARKETER]} />,
                children: [
                  { path: '/marketer',               element: <Navigate to="/marketer/dashboard" replace /> },
                  { path: '/marketer/dashboard',     element: <MarketerDashboardPage /> },
                  // Marketer can ONLY VIEW their own sales — canRecord=false
                  { path: '/marketer/sales',         element: <SalesPage scope="mine" canRecord={false} /> },
                  { path: '/marketer/kpi',           element: <PerformancePage /> },
                  { path: '/marketer/performance',   element: <PerformancePage /> },
                  { path: '/marketer/commissions',   element: <CommissionsPage mine /> },
                  { path: '/marketer/notifications', element: <Navigate to="/notifications" replace /> },
                ],
              },

            ],
          },
        ],
      },

      // ── Error pages ───────────────────────────────────────────────────────
      { path: '/401', element: <UnauthorizedPage /> },
      { path: '/403', element: <ForbiddenPage /> },
      { path: '/404', element: <NotFoundPage /> },

      { path: '/',  element: <Navigate to="/login" replace /> },
      { path: '*',  element: <NotFoundPage /> },
    ],
  },
])
