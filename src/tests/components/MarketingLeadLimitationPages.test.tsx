/**
 * Tests for the Marketing Lead performance and commissions pages.
 *
 * Final business rule:
 *   - MarketingLead CAN record sales (must supply MarketerId).
 *   - MarketingLead can approve sales.
 *   - MarketingLead receives 2% commission via GET /api/commissions/my.
 *   - MarketingLeadCommissionsPage uses GET /api/commissions/my (beneficiary-scoped).
 *   - MarketingLeadPerformancePage uses the aggregate endpoint (not marketer-me).
 */
import { describe, it, expect, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { MemoryRouter } from 'react-router-dom'
import MarketingLeadPerformancePage  from '@/pages/marketing-lead/MarketingLeadPerformancePage'
import MarketingLeadCommissionsPage  from '@/pages/marketing-lead/MarketingLeadCommissionsPage'

vi.mock('@/services/api/performance.service', () => ({
  getMyPerformanceApi:                 vi.fn().mockRejectedValue(new Error('Should not be called')),
  getMyPerformanceHistoryApi:          vi.fn().mockRejectedValue(new Error('Should not be called')),
  compareMyPerformanceApi:             vi.fn().mockRejectedValue(new Error('Should not be called')),
  getMarketerPerformanceApi:           vi.fn().mockRejectedValue(new Error('Should not be called')),
  getMarketerPerformanceHistoryApi:    vi.fn().mockRejectedValue(new Error('Should not be called')),
  getAllMarketerPerformanceApi:        vi.fn().mockResolvedValue([]),
  getAllMarketerPerformanceHistoryApi: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/services/api/commission.service', () => ({
  getAllCommissionsApi:            vi.fn().mockRejectedValue(new Error('Should not be called')),
  getMyCommissionsApi:            vi.fn().mockResolvedValue([]),
  getCommissionsByMarketerApi:    vi.fn().mockResolvedValue([]),
  getCommissionsByBeneficiaryApi: vi.fn().mockResolvedValue([]),
  getCommissionsByPerformanceApi: vi.fn().mockResolvedValue([]),
  updateCommissionStatusApi:      vi.fn().mockResolvedValue({}),
}))

vi.mock('@/services/api/user.service', () => ({
  getActiveMarketersApi:        vi.fn().mockResolvedValue([]),
  getActiveDistributorsApi:     vi.fn().mockResolvedValue([]),
  getMarketersByDistributorApi: vi.fn().mockResolvedValue([]),
  getAllUsersApi:                vi.fn().mockResolvedValue([]),
  getPendingMarketersApi:       vi.fn().mockResolvedValue([]),
  getUserByIdApi:               vi.fn().mockResolvedValue(null),
  createUserApi:                vi.fn().mockResolvedValue(null),
  approveMarketerApi:           vi.fn().mockResolvedValue(undefined),
  activateUserApi:              vi.fn().mockResolvedValue(undefined),
  deactivateUserApi:            vi.fn().mockResolvedValue(undefined),
  changeUserRoleApi:            vi.fn().mockResolvedValue(undefined),
  reassignDistributorApi:       vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/services/api/sale.service', () => ({
  getAllSalesApi:            vi.fn().mockResolvedValue([]),
  getMySalesApi:            vi.fn().mockResolvedValue([]),
  getDistributorSalesApi:   vi.fn().mockResolvedValue([]),
  getSalesByMarketerApi:    vi.fn().mockResolvedValue([]),
  getSaleByIdApi:           vi.fn().mockResolvedValue(null),
  createSaleApi:            vi.fn().mockResolvedValue({ id: 'sale-1' }),
  confirmSaleApi:           vi.fn().mockResolvedValue(undefined),
  rejectSaleApi:            vi.fn().mockResolvedValue(undefined),
  refundSaleApi:            vi.fn().mockResolvedValue(undefined),
  getSalesByDistributorApi: vi.fn().mockResolvedValue([]),
}))

import * as perfService from '@/services/api/performance.service'
import * as commService from '@/services/api/commission.service'

async function wrap(component: React.ReactNode) {
  let result!: ReturnType<typeof render>
  await act(async () => {
    result = render(<MemoryRouter>{component}</MemoryRouter>)
  })
  return result
}

// ── Performance page ──────────────────────────────────────────────────────────
describe('MarketingLeadPerformancePage', () => {
  it('renders the Team Performance page header', async () => {
    await wrap(<MarketingLeadPerformancePage />)
    expect(screen.getByText('Team Performance')).toBeDefined()
  })

  it('calls the aggregate performance endpoint, not the marketer-me endpoint', async () => {
    await wrap(<MarketingLeadPerformancePage />)
    expect(vi.mocked(perfService.getAllMarketerPerformanceApi)).toHaveBeenCalled()
    expect(vi.mocked(perfService.getMyPerformanceApi)).not.toHaveBeenCalled()
  })
})

// ── Commissions page ─────────────────────────────────────────────────────────
describe('MarketingLeadCommissionsPage', () => {
  it('renders the Commissions page header', async () => {
    await wrap(<MarketingLeadCommissionsPage />)
    expect(screen.getByText('My Commissions')).toBeDefined()
  })

  it('calls GET /api/commissions/my (beneficiary-scoped, returns ML 2% commissions)', async () => {
    await wrap(<MarketingLeadCommissionsPage />)
    expect(vi.mocked(commService.getMyCommissionsApi)).toHaveBeenCalled()
  })

  it('does NOT call the DevOrAdmin-only all-commissions endpoint', async () => {
    await wrap(<MarketingLeadCommissionsPage />)
    expect(vi.mocked(commService.getAllCommissionsApi)).not.toHaveBeenCalled()
  })

  it('does NOT call the per-marketer commission endpoint for ML own commissions', async () => {
    await wrap(<MarketingLeadCommissionsPage />)
    expect(vi.mocked(commService.getCommissionsByMarketerApi)).not.toHaveBeenCalled()
  })
})
