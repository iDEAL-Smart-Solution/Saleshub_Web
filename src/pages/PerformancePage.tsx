import { useEffect } from 'react'
import { Card, PageHeader } from '@/components/common'
import { ErrorState, LoadingState, EmptyState } from '@/components/feedback'
import KpiProgress from '@/features/kpi/components/KpiProgress'
import { useMyPerformance } from '@/features/performance'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency, formatMonth } from '@/utils/formatters'

export default function PerformancePage() {
  usePageTitle('My Performance')
  const api = useMyPerformance()
  const { fetchPerformance, fetchHistory } = api
  useEffect(() => { void fetchPerformance(); void fetchHistory() }, [fetchPerformance, fetchHistory])
  if (api.isLoading && !api.performance) return <LoadingState message="Loading performance…" />
  if (api.error) return <ErrorState message={api.error} onRetry={() => void api.fetchPerformance()} />
  if (!api.performance) return <EmptyState title="No performance data" description="Your performance will be available when sales have been processed." />
  const p = api.performance
  return <div><PageHeader title="My Performance" subtitle={formatMonth(p.year, p.month)} /><div className="grid gap-4 md:grid-cols-3"><Card><p className="text-sm text-[#757575]">Sales achieved</p><p className="mt-1 text-2xl font-bold">{p.totalKpiProgress} / {p.kpiTarget}</p><p className="mt-2 text-xs text-[#757575]">{p.carriedSales} carried forward, {p.newSales} this month</p></Card><Card><p className="text-sm text-[#757575]">KPI status</p><p className={`mt-1 text-2xl font-bold ${p.isKpiMet ? 'text-[#2E7D32]' : 'text-[#212121]'}`}>{p.isKpiMet ? 'Achieved' : 'In progress'}</p><div className="mt-3"><KpiProgress value={p.performancePercentage} /></div></Card><Card><p className="text-sm text-[#757575]">Total commission</p><p className="mt-1 text-2xl font-bold text-[#1565C0]">{formatCurrency(p.totalCommission)}</p><p className="mt-2 text-xs text-[#757575]">{p.bonusSalesCount} bonus sales</p></Card></div></div>
}
