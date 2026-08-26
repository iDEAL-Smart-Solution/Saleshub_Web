import { describe, it, expect } from 'vitest'
import { getRoleHomePath, hasAnyRole } from '@/features/auth/utils/roleRedirect'
import { ROLES } from '@/constants/roles'

describe('getRoleHomePath', () => {
  it('returns /dev/dashboard for Dev', () => {
    expect(getRoleHomePath(ROLES.DEV)).toBe('/dev/dashboard')
  })
  it('returns /admin/dashboard for Admin', () => {
    expect(getRoleHomePath(ROLES.ADMIN)).toBe('/admin/dashboard')
  })
  it('returns /marketing-lead/dashboard for MarketingLead', () => {
    expect(getRoleHomePath(ROLES.MARKETING_LEAD)).toBe('/marketing-lead/dashboard')
  })
  it('returns /marketer/dashboard for Marketer', () => {
    expect(getRoleHomePath(ROLES.MARKETER)).toBe('/marketer/dashboard')
  })
  it('returns /dashboard for unknown role', () => {
    expect(getRoleHomePath(undefined)).toBe('/dashboard')
  })
})

describe('hasAnyRole', () => {
  it('returns true when user has an allowed role', () => {
    expect(hasAnyRole([ROLES.ADMIN], [ROLES.DEV, ROLES.ADMIN])).toBe(true)
  })
  it('returns false when user has no allowed role', () => {
    expect(hasAnyRole([ROLES.MARKETER], [ROLES.DEV, ROLES.ADMIN])).toBe(false)
  })
  it('returns true for Dev accessing any route', () => {
    expect(hasAnyRole([ROLES.DEV], [ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD, ROLES.MARKETER])).toBe(true)
  })
  it('returns false with empty userRoles', () => {
    expect(hasAnyRole([], [ROLES.ADMIN])).toBe(false)
  })
})
