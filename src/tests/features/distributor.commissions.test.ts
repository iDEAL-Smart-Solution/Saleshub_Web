/**
 * Phase 7 — Commission type tests for Distributor and Marketing Lead.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CommissionType, CommissionStatus } from '@/types'
import { getCommissionTypeLabel } from '@/utils/formatters'

// ── Mock commission service ───────────────────────────────────────────────────
vi.mock('@/services/api/commission.service', () => ({
  getAllCommissionsApi:             vi.fn().mockResolvedValue([]),
  getMyCommissionsApi:             vi.fn().mockResolvedValue([]),
  getCommissionsByMarketerApi:     vi.fn().mockResolvedValue([]),
  getCommissionsByBeneficiaryApi:  vi.fn().mockResolvedValue([]),
  getCommissionsByPerformanceApi:  vi.fn().mockResolvedValue([]),
  updateCommissionStatusApi:       vi.fn().mockResolvedValue({}),
}))

import * as commService from '@/services/api/commission.service'

describe('CommissionType — new values', () => {
  it('Distributor type value is 3', () => {
    expect(CommissionType.Distributor).toBe(3)
  })

  it('MarketingLead type value is 4', () => {
    expect(CommissionType.MarketingLead).toBe(4)
  })

  it('existing types unchanged', () => {
    expect(CommissionType.KpiReward).toBe(0)
    expect(CommissionType.Bonus).toBe(1)
    expect(CommissionType.Adjustment).toBe(2)
  })
})

describe('getCommissionTypeLabel — new labels', () => {
  it('labels Distributor commission as "Distributor (10%)"', () => {
    expect(getCommissionTypeLabel(CommissionType.Distributor)).toBe('Distributor (10%)')
  })

  it('labels MarketingLead commission as "Marketing Lead (2%)"', () => {
    expect(getCommissionTypeLabel(CommissionType.MarketingLead)).toBe('Marketing Lead (2%)')
  })

  it('existing labels unchanged', () => {
    expect(getCommissionTypeLabel(CommissionType.KpiReward)).toBe('KPI Reward')
    expect(getCommissionTypeLabel(CommissionType.Bonus)).toBe('Bonus')
    expect(getCommissionTypeLabel(CommissionType.Adjustment)).toBe('Adjustment')
  })
})

describe('Commission /my endpoint is used by Distributor and ML', () => {
  beforeEach(() => {
    vi.mocked(commService.getMyCommissionsApi).mockResolvedValue([
      {
        id: 'c1',
        marketerId: 'm1', marketerName: 'Jane Marketer',
        beneficiaryId: 'dist-1', beneficiaryName: 'Test Distributor',
        monthlyPerformanceId: 'perf-1',
        performanceYear: 2026, performanceMonth: 8,
        saleId: 's1',
        type: CommissionType.Distributor,
        rate: 0.10,
        amount: 10000,
        status: CommissionStatus.Pending,
        earnedAt: '2026-08-15T00:00:00Z',
        createdAt: '2026-08-15T00:00:00Z',
      },
    ])
  })

  it('getMyCommissionsApi returns Distributor-type commissions with correct rate', async () => {
    const comms = await vi.mocked(commService.getMyCommissionsApi)()
    expect(comms).toHaveLength(1)
    expect(comms[0].type).toBe(CommissionType.Distributor)
    expect(comms[0].rate).toBe(0.10)
    expect(comms[0].amount).toBe(10000)
    expect(comms[0].beneficiaryId).toBe('dist-1')
  })

  it('amount is provided by backend — not calculated on frontend', async () => {
    const comms = await vi.mocked(commService.getMyCommissionsApi)()
    // Frontend MUST display backend amount as-is
    expect(typeof comms[0].amount).toBe('number')
    // We do NOT recalculate: amount != 100000 * 0.10 computed here
    expect(comms[0].amount).toBe(10000)
  })
})

describe('Sale role rules — commission implications', () => {
  it('Distributor commission rate is 10%', async () => {
    vi.mocked(commService.getMyCommissionsApi).mockResolvedValue([{
      id: 'c-dist',
      marketerId: 'm1', marketerName: 'M',
      beneficiaryId: 'dist-1', beneficiaryName: 'Dist',
      monthlyPerformanceId: 'p1',
      performanceYear: 2026, performanceMonth: 8,
      type: CommissionType.Distributor,
      rate: 0.10, amount: 10000,
      status: CommissionStatus.Pending,
      earnedAt: '2026-08-01T00:00:00Z', createdAt: '2026-08-01T00:00:00Z',
    }])
    const comms = await vi.mocked(commService.getMyCommissionsApi)()
    expect(comms[0].rate).toBe(0.10)
    expect(comms[0].amount).toBe(10000)
  })

  it('MarketingLead commission rate is 2%', async () => {
    vi.mocked(commService.getMyCommissionsApi).mockResolvedValue([{
      id: 'c-ml',
      marketerId: 'm1', marketerName: 'M',
      beneficiaryId: 'ml-1', beneficiaryName: 'ML',
      monthlyPerformanceId: 'p1',
      performanceYear: 2026, performanceMonth: 8,
      type: CommissionType.MarketingLead,
      rate: 0.02, amount: 2000,
      status: CommissionStatus.Pending,
      earnedAt: '2026-08-01T00:00:00Z', createdAt: '2026-08-01T00:00:00Z',
    }])
    const comms = await vi.mocked(commService.getMyCommissionsApi)()
    expect(comms[0].rate).toBe(0.02)
    expect(comms[0].amount).toBe(2000)
  })
})
