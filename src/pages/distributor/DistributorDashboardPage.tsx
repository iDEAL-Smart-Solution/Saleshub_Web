import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Plus, ShoppingCart, Users } from 'lucide-react'
import { Button, Card, PageHeader } from '@/components/common'
import { ErrorState, LoadingState } from '@/components/feedback'
import SaleStatusBadge from '@/features/sales/components/SaleStatusBadge'
import { useSales } from '@/features/sales'
import { useMarketers } from '@/features/users'
import { useAuthStore } from '@/stores/authStore'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useProducts } from '@/features/products'
import { useCustomers } from '@/features/customers'
import SaleFormModal from '@/features/sales/components/SaleFormModal'
import { ROUTES } from '@/constants/routes'
import { SaleStatus, type CreateSaleRequest } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default function DistributorDashboardPage() {
  usePageTitle('Distributor Dashboard')
  const user      = useAuthStore((s) => s.user)
  const sales     = useSales()
  const marketers = useMarketers()
  const products  = useProducts()
  const customers = useCustomers()
  const recordModal = useDisclosure()

  const { fetchDistributorSales } = sales
  const { fetchMarketers }        = marketers
  const { fetchActiveProducts }   = products
  const { fetchCustomers }        = customers

  useEffect(() => {
    void fetchDistributorSales()
    void fetchMarketers()
  }, [fetchDistributorSales, fetchMarketers])

  useEffect(() => {
    void fetchActiveProducts()
    void fetchCustomers()
  }, [fetchActiveProducts, fetchCustomers])

  const submit = async (data: CreateSaleRequest): Promise<boolean> => {
    const ok = await sales.createSale(data)
    if (ok) { recordModal.close(); void fetchDistributorSales() }
    return ok
  }

  if (sales.isLoading && !sales.distributorSales.length)
    return <LoadingState message="Loading your dashboard…" />

  if (sales.error)
    return (
      <ErrorState
        message={sales.error}
        onRetry={() => void fetchDistributorSales()}
      />
    )

  const pending   = sales.distributorSales.filter((s) => s.status === SaleStatus.Pending).length
  const confirmed = sales.distributorSales.filter((s) => s.status === SaleStatus.Confirmed).length

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.firstName ?? 'Distributor'}`}
        subtitle="Your team's sales activity and commissions"
        action={
          <Button leftIcon={<Plus size={16} />} onClick={recordModal.open}>
            Record sale
          </Button>
        }
      />

      {/* Metric cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Users}
          label="My marketers"
          value={String(marketers.marketers.length)}
          href={ROUTES.DISTRIBUTOR_MARKETERS}
        />
        <MetricCard
          icon={ShoppingCart}
          label="Total sales"
          value={String(sales.distributorSales.length)}
          href={ROUTES.DISTRIBUTOR_SALES}
        />
        <MetricCard
          icon={ShoppingCart}
          label="Pending approval"
          value={String(pending)}
          href={ROUTES.DISTRIBUTOR_SALES}
        />
        <MetricCard
          icon={DollarSign}
          label="Approved sales"
          value={String(confirmed)}
          href={ROUTES.DISTRIBUTOR_COMMISSIONS}
        />
      </div>

      {/* Recent sales */}
      <Card noPadding>
        <Card.Header
          className="p-5 pb-0"
          title="Recent team sales"
          action={
            <Link className="text-sm text-[#1565C0]" to={ROUTES.DISTRIBUTOR_SALES}>
              View all
            </Link>
          }
        />
        {sales.distributorSales.slice(0, 8).map((s) => (
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
        {sales.distributorSales.length === 0 && (
          <p className="p-5 text-sm text-[#757575]">
            No sales have been recorded for your team yet.
          </p>
        )}
      </Card>

      {/* Record sale modal */}
      <SaleFormModal
        isOpen={recordModal.isOpen}
        onClose={recordModal.close}
        marketers={marketers.marketers}
        customers={customers.customers}
        products={products.products}
        onSubmit={submit}
        isLoading={sales.isActionLoading}
        error={sales.error}
      />
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
