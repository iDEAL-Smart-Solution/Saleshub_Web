import { describe, it, expect } from 'vitest'
import { ROLES, hasAtLeastRole } from '@/constants/roles'

describe('hasAtLeastRole', () => {
  it('Dev has at least Admin privilege', () => {
    expect(hasAtLeastRole(ROLES.DEV, ROLES.ADMIN)).toBe(true)
  })
  it('Marketer does NOT have Admin privilege', () => {
    expect(hasAtLeastRole(ROLES.MARKETER, ROLES.ADMIN)).toBe(false)
  })
  it('MarketingLead has at least MarketingLead privilege', () => {
    expect(hasAtLeastRole(ROLES.MARKETING_LEAD, ROLES.MARKETING_LEAD)).toBe(true)
  })
  it('Admin does NOT have Dev privilege', () => {
    expect(hasAtLeastRole(ROLES.ADMIN, ROLES.DEV)).toBe(false)
  })
  it('Marketer has at least Marketer privilege', () => {
    expect(hasAtLeastRole(ROLES.MARKETER, ROLES.MARKETER)).toBe(true)
  })
  it('Distributor is NOT in the linear hierarchy — does not rank above Marketer', () => {
    // Distributor is intentionally outside ROLE_HIERARCHY; indexOf returns -1
    expect(hasAtLeastRole(ROLES.DISTRIBUTOR, ROLES.MARKETER)).toBe(false)
  })
  it('Distributor does NOT have Admin privilege via hierarchy', () => {
    expect(hasAtLeastRole(ROLES.DISTRIBUTOR, ROLES.ADMIN)).toBe(false)
  })
})
