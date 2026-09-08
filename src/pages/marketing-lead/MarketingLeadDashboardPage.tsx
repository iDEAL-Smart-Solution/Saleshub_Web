import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, DollarSign, ShoppingCart, Users } from 'lucide-react'
import { Card, PageHeader } from '@/components/common'
import { ErrorState, LoadingState } from '@/components/feedback'
import SaleStatusBadge from '@/features/sales/components/SaleStatusBadge'
import { useSales } from '@/features/sales'
import { useMarketers } from '@/features/users'
import { useAuthStore } from '@/stores/authStore'
import { usePageTitle } from '@/hooks/usePageTitle'
import { ROUTES } from '@/constants/routes'
import { SaleStatus } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default function MarketingLeadDashboardPage() {
  usePageTitle('Marketing Lead Dashboard')

  const user     = useAuthStore((s) => s.user)
  const sales    = useSales()
  const marketers = useMarketers()

  const { fetchAllSales }  = sales
  const { fetchMarketers } = marketers

  useEffect(() => {
    void fetchAllSales()
    void fetchMarketers()
  }, [fetchAllSales, fetchMarketers])

  if (sales.isLoading && !sales.sales.length)
    return <LoadingState message="Loading dashboard…" />

  if (sales.error)
    return <ErrorState message={sales.error} onRetry={() => void fetchAllSales()} />

  const pending = sales.sales.filter((s) => s.status === SaleStatus.Pending).length

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.firstName ?? 'Marketing Lead'}`}
        subtitle="Organisation-wide sales and marketer overview"
      />

      {/* Quick-action metrics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Active marketers"
          value={String(marketers.marketers.length)}
          href={ROUTES.MARKETING_LEAD_MARKETERS}
        />
        <MetricCard
          icon={ShoppingCart}
          label="Total sales"
          value={String(sales.sales.length)}
          href={ROUTES.MARKETING_LEAD_SALES}
        />
        <MetricCard
          icon={ShoppingCart}
          label="Pending approval"
          value={String(pending)}
          href={ROUTES.MARKETING_LEAD_SALES}
        />
        <MetricCard
          icon={DollarSign}
          label="My commissions"
          value="View"
          href={ROUTES.MARKETING_LEAD_COMMISSIONS}
        />
      </div>

      {/* Quick actions — ML can record sales */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          to={ROUTES.MARKETING_LEAD_MARKETERS}
          className="inline-flex items-center gap-2 rounded-lg border border-[#BBDEFB] bg-[#E3F2FD] px-4 py-2 text-sm font-medium text-[#1565C0] hover:bg-[#BBDEFB] transition-colors"
        >
          <Users size={15} /> Add Marketer
        </Link>
        <Link
          to={ROUTES.MARKETING_LEAD_SALES}
          className="inline-flex items-center gap-2 rounded-lg border border-[#BBDEFB] bg-[#E3F2FD] px-4 py-2 text-sm font-medium text-[#1565C0] hover:bg-[#BBDEFB] transition-colors"
        >
          <ShoppingCart size={15} /> Record / Review Sales
        </Link>
        <Link
          to={ROUTES.MARKETING_LEAD_PERFORMANCE}
          className="inline-flex items-center gap-2 rounded-lg border border-[#BBDEFB] bg-[#E3F2FD] px-4 py-2 text-sm font-medium text-[#1565C0] hover:bg-[#BBDEFB] transition-colors"
        >
          <BarChart2 size={15} /> View Performance
        </Link>
        <Link
          to={ROUTES.MARKETING_LEAD_COMMISSIONS}
          className="inline-flex items-center gap-2 rounded-lg border border-[#BBDEFB] bg-[#E3F2FD] px-4 py-2 text-sm font-medium text-[#1565C0] hover:bg-[#BBDEFB] transition-colors"
        >
          <DollarSign size={15} /> View Commissions
        </Link>
      </div>

      {/* Recent sales (read-only for ML — no record action) */}
      <Card noPadding>
        <Card.Header
          className="p-5 pb-0"
          title="Recent sales"
          action={
            <Link className="text-sm text-[#1565C0]" to={ROUTES.MARKETING_LEAD_SALES}>
              View all
            </Link>
          }
        />
        {sales.sales.slice(0, 8).map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-3 border-t border-[#EEEEEE] px-5 py-3"
          >
            <div>
              <p className="font-medium">{s.customerName}</p>
              <p className="text-xs text-[#757575]">
                {s.marketerName} · {s.productName} · {formatDate(s.saleDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{formatCurrency(s.amount)}</p>
              <SaleStatusBadge status={s.status} />
            </div>
          </div>
        ))}
        {sales.sales.length === 0 && (
          <p className="p-5 text-sm text-[#757575]">No sales have been recorded yet.</p>
        )}
      </Card>
    </div>
  )
}

function MetricCard({
  icon: Icon, label, value, href,
}: {
  icon: typeof Users
  label: string
  value: string
  href: string
}) {
  return (
    <Link to={href}>
      <Card className="h-full hover:border-[#90CAF9]">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#E3F2FD] p-2 text-[#1565C0]">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-xs text-[#757575]">{label}</p>
            <p className="text-lg font-bold text-[#212121]">{value}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
