import { useEffect, useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button, Card, Input, PageHeader } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { ErrorState } from '@/components/feedback'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useSales } from '@/features/sales'
import { useProducts } from '@/features/products'
import { useCustomers } from '@/features/customers'
import { useMarketers } from '@/features/users'
import SaleStatusBadge from '@/features/sales/components/SaleStatusBadge'
import SaleFormModal from '@/features/sales/components/SaleFormModal'
import RejectSaleModal from '@/features/sales/components/RejectSaleModal'
import { useAuthStore } from '@/stores/authStore'
import { ROLES } from '@/constants/roles'
import {
  SaleStatus,
  type CreateSaleRequest,
  type RejectSaleRequest,
  type SaleSummaryResponse,
} from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'

/**
 * scope:
 *   'all'         — Admin/Dev/MarketingLead: all sales
 *   'mine'        — Marketer: own sales (view only)
 *   'distributor' — Distributor: assigned marketers' sales
 *
 * canRecord:
 *   true  — Admin, Dev, MarketingLead, Distributor (must select marketer)
 *   false — Marketer (view only)
 */
interface Props {
  scope: 'all' | 'mine' | 'distributor'
  canRecord?: boolean
}

export default function SalesPage({ scope, canRecord = false }: Props) {
  const title = scope === 'mine' ? 'My Sales'
    : scope === 'distributor' ? 'Team Sales'
    : 'Sales'
  usePageTitle(title)

  const salesApi     = useSales()
  const products     = useProducts()
  const customers    = useCustomers()
  const marketerList = useMarketers()

  const recordModal = useDisclosure()
  const rejectModal = useDisclosure()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const role = useAuthStore((s) => s.user?.roles[0])

  // Approve = Admin, Dev, MarketingLead
  const canApprove =
    role === ROLES.DEV || role === ROLES.ADMIN || role === ROLES.MARKETING_LEAD

  const { fetchMySales, fetchAllSales, fetchDistributorSales } = salesApi
  const { fetchActiveProducts } = products
  const { fetchCustomers }      = customers

  useEffect(() => {
    if (scope === 'mine')        void fetchMySales()
    else if (scope === 'distributor') void fetchDistributorSales()
    else                         void fetchAllSales()
  }, [scope, fetchAllSales, fetchMySales, fetchDistributorSales])

  useEffect(() => {
    if (!canRecord) return
    void fetchActiveProducts()
    void fetchCustomers()
    // All recorders need the marketer list to pick who the sale is for
    void marketerList.fetchMarketers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRecord])

  const displaySales =
    scope === 'mine'        ? salesApi.mySales
    : scope === 'distributor' ? salesApi.distributorSales
    : salesApi.sales

  const shown = useMemo(
    () =>
      displaySales.filter((s) =>
        `${s.marketerName} ${s.customerName} ${s.productName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [displaySales, search],
  )

  const openReject = (id: string) => { setRejectingId(id); rejectModal.open() }

  const handleReject = async (data: RejectSaleRequest): Promise<boolean> => {
    if (!rejectingId) return false
    const ok = await salesApi.rejectSale(rejectingId, data)
    if (ok) {
      setRejectingId(null)
      void (scope === 'distributor' ? fetchDistributorSales() : fetchAllSales())
    }
    return ok
  }

  const submit = async (data: CreateSaleRequest): Promise<boolean> => {
    const ok = await salesApi.createSale(data)
    if (ok) {
      recordModal.close()
      if (scope === 'distributor') void fetchDistributorSales()
      else                         void fetchAllSales()
    }
    return ok
  }

  const subtitle =
    canApprove  ? 'Review and approve recorded sales'
    : canRecord ? 'Record and view sales'
    : 'View recorded sales'

  const columns: Column<SaleSummaryResponse>[] = [
    ...(scope !== 'mine'
      ? ([{ key: 'marketerName', header: 'Marketer' }] as Column<SaleSummaryResponse>[])
      : []),
    { key: 'customerName', header: 'Customer' },
    { key: 'productName',  header: 'Product' },
    { key: 'saleDate', header: 'Date', render: (s) => formatDate(s.saleDate) },
    {
      key: 'amount', header: 'Amount',
      render: (s) => <span className="font-medium">{formatCurrency(s.amount)}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (s) => <SaleStatusBadge status={s.status} />,
    },
    ...(canApprove && scope !== 'mine'
      ? ([{
          key: 'actions', header: '', className: 'text-right',
          render: (s: SaleSummaryResponse) => (
            <div className="flex justify-end gap-1">
              {s.status === SaleStatus.Pending && (
                <>
                  <Button size="sm" isLoading={salesApi.isActionLoading}
                    onClick={() => void salesApi.confirmSale(s.id).then(() =>
                      void (scope === 'distributor' ? fetchDistributorSales() : fetchAllSales()))}>
                    Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => openReject(s.id)}>
                    Reject
                  </Button>
                </>
              )}
              {s.status === SaleStatus.Confirmed && (role === ROLES.DEV || role === ROLES.ADMIN) && (
                <Button size="sm" variant="outline" isLoading={salesApi.isActionLoading}
                  onClick={() => void salesApi.refundSale(s.id)}>
                  Refund
                </Button>
              )}
            </div>
          ),
        }] as Column<SaleSummaryResponse>[])
      : []),
  ]

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          canRecord ? (
            <Button leftIcon={<Plus size={16} />} onClick={recordModal.open}>
              Record sale
            </Button>
          ) : undefined
        }
      />

      {salesApi.error && !recordModal.isOpen && !rejectModal.isOpen ? (
        <ErrorState
          message={salesApi.error}
          onRetry={() =>
            void (scope === 'mine' ? salesApi.fetchMySales()
              : scope === 'distributor' ? salesApi.fetchDistributorSales()
              : salesApi.fetchAllSales())
          }
        />
      ) : (
        <Card noPadding>
          <div className="border-b border-[#EEEEEE] p-4">
            <Input
              aria-label="Search sales"
              placeholder="Search sales…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftAddon={<Search size={15} />}
            />
          </div>
          <Table
            columns={columns}
            data={shown}
            isLoading={salesApi.isLoading}
            keyExtractor={(s) => s.id}
            emptyTitle="No sales found"
            emptyDescription={
              scope === 'distributor' ? 'No sales recorded for your assigned marketers yet.'
              : scope === 'mine'       ? 'No sales have been recorded yet.'
              : 'No sales have been recorded yet.'
            }
          />
        </Card>
      )}

      {canRecord && (
        <SaleFormModal
          isOpen={recordModal.isOpen}
          onClose={recordModal.close}
          marketers={marketerList.marketers}
          customers={customers.customers}
          products={products.products}
          onSubmit={submit}
          isLoading={salesApi.isActionLoading}
          error={salesApi.error}
        />
      )}

      {canApprove && (
        <RejectSaleModal
          isOpen={rejectModal.isOpen}
          onClose={() => { rejectModal.close(); setRejectingId(null) }}
          onSubmit={handleReject}
          isLoading={salesApi.isActionLoading}
          error={salesApi.error}
        />
      )}
    </div>
  )
}
