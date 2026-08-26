import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, ShoppingCart, Target, Users } from 'lucide-react'
import { Card, PageHeader } from '@/components/common'
import { ErrorState, LoadingState } from '@/components/feedback'
import SaleStatusBadge from '@/features/sales/components/SaleStatusBadge'
import { useUsers } from '@/features/users'
import { useSales } from '@/features/sales'
import { useKpi } from '@/features/kpi'
import { useCommissions } from '@/features/commissions'
import { useAuthStore } from '@/stores/authStore'
import { usePageTitle } from '@/hooks/usePageTitle'
import { SaleStatus } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default function AdminDashboardPage() {
  usePageTitle('Admin Dashboard')
  const user = useAuthStore(s => s.user); const users = useUsers(); const sales = useSales(); const kpi = useKpi(); const commissions = useCommissions()
  const { fetchAllUsers, fetchPendingMarketers } = users; const { fetchAllSales } = sales; const { fetchAllPeriods } = kpi; const { fetchAll } = commissions
  useEffect(() => { void fetchAllUsers(); void fetchPendingMarketers(); void fetchAllSales(); void fetchAllPeriods(); void fetchAll() }, [fetchAllUsers, fetchPendingMarketers, fetchAllSales, fetchAllPeriods, fetchAll])
  if (users.isLoading && sales.isLoading) return <LoadingState message="Loading system overview…" />
  const error = users.error ?? sales.error ?? kpi.error ?? commissions.error
  if (error) return <ErrorState message={error} onRetry={() => { void users.fetchAllUsers(); void sales.fetchAllSales() }} />
  const pending = sales.sales.filter(s => s.status === SaleStatus.Pending)
  const activeMarketers = users.users.filter(u => u.isActive && u.roles.includes('Marketer')).length
  const latestKpi = kpi.periods[0]
  return <div><PageHeader title={`Welcome, ${user?.firstName ?? 'Admin'}`} subtitle="System overview and management" />
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={Users} label="Active marketers" value={String(activeMarketers)} href="/admin/users"/><Metric icon={ShoppingCart} label="Pending sales" value={String(pending.length)} href="/admin/sales"/><Metric icon={Target} label="Current KPI" value={latestKpi ? `${latestKpi.targetSales} sales` : '—'} href="/admin/kpi"/><Metric icon={DollarSign} label="Commission records" value={String(commissions.commissions.length)} href="/admin/commissions"/></div>
    <div className="grid gap-4 lg:grid-cols-2"><Card noPadding><Card.Header className="p-5 pb-0" title="Pending marketer approvals" action={<Link className="text-sm text-[#1565C0]" to="/admin/users">Manage</Link>}/>{users.pendingMarketers.slice(0,5).map(u => <div className="border-t border-[#EEEEEE] px-5 py-3" key={u.id}><p className="font-medium">{u.firstName} {u.lastName}</p><p className="text-xs text-[#757575]">{u.email}</p></div>)}{users.pendingMarketers.length === 0 && <p className="p-5 text-sm text-[#757575]">No marketer approvals are pending.</p>}</Card><Card noPadding><Card.Header className="p-5 pb-0" title="Sales awaiting confirmation" action={<Link className="text-sm text-[#1565C0]" to="/admin/sales">View sales</Link>}/>{pending.slice(0,5).map(s => <div className="flex justify-between gap-3 border-t border-[#EEEEEE] px-5 py-3" key={s.id}><div><p className="font-medium">{s.customerName}</p><p className="text-xs text-[#757575]">{s.marketerName} · {formatDate(s.saleDate)}</p></div><div className="text-right"><p className="text-sm">{formatCurrency(s.amount)}</p><SaleStatusBadge status={s.status}/></div></div>)}{pending.length === 0 && <p className="p-5 text-sm text-[#757575]">No sales require confirmation.</p>}</Card></div></div>
}
function Metric({ icon: Icon, label, value, href }: { icon: typeof Users; label: string; value: string; href: string }) { return <Link to={href}><Card className="h-full hover:border-[#90CAF9]"><div className="flex items-center gap-3"><span className="rounded-lg bg-[#E3F2FD] p-2 text-[#1565C0]"><Icon size={18}/></span><div><p className="text-xs text-[#757575]">{label}</p><p className="text-lg font-bold">{value}</p></div></div></Card></Link> }
