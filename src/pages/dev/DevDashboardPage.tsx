import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'

/** Dev has access to the same system-wide data exposed to Admin. */
export default function DevDashboardPage() {
  return <AdminDashboardPage />
}
