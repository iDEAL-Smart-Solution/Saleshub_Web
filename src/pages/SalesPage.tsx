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
import { useUsers, useMarketers } from '@/features/users'
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
  type UserSummaryResponse,
} from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'

interface Props { scope: 'all' | 'mine'; canRecord?: boolean }

export default function SalesPage({ scope, canRecord = false }: Props) {
  usePageTitle(scope === 'mine' ? 'My Sales' : 'Sales')

  const salesApi   = useSales()
  const products   = useProducts()
  const customers  = useCustomers()
  // Admin/Dev use the full user list; MarketingLead uses the lighter marketer-only endpoint
  const users      = useUsers()
  const marketerList = useMarketers()

  const recordModal = useDisclosure()
  const rejectModal = useDisclosure()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const role       = useAuthStore((s) => s.user?.roles[0])
  const canConfirm = role === ROLES.DEV || role === ROLES.ADMIN
  const isMLRecorder = canRecord && role === ROLES.MARKETING_LEAD

  const { fetchMySales, fetchAllSales } = salesApi
  const { fetchActiveProducts }         = products
  const { fetchCustomers }              = customers

  useEffect(() => {
    void (scope === 'mine' ? fetchMySales() : fetchAllSales())
  }, [scope, fetchAllSales, fetchMySales])

  useEffect(() => {
    if (!canRecord) return
    void fetchActiveProducts()
    void fetchCustomers()
    if (isMLRecorder) {
      // ML uses the dedicated marketer-list endpoint
      void marketerList.fetchMarketers()
    } else {
      // Admin/Dev fetch the full user list and filter client-side
      void users.fetchAllUsers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRecord, isMLRecorder])

  const sales = scope === 'mine' ? salesApi.mySales : salesApi.sales
  const shown = useMemo(
    () =>
      sales.filter((s) =>
        `${s.marketerName} ${s.customerName} ${s.productName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [sales, search],
  )

  const openReject = (id: string) => {
    setRejectingId(id)
    rejectModal.open()
  }

  const handleReject = async (data: RejectSaleRequest): Promise<boolean> => {
    if (!rejectingId) return false
    const ok = await salesApi.rejectSale(rejectingId, data)
    if (ok) setRejectingId(null)
    return ok
  }

  // Build the marketer options for the sale form modal.
  // Admin/Dev: filter the full user list to Marketer role.
  // MarketingLead: use the dedicated MarketerSummaryResponse list.
  const marketerOptions: UserSummaryResponse[] = isMLRecorder
    ? marketerList.marketers.map((m) => ({
        id: m.id,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        isActive: m.isActive,
        roles: [ROLES.MARKETER],
        createdAt: '',
      }))
    : users.users.filter((u) => u.roles.includes(ROLES.MARKETER))

  const columns: Column<SaleSummaryResponse>[] = [
    ...(scope === 'all'
      ? ([{ key: 'marketerName', header: 'Marketer' }] as Column<SaleSummaryResponse>[])
      : []),
    { key: 'customerName', header: 'Customer' },
    { key: 'productName',  header: 'Product'  },
    { key: 'saleDate',     header: 'Date',   render: (s) => formatDate(s.saleDate) },
    {
      key: 'amount',
      header: 'Amount',
      render: (s) => <span className="font-medium">{formatCurrency(s.amount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => <SaleStatusBadge status={s.status} />,
    },
    ...(canConfirm && scope === 'all'
      ? ([
          {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (s: SaleSummaryResponse) => (
              <div className="flex justify-end gap-1">
                {s.status === SaleStatus.Pending && (
                  <>
                    <Button
                      size="sm"
                      isLoading={salesApi.isActionLoading}
                      onClick={() => void salesApi.confirmSale(s.id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => openReject(s.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {s.status === SaleStatus.Confirmed && (
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={salesApi.isActionLoading}
                    onClick={() => void salesApi.refundSale(s.id)}
                  >
                    Refund
                  </Button>
                )}
              </div>
            ),
          },
        ] as Column<SaleSummaryResponse>[])
      : []),
  ]

  const submit = async (data: CreateSaleRequest) => {
    const ok = await salesApi.createSale(data)
    if (ok) await salesApi.fetchAllSales()
    return ok
  }

  return (
    <div>
      <PageHeader
        title={scope === 'mine' ? 'My Sales' : 'Sales'}
        subtitle={canConfirm ? 'Review and confirm recorded sales' : 'View recorded sales'}
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
            void (scope === 'mine' ? salesApi.fetchMySales() : salesApi.fetchAllSales())
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
            emptyDescription="Recorded sales will appear here."
          />
        </Card>
      )}

      {canRecord && (
        <SaleFormModal
          isOpen={recordModal.isOpen}
          onClose={recordModal.close}
          marketers={marketerOptions}
          customers={customers.customers}
          products={products.products}
          onSubmit={submit}
          isLoading={salesApi.isActionLoading}
          error={salesApi.error}
        />
      )}

      {canConfirm && (
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
