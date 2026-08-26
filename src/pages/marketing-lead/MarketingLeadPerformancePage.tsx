import { useEffect, useState } from 'react'
import { Card, PageHeader, Select } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { ErrorState, EmptyState, LoadingState } from '@/components/feedback'
import KpiProgress from '@/features/kpi/components/KpiProgress'
import { useTeamPerformance } from '@/features/performance'
import { usePageTitle } from '@/hooks/usePageTitle'
import { buildMonthOptions, formatCurrency, formatMonth } from '@/utils/formatters'
import type { MonthlyPerformanceResponse } from '@/types'

const MONTH_OPTIONS = buildMonthOptions(12)

type ViewMode = 'monthly' | 'history'

export default function MarketingLeadPerformancePage() {
  usePageTitle('Performance')

  const now = new Date()
  const [viewMode,      setViewMode]      = useState<ViewMode>('monthly')
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)

  const { performances, isLoading, error, fetchTeamPerformance } = useTeamPerformance()

  useEffect(() => {
    void fetchTeamPerformance(
      viewMode === 'monthly' ? selectedYear   : undefined,
      viewMode === 'monthly' ? selectedMonth  : undefined,
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selectedYear, selectedMonth])

  const handlePeriodChange = (value: string) => {
    const opt = MONTH_OPTIONS.find((o) => `${o.year}-${o.month}` === value)
    if (opt) { setSelectedYear(opt.year); setSelectedMonth(opt.month) }
  }

  const selectedLabel = MONTH_OPTIONS.find(
    (o) => o.year === selectedYear && o.month === selectedMonth,
  )?.label ?? formatMonth(selectedYear, selectedMonth)

  // ── Shared table columns ─────────────────────────────────────────────────
  const columns: Column<MonthlyPerformanceResponse>[] = [
    ...(viewMode === 'history'
      ? ([
          {
            key: 'period',
            header: 'Period',
            render: (p) => formatMonth(p.year, p.month),
          },
        ] as Column<MonthlyPerformanceResponse>[])
      : []),
    {
      key: 'marketerName',
      header: 'Marketer',
      render: (p) => <span className="font-medium text-[#212121]">{p.marketerName}</span>,
    },
    {
      key: 'progress',
      header: 'KPI progress',
      render: (p) => (
        <div className="min-w-[140px]">
          <KpiProgress value={p.performancePercentage} label={`${p.totalKpiProgress} / ${p.kpiTarget}`} />
        </div>
      ),
    },
    {
      key: 'newSales',
      header: 'Sales',
      render: (p) => (
        <span className="text-sm">
          {p.newSales}
          {p.carriedSales > 0 && (
            <span className="ml-1 text-xs text-[#757575]">+{p.carriedSales} carried</span>
          )}
        </span>
      ),
    },
    {
      key: 'isKpiMet',
      header: 'Status',
      render: (p) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            p.isKpiMet ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF8E1] text-[#F57F17]'
          }`}
        >
          {p.isKpiMet ? 'KPI Met' : 'In progress'}
        </span>
      ),
    },
    {
      key: 'totalCommission',
      header: 'Total commission',
      render: (p) => (
        <span className="font-medium text-[#1565C0]">{formatCurrency(p.totalCommission)}</span>
      ),
    },
  ]

  const subtitle = viewMode === 'monthly'
    ? `Marketer performance for ${selectedLabel}`
    : 'All months — team performance history'

  return (
    <div>
      <PageHeader
        title="Team Performance"
        subtitle={subtitle}
        action={
          <div className="flex gap-2">
            {/* View mode toggle */}
            <div className="flex rounded-lg border border-[#BDBDBD] overflow-hidden text-sm">
              {(['monthly', 'history'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={[
                    'px-3 py-2 font-medium transition-colors capitalize',
                    viewMode === mode
                      ? 'bg-[#1565C0] text-white'
                      : 'bg-white text-[#424242] hover:bg-[#F5F5F5]',
                  ].join(' ')}
                >
                  {mode === 'monthly' ? 'Monthly' : 'History'}
                </button>
              ))}
            </div>

            {/* Month selector — only visible in monthly mode */}
            {viewMode === 'monthly' && (
              <div className="w-48">
                <Select
                  aria-label="Select period"
                  value={`${selectedYear}-${selectedMonth}`}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  options={MONTH_OPTIONS.map((o) => ({
                    value: `${o.year}-${o.month}`,
                    label: o.label,
                  }))}
                />
              </div>
            )}
          </div>
        }
      />

      {error ? (
        <ErrorState
          message={error}
          onRetry={() =>
            void fetchTeamPerformance(
              viewMode === 'monthly' ? selectedYear  : undefined,
              viewMode === 'monthly' ? selectedMonth : undefined,
            )
          }
        />
      ) : isLoading ? (
        <LoadingState message="Loading team performance…" />
      ) : performances.length === 0 ? (
        <EmptyState
          title="No performance data yet"
          description={
            viewMode === 'monthly'
              ? `No marketer performance records exist for ${selectedLabel}. Performance is generated when sales are confirmed.`
              : 'No performance history found. Records appear once sales are confirmed.'
          }
        />
      ) : (
        <>
          {/* Summary row — only for monthly view */}
          {viewMode === 'monthly' && (
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <Card>
                <p className="text-xs text-[#757575]">Marketers tracked</p>
                <p className="mt-1 text-2xl font-bold text-[#212121]">{performances.length}</p>
              </Card>
              <Card>
                <p className="text-xs text-[#757575]">KPI met</p>
                <p className="mt-1 text-2xl font-bold text-[#2E7D32]">
                  {performances.filter((p) => p.isKpiMet).length}
                  <span className="text-sm font-normal text-[#757575] ml-1">
                    / {performances.length}
                  </span>
                </p>
              </Card>
              <Card>
                <p className="text-xs text-[#757575]">Total commissions</p>
                <p className="mt-1 text-2xl font-bold text-[#1565C0]">
                  {formatCurrency(performances.reduce((sum, p) => sum + p.totalCommission, 0))}
                </p>
              </Card>
            </div>
          )}

          <Card noPadding>
            <Table
              columns={columns}
              data={performances}
              isLoading={false}
              keyExtractor={(p) => p.id}
              emptyTitle="No performance data"
              emptyDescription="Performance records will appear here once sales are confirmed."
            />
          </Card>
        </>
      )}
    </div>
  )
}
