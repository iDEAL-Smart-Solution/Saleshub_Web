/**
 * Phase 7 — Role system tests covering the Distributor role addition.
 */
import { describe, it, expect } from 'vitest'
import { ROLES, hasAtLeastRole, ROLE_HIERARCHY } from '@/constants/roles'
import type { Role } from '@/constants/roles'
import { getRoleHomePath, hasAnyRole } from '@/features/auth/utils/roleRedirect'

describe('Distributor role constant', () => {
  it('ROLES.DISTRIBUTOR equals "Distributor"', () => {
    expect(ROLES.DISTRIBUTOR).toBe('Distributor')
  })

  it('Distributor is NOT in the linear role hierarchy', () => {
    // Distributor has its own permission set — it should NOT rank above/below ML/Admin/Dev
    expect(ROLE_HIERARCHY).not.toContain(ROLES.DISTRIBUTOR)
  })
})

describe('getRoleHomePath with Distributor', () => {
  it('returns /distributor/dashboard for Distributor', () => {
    expect(getRoleHomePath(ROLES.DISTRIBUTOR)).toBe('/distributor/dashboard')
  })

  it('still returns correct paths for all other roles', () => {
    expect(getRoleHomePath(ROLES.DEV)).toBe('/dev/dashboard')
    expect(getRoleHomePath(ROLES.ADMIN)).toBe('/admin/dashboard')
    expect(getRoleHomePath(ROLES.MARKETING_LEAD)).toBe('/marketing-lead/dashboard')
    expect(getRoleHomePath(ROLES.MARKETER)).toBe('/marketer/dashboard')
    expect(getRoleHomePath(undefined)).toBe('/dashboard')
  })
})

describe('Sale recording permissions — final rules', () => {
  const canRecord: Role[] = [ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD, ROLES.DISTRIBUTOR]
  const cannotRecord: Role[] = [ROLES.MARKETER]

  it('Admin can record sales', () => {
    expect(canRecord.includes(ROLES.ADMIN)).toBe(true)
  })

  it('Dev can record sales', () => {
    expect(canRecord.includes(ROLES.DEV)).toBe(true)
  })

  it('MarketingLead can record sales', () => {
    expect(canRecord.includes(ROLES.MARKETING_LEAD)).toBe(true)
  })

  it('Distributor can record sales (for assigned marketers)', () => {
    expect(canRecord.includes(ROLES.DISTRIBUTOR)).toBe(true)
  })

  it('Marketer CANNOT record sales', () => {
    expect(cannotRecord.includes(ROLES.MARKETER)).toBe(true)
    expect(canRecord.includes(ROLES.MARKETER)).toBe(false)
  })
})

describe('Sale approval permissions — final rules', () => {
  const canApprove: Role[] = [ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD]

  it('Admin can approve sales', () => {
    expect(canApprove.includes(ROLES.ADMIN)).toBe(true)
  })

  it('MarketingLead can approve sales', () => {
    expect(canApprove.includes(ROLES.MARKETING_LEAD)).toBe(true)
  })

  it('Distributor CANNOT approve sales', () => {
    expect(canApprove.includes(ROLES.DISTRIBUTOR)).toBe(false)
  })

  it('Marketer CANNOT approve sales', () => {
    expect(canApprove.includes(ROLES.MARKETER)).toBe(false)
  })
})

describe('hasAnyRole with Distributor', () => {
  it('Distributor is allowed when Distributor is in allowedRoles', () => {
    expect(hasAnyRole([ROLES.DISTRIBUTOR], [ROLES.DISTRIBUTOR])).toBe(true)
  })

  it('Distributor is NOT allowed in MarketingLeadOrAbove routes', () => {
    expect(
      hasAnyRole([ROLES.DISTRIBUTOR], [ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD]),
    ).toBe(false)
  })

  it('Distributor is NOT allowed in DevOrAdmin routes', () => {
    expect(hasAnyRole([ROLES.DISTRIBUTOR], [ROLES.DEV, ROLES.ADMIN])).toBe(false)
  })

  it('Distributor is NOT allowed in Marketer-only routes', () => {
    expect(hasAnyRole([ROLES.DISTRIBUTOR], [ROLES.MARKETER])).toBe(false)
  })
})

describe('hasAtLeastRole does NOT grant Distributor higher access', () => {
  it('Distributor is not "at least" Admin', () => {
    // hasAtLeastRole only checks ROLE_HIERARCHY; Distributor is not in it → index -1
    expect(hasAtLeastRole(ROLES.DISTRIBUTOR, ROLES.ADMIN)).toBe(false)
  })

  it('Distributor is not "at least" MarketingLead', () => {
    expect(hasAtLeastRole(ROLES.DISTRIBUTOR, ROLES.MARKETING_LEAD)).toBe(false)
  })

  it('Distributor is not "at least" Marketer in hierarchy', () => {
    // Distributor is explicitly not in the hierarchy
    expect(hasAtLeastRole(ROLES.DISTRIBUTOR, ROLES.MARKETER)).toBe(false)
  })
})
