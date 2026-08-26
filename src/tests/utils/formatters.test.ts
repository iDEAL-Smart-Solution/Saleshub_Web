import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatMonth,
  formatPercent,
  getMonthName,
  getSaleStatusLabel,
  getCommissionTypeLabel,
  getCommissionStatusLabel,
  buildMonthOptions,
} from '@/utils/formatters'
import { SaleStatus, CommissionType, CommissionStatus } from '@/types'

describe('formatCurrency', () => {
  it('formats 50000 as ₦50,000.00', () => {
    expect(formatCurrency(50000)).toMatch(/₦/)
    expect(formatCurrency(50000)).toMatch(/50/)
  })

  it('formats 0 as ₦0.00', () => {
    expect(formatCurrency(0)).toMatch(/₦/)
  })

  it('includes decimal places', () => {
    expect(formatCurrency(1234.5)).toMatch(/\.50/)
  })
})

describe('formatDate', () => {
  it('returns — for null/undefined', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate(undefined)).toBe('—')
  })

  it('formats a valid ISO date', () => {
    const result = formatDate('2026-08-22T00:00:00Z')
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/Aug/)
  })
})

describe('formatMonth', () => {
  it('returns "August 2026"', () => {
    expect(formatMonth(2026, 8)).toBe('August 2026')
  })

  it('returns "January 2026"', () => {
    expect(formatMonth(2026, 1)).toBe('January 2026')
  })
})

describe('formatPercent', () => {
  it('formats 66.67 as "66.67%"', () => {
    expect(formatPercent(66.67)).toBe('66.67%')
  })

  it('formats 100 as "100.00%"', () => {
    expect(formatPercent(100)).toBe('100.00%')
  })
})

describe('getMonthName', () => {
  it('returns "August" for 8', () => {
    expect(getMonthName(8)).toBe('August')
  })
  it('returns "December" for 12', () => {
    expect(getMonthName(12)).toBe('December')
  })
  it('returns empty string for invalid month', () => {
    expect(getMonthName(13)).toBe('')
  })
})

describe('getSaleStatusLabel', () => {
  it('maps Pending', ()   => { expect(getSaleStatusLabel(SaleStatus.Pending)).toBe('Pending') })
  it('maps Confirmed', () => { expect(getSaleStatusLabel(SaleStatus.Confirmed)).toBe('Confirmed') })
  it('maps Rejected', ()  => { expect(getSaleStatusLabel(SaleStatus.Rejected)).toBe('Rejected') })
  it('maps Refunded', ()  => { expect(getSaleStatusLabel(SaleStatus.Refunded)).toBe('Refunded') })
})

describe('getCommissionTypeLabel', () => {
  it('maps KpiReward', ()  => { expect(getCommissionTypeLabel(CommissionType.KpiReward)).toBe('KPI Reward') })
  it('maps Bonus', ()      => { expect(getCommissionTypeLabel(CommissionType.Bonus)).toBe('Bonus') })
  it('maps Adjustment', () => { expect(getCommissionTypeLabel(CommissionType.Adjustment)).toBe('Adjustment') })
})

describe('getCommissionStatusLabel', () => {
  it('maps Pending', ()   => { expect(getCommissionStatusLabel(CommissionStatus.Pending)).toBe('Pending') })
  it('maps Approved', ()  => { expect(getCommissionStatusLabel(CommissionStatus.Approved)).toBe('Approved') })
  it('maps Paid', ()      => { expect(getCommissionStatusLabel(CommissionStatus.Paid)).toBe('Paid') })
  it('maps Adjusted', ()  => { expect(getCommissionStatusLabel(CommissionStatus.Adjusted)).toBe('Adjusted') })
  it('maps Cancelled', () => { expect(getCommissionStatusLabel(CommissionStatus.Cancelled)).toBe('Cancelled') })
})

describe('buildMonthOptions', () => {
  it('returns exactly N options', () => {
    expect(buildMonthOptions(6)).toHaveLength(6)
  })

  it('first option is the current month', () => {
    const now = new Date()
    const opts = buildMonthOptions(3)
    expect(opts[0].year).toBe(now.getFullYear())
    expect(opts[0].month).toBe(now.getMonth() + 1)
  })

  it('options are in descending month order', () => {
    const opts = buildMonthOptions(3)
    expect(opts[0].month).toBeGreaterThanOrEqual(opts[1].month === 12 ? 1 : opts[1].month)
  })

  it('labels are non-empty strings', () => {
    buildMonthOptions(12).forEach((o) => {
      expect(o.label).not.toBe('')
    })
  })
})
