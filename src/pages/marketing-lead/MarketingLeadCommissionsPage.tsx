import { useEffect, useState } from 'react'
import { Card, PageHeader, Select } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { ErrorState, EmptyState, LoadingState } from '@/components/feedback'
import CommissionStatusBadge from '@/features/commissions/components/CommissionStatusBadge'
import { useCommissions } from '@/features/commissions'
import { useMarketers } from '@/features/users'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency, formatMonth, getCommissionTypeLabel } from '@/utils/formatters'
import type { CommissionResponse } from '@/types'

export default function MarketingLeadCommissionsPage() {
  usePageTitle('Commissions')

  const { marketers, isLoading: loadingMarketers, fetchMarketers } = useMarketers()
  const { commissions, isLoading: loadingComm, error, fetchByMarketer } = useCommissions()
  const [selectedId, setSelectedId] = useState<string>('')

  // Load marketer list on mount
  useEffect(() => { void fetchMarketers() }, [fetchMarketers])

  // Auto-select first marketer once list loads
  useEffect(() => {
    if (marketers.length > 0 && !selectedId) {
      setSelectedId(marketers[0].id)
    }
  }, [marketers, selectedId])

  // Fetch commissions whenever selection changes
  useEffect(() => {
    if (selectedId) void fetchByMarketer(selectedId)
  }, [selectedId, fetchByMarketer])

  const selectedMarketer = marketers.find((m) => m.id === selectedId)

  const columns: Column<CommissionResponse>[] = [
    {
      key: 'period',
      header: 'Period',
      render: (c) => formatMonth(c.performanceYear, c.performanceMonth),
    },
    {
      key: 'type',
      header: 'Type',
      render: (c) => getCommissionTypeLabel(c.type),
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
  ]

  return (
    <div>
      <PageHeader
        title="Commissions"
        subtitle={
          selectedMarketer
            ? `Commission records for ${selectedMarketer.firstName} ${selectedMarketer.lastName}`
            : 'Select a marketer to view their commission records'
        }
        action={
          <div className="w-56">
            <Select
              aria-label="Select marketer"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={loadingMarketers || marketers.length === 0}
              options={marketers.map((m) => ({
                value: m.id,
                label: `${m.firstName} ${m.lastName}`,
              }))}
              placeholder={loadingMarketers ? 'Loading…' : 'Select marketer'}
            />
          </div>
        }
      />

      {!selectedId ? (
        <EmptyState
          title="No marketer selected"
          description="Select a marketer from the dropdown above to view their commission records."
        />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => void fetchByMarketer(selectedId)}
        />
      ) : loadingComm ? (
        <LoadingState message="Loading commissions…" />
      ) : (
        <Card noPadding>
          <Table
            columns={columns}
            data={commissions}
            isLoading={false}
            keyExtractor={(c) => c.id}
            emptyTitle="No commissions found"
            emptyDescription="Commission records will appear here once qualifying sales are processed."
          />
        </Card>
      )}
    </div>
  )
}
