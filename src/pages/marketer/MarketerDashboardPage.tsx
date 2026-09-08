import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, DollarSign, ShoppingCart, Target } from 'lucide-react'
import { Card, PageHeader } from '@/components/common'
import { ErrorState, LoadingState } from '@/components/feedback'
import KpiProgress from '@/features/kpi/components/KpiProgress'
import SaleStatusBadge from '@/features/sales/components/SaleStatusBadge'
import { useMyPerformance } from '@/features/performance'
import { useSales } from '@/features/sales'
import { useCommissions } from '@/features/commissions'
import { useNotifications } from '@/features/notifications'
import { useAuthStore } from '@/stores/authStore'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default function MarketerDashboardPage() {
  usePageTitle('My Dashboard')
  const user = useAuthStore(s => s.user)
  const performance = useMyPerformance()
  const sales = useSales()
  const commissions = useCommissions()
  const notifications = useNotifications()
  const { fetchPerformance } = performance; const { fetchMySales } = sales; const { fetchMine } = commissions; const { fetchUnreadCount } = notifications
  useEffect(() => { void fetchPerformance(); void fetchMySales(); void fetchMine(); void fetchUnreadCount() }, [fetchPerformance, fetchMySales, fetchMine, fetchUnreadCount])
  if (performance.isLoading && !performance.performance) return <LoadingState message="Loading your dashboard…" />
  if (performance.error) return <ErrorState message={performance.error} onRetry={() => void performance.fetchPerformance()} />
  const p = performance.performance
  return <div><PageHeader title={`Welcome, ${user?.firstName ?? 'Marketer'}`} subtitle="Your sales, KPI and commission overview" />
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={ShoppingCart} label="My sales" value={p ? String(p.newSales) : '—'} href="/marketer/sales" />
      <Metric icon={Target} label="KPI status" value={p ? (p.isKpiMet ? 'Achieved' : `${p.totalKpiProgress}/${p.kpiTarget}`) : '—'} href="/marketer/performance" />
      <Metric icon={DollarSign} label="Total commission" value={p ? formatCurrency(p.totalCommission) : '—'} href="/marketer/commissions" />
      <Metric icon={Bell} label="Unread notices" value={String(notifications.unreadCount)} href="/notifications" />
    </div>
    {p && <Card className="mb-4"><Card.Header title="Current KPI" subtitle={`${p.carriedSales} carried forward · ${p.bonusSalesCount} bonus sales`} /><KpiProgress value={p.performancePercentage} /><div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><p><span className="text-[#757575]">KPI reward</span><br/><strong>{formatCurrency(p.kpiReward)}</strong></p><p><span className="text-[#757575]">Bonus commission</span><br/><strong>{formatCurrency(p.bonusCommission)}</strong></p><p><span className="text-[#757575]">Total commission</span><br/><strong>{formatCurrency(p.totalCommission)}</strong></p></div></Card>}
    <Card noPadding><Card.Header className="p-5 pb-0" title="Recent sales" action={<Link to="/marketer/sales" className="text-sm text-[#1565C0]">View all</Link>} />{sales.mySales.slice(0, 5).map(s => <div key={s.id} className="flex items-center justify-between gap-3 border-t border-[#EEEEEE] px-5 py-3"><div><p className="font-medium text-[#212121]">{s.customerName}</p><p className="text-xs text-[#757575]">{s.productName} · {formatDate(s.saleDate)}</p></div><div className="text-right"><p className="text-sm font-medium">{formatCurrency(s.amount)}</p><SaleStatusBadge status={s.status}/></div></div>)}{sales.mySales.length === 0 && <p className="p-5 text-sm text-[#757575]">No sales have been recorded for you yet.</p>}</Card>
  </div>
}

function Metric({ icon: Icon, label, value, href }: { icon: typeof ShoppingCart; label: string; value: string; href: string }) { return <Link to={href}><Card className="h-full hover:border-[#90CAF9]"><div className="flex items-center gap-3"><span className="rounded-lg bg-[#E3F2FD] p-2 text-[#1565C0]"><Icon size={18}/></span><div><p className="text-xs text-[#757575]">{label}</p><p className="text-lg font-bold text-[#212121]">{value}</p></div></div></Card></Link> }
