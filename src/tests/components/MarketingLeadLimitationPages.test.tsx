/**
 * Tests for the Marketing Lead performance and commissions pages.
 *
 * These pages were previously stubs (Phase 4). In Phase 5/6 they are real pages
 * backed by new backend endpoints. The tests verify:
 *  - The correct page header is rendered.
 *  - The pages make NO calls to the Marketer-only endpoints (/marketers/me/...).
 *  - The pages call the correct ML-authorized endpoints.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { MemoryRouter } from 'react-router-dom'
import MarketingLeadPerformancePage from '@/pages/marketing-lead/MarketingLeadPerformancePage'
import MarketingLeadCommissionsPage from '@/pages/marketing-lead/MarketingLeadCommissionsPage'

// Mock all service calls the real pages may invoke
vi.mock('@/services/api/performance.service', () => ({
  getMyPerformanceApi:                  vi.fn().mockRejectedValue(new Error('Should not be called')),
  getMyPerformanceHistoryApi:           vi.fn().mockRejectedValue(new Error('Should not be called')),
  compareMyPerformanceApi:              vi.fn().mockRejectedValue(new Error('Should not be called')),
  getMarketerPerformanceApi:            vi.fn().mockRejectedValue(new Error('Should not be called')),
  getMarketerPerformanceHistoryApi:     vi.fn().mockRejectedValue(new Error('Should not be called')),
  getAllMarketerPerformanceApi:         vi.fn().mockResolvedValue([]),
  getAllMarketerPerformanceHistoryApi:  vi.fn().mockResolvedValue([]),
}))

vi.mock('@/services/api/commission.service', () => ({
  getAllCommissionsApi:            vi.fn().mockRejectedValue(new Error('Should not be called')),
  getMyCommissionsApi:            vi.fn().mockRejectedValue(new Error('Should not be called')),
  getCommissionsByMarketerApi:    vi.fn().mockResolvedValue([]),
  getCommissionsByPerformanceApi: vi.fn().mockResolvedValue([]),
  updateCommissionStatusApi:      vi.fn().mockResolvedValue({}),
}))

vi.mock('@/services/api/user.service', () => ({
  getActiveMarketersApi:  vi.fn().mockResolvedValue([]),
  getAllUsersApi:          vi.fn().mockResolvedValue([]),
  getPendingMarketersApi: vi.fn().mockResolvedValue([]),
  getUserByIdApi:         vi.fn().mockResolvedValue(null),
  createUserApi:          vi.fn().mockResolvedValue(null),
  approveMarketerApi:     vi.fn().mockResolvedValue(undefined),
  activateUserApi:        vi.fn().mockResolvedValue(undefined),
  deactivateUserApi:      vi.fn().mockResolvedValue(undefined),
  changeUserRoleApi:      vi.fn().mockResolvedValue(undefined),
}))

import * as perfService     from '@/services/api/performance.service'
import * as commService     from '@/services/api/commission.service'
import * as userServiceMock from '@/services/api/user.service'

async function wrap(component: React.ReactNode) {
  let result!: ReturnType<typeof render>
  await act(async () => {
    result = render(<MemoryRouter>{component}</MemoryRouter>)
  })
  return result
}

describe('MarketingLeadPerformancePage', () => {
  it('renders the Team Performance page header', async () => {
    await wrap(<MarketingLeadPerformancePage />)
    expect(screen.getByText('Team Performance')).toBeDefined()
  })

  it('renders the period selector', async () => {
    await wrap(<MarketingLeadPerformancePage />)
    expect(screen.getByLabelText(/select period/i)).toBeDefined()
  })

  it('calls the aggregate performance endpoint — not the marketer-me endpoint', async () => {
    await wrap(<MarketingLeadPerformancePage />)
    expect(vi.mocked(perfService.getAllMarketerPerformanceApi)).toHaveBeenCalled()
    expect(vi.mocked(perfService.getMyPerformanceApi)).not.toHaveBeenCalled()
  })

  it('does not call the Marketer-only me endpoint', async () => {
    await wrap(<MarketingLeadPerformancePage />)
    expect(vi.mocked(perfService.getMyPerformanceApi)).not.toHaveBeenCalled()
  })
})

describe('MarketingLeadCommissionsPage', () => {
  it('renders the Commissions page header', async () => {
    await wrap(<MarketingLeadCommissionsPage />)
    expect(screen.getByText('Commissions')).toBeDefined()
  })

  it('renders the marketer selector', async () => {
    await wrap(<MarketingLeadCommissionsPage />)
    expect(screen.getByLabelText(/select marketer/i)).toBeDefined()
  })

  it('calls the marketer list endpoint to populate selector', async () => {
    await wrap(<MarketingLeadCommissionsPage />)
    expect(vi.mocked(userServiceMock.getActiveMarketersApi)).toHaveBeenCalled()
  })

  it('does not call the DevOrAdmin-only all-commissions endpoint', async () => {
    await wrap(<MarketingLeadCommissionsPage />)
    expect(vi.mocked(commService.getAllCommissionsApi)).not.toHaveBeenCalled()
  })

  it('does not call the Marketer-only my-commissions endpoint', async () => {
    await wrap(<MarketingLeadCommissionsPage />)
    expect(vi.mocked(commService.getMyCommissionsApi)).not.toHaveBeenCalled()
  })
})
