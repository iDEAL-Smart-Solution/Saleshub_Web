import { useEffect } from 'react'
import { Card, PageHeader } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { EmptyState, ErrorState } from '@/components/feedback'
import CommissionStatusBadge from '@/features/commissions/components/CommissionStatusBadge'
import { useCommissions } from '@/features/commissions'
import { usePageTitle } from '@/hooks/usePageTitle'
import { CommissionType, type CommissionResponse } from '@/types'
import { formatCurrency, formatDate, formatMonth } from '@/utils/formatters'

export default function DistributorCommissionsPage() {
  usePageTitle('My Commissions')

  const { commissions, isLoading, error, fetchMine } = useCommissions()

  useEffect(() => { void fetchMine() }, [fetchMine])

  // Filter only Distributor-type commissions (10% per qualifying sale)
  const distributorComms = commissions.filter(
    (c) => c.type === CommissionType.Distributor,
  )

  const columns: Column<CommissionResponse>[] = [
    {
      key: 'period',
      header: 'Period',
      render: (c) => formatMonth(c.performanceYear, c.performanceMonth),
    },
    {
      key: 'marketer',
      header: 'Marketer',
      render: (c) => c.marketerName,
    },
    {
      key: 'rate',
      header: 'Rate',
      render: (c) =>
        c.rate != null ? `${(c.rate * 100).toFixed(0)}%` : '10%',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (c) => (
        <span className="font-medium text-[#1565C0]">{formatCurrency(c.amount)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <CommissionStatusBadge status={c.status} />,
    },
    {
      key: 'earnedAt',
      header: 'Earned',
      render: (c) => formatDate(c.earnedAt),
    },
  ]

  return (
    <div>
      <PageHeader
        title="My Commissions"
        subtitle="10% commission on qualifying sales by your assigned marketers"
      />

      {error ? (
        <ErrorState message={error} onRetry={() => void fetchMine()} />
      ) : !isLoading && distributorComms.length === 0 ? (
        <EmptyState
          title="No commissions yet"
          description="Distributor commissions appear here once your marketers' sales are approved."
        />
      ) : (
        <Card noPadding>
          <Table
            columns={columns}
            data={distributorComms}
            isLoading={isLoading}
            keyExtractor={(c) => c.id}
            emptyTitle="No commissions found"
            emptyDescription="Commission records will appear here after qualifying sales are approved."
          />
        </Card>
      )}
    </div>
  )
}
