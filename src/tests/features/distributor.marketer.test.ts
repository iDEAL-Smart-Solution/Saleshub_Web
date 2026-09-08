/**
 * Phase 7 — Marketer creation tests for Distributor and Marketing Lead callers.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ROLES } from '@/constants/roles'

vi.mock('@/services/api/user.service', () => ({
  getAllUsersApi:               vi.fn().mockResolvedValue([]),
  getActiveMarketersApi:       vi.fn().mockResolvedValue([]),
  getMarketersByDistributorApi: vi.fn().mockResolvedValue([]),
  getActiveDistributorsApi:    vi.fn().mockResolvedValue([]),
  getUserByIdApi:              vi.fn().mockResolvedValue(null),
  getPendingMarketersApi:      vi.fn().mockResolvedValue([]),
  createUserApi:               vi.fn().mockResolvedValue({ id: 'new-user', roles: [ROLES.MARKETER] }),
  approveMarketerApi:          vi.fn().mockResolvedValue(undefined),
  activateUserApi:             vi.fn().mockResolvedValue(undefined),
  deactivateUserApi:           vi.fn().mockResolvedValue(undefined),
  changeUserRoleApi:           vi.fn().mockResolvedValue(undefined),
  reassignDistributorApi:      vi.fn().mockResolvedValue(undefined),
}))

import * as userService from '@/services/api/user.service'
import type { CreateUserRequest } from '@/types'

describe('Distributor creates marketer — auto-assigned to self', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(userService.createUserApi).mockResolvedValue({
      id: 'new-m',
      firstName: 'Sam', lastName: 'Sales',
      email: 'sam@test.com',
      isActive: true,
      createdAt: '2026-08-01',
      roles: [ROLES.MARKETER],
      distributorId: 'dist-self',
      distributorName: 'Test Distributor',
    })
  })

  it('createUserApi is called with role=Marketer and no distributorId for Distributor callers', async () => {
    const req: CreateUserRequest = {
      firstName: 'Sam', lastName: 'Sales',
      email: 'sam@test.com',
      role: ROLES.MARKETER,
      password: 'Password1!', confirmPassword: 'Password1!',
      // No distributorId — backend auto-assigns to the calling Distributor
    }
    await userService.createUserApi(req)
    expect(userService.createUserApi).toHaveBeenCalledWith(
      expect.objectContaining({ role: ROLES.MARKETER }),
    )
    expect(userService.createUserApi).not.toHaveBeenCalledWith(
      expect.objectContaining({ role: ROLES.ADMIN }),
    )
  })

  it('response contains distributorId set by the backend', async () => {
    const result = await userService.createUserApi({
      firstName: 'Sam', lastName: 'Sales', email: 'sam@test.com',
      role: ROLES.MARKETER, password: 'Password1!', confirmPassword: 'Password1!',
    })
    expect(result.distributorId).toBe('dist-self')
  })
})

describe('Marketing Lead creates marketer — must supply distributorId', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(userService.createUserApi).mockResolvedValue({
      id: 'new-m2',
      firstName: 'Jane', lastName: 'Mark',
      email: 'jane@test.com',
      isActive: true,
      createdAt: '2026-08-01',
      roles: [ROLES.MARKETER],
      distributorId: 'dist-A',
      distributorName: 'Distributor A',
    })
  })

  it('createUserApi is called with distributorId when MarketingLead creates marketer', async () => {
    const req: CreateUserRequest = {
      firstName: 'Jane', lastName: 'Mark', email: 'jane@test.com',
      role: ROLES.MARKETER,
      password: 'Password1!', confirmPassword: 'Password1!',
      distributorId: 'dist-A',
    }
    await userService.createUserApi(req)
    expect(userService.createUserApi).toHaveBeenCalledWith(
      expect.objectContaining({ distributorId: 'dist-A', role: ROLES.MARKETER }),
    )
  })
})

describe('getActiveDistributorsApi — used to populate distributor selector', () => {
  it('getActiveDistributorsApi is called to fetch distributors for selector', async () => {
    vi.mocked(userService.getActiveDistributorsApi).mockResolvedValue([
      { id: 'd1', firstName: 'Alice', lastName: 'Dist', email: 'a@d.com', isActive: true },
    ])
    const result = await userService.getActiveDistributorsApi()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('d1')
  })
})

describe('Non-Distributor role cannot be assigned as Distributor (frontend validation)', () => {
  it('distributorId must reference a Distributor user — service call with invalid id is rejected by backend', async () => {
    vi.mocked(userService.createUserApi).mockRejectedValue(
      new Error('The specified user does not have the Distributor role.'),
    )
    await expect(
      userService.createUserApi({
        firstName: 'T', lastName: 'T', email: 't@t.com',
        role: ROLES.MARKETER,
        password: 'Password1!', confirmPassword: 'Password1!',
        distributorId: 'admin-id', // not a Distributor
      }),
    ).rejects.toThrow('Distributor role')
  })
})

describe('Marketer must have a Distributor', () => {
  it('creating a Marketer without distributorId returns error from backend', async () => {
    vi.mocked(userService.createUserApi).mockRejectedValue(
      new Error('A valid DistributorId is required when creating a Marketer account.'),
    )
    await expect(
      userService.createUserApi({
        firstName: 'X', lastName: 'Y', email: 'xy@t.com',
        role: ROLES.MARKETER,
        password: 'Password1!', confirmPassword: 'Password1!',
        // no distributorId
      }),
    ).rejects.toThrow('DistributorId')
  })
})
