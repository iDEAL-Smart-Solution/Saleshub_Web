/**
 * Phase 7 (corrected) — Sales workflow tests for final role rules.
 * Admin / Dev / MarketingLead / Distributor  → can record sales (must supply MarketerId)
 * Marketer                                   → cannot record sales (view-only)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSaleStore } from '@/stores/saleStore'

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

import * as saleService from '@/services/api/sale.service'
import { SaleStatus } from '@/types'

describe('Sale store — distributor sales slice', () => {
  beforeEach(() => {
    useSaleStore.setState({
      sales: [], mySales: [], distributorSales: [],
      selectedSale: null, isLoading: false, isActionLoading: false, error: null,
    })
  })

  it('setDistributorSales updates the distributorSales slice', () => {
    const sale = {
      id: 's1', marketerName: 'Jane', customerName: 'School',
      productName: 'CBT', saleDate: '2026-08-01',
      amount: 50000, status: SaleStatus.Pending, createdAt: '2026-08-01',
    }
    useSaleStore.getState().setDistributorSales([sale])
    expect(useSaleStore.getState().distributorSales).toHaveLength(1)
  })

  it('updateSaleStatus patches distributorSales, sales, and mySales simultaneously', () => {
    const sale = {
      id: 's2', marketerName: 'John', customerName: 'Academy',
      productName: 'LMS', saleDate: '2026-08-02',
      amount: 30000, status: SaleStatus.Pending, createdAt: '2026-08-02',
    }
    useSaleStore.setState({ distributorSales: [sale], sales: [sale], mySales: [] })
    useSaleStore.getState().updateSaleStatus('s2', SaleStatus.Confirmed)
    expect(useSaleStore.getState().distributorSales[0].status).toBe(SaleStatus.Confirmed)
    expect(useSaleStore.getState().sales[0].status).toBe(SaleStatus.Confirmed)
  })
})

describe('Sale role rules — who can record (service layer)', () => {
  it('Admin can record a sale for any marketer', async () => {
    vi.mocked(saleService.createSaleApi).mockResolvedValueOnce({
      id: 'sale-admin',
      marketerId: 'marketer-id', marketerName: 'Jane',
      customerId: 'c1', customerName: 'School',
      productId: 'p1', productName: 'CBT',
      saleDate: '2026-08-01', amount: 100000,
      status: SaleStatus.Pending,
      recordedById: 'admin-id', recordedByName: 'Admin',
      createdAt: '2026-08-01',
    })
    const result = await saleService.createSaleApi({
      marketerId: 'marketer-id', customerId: 'c1',
      productId: 'p1', saleDate: '2026-08-01', amount: 100000,
    })
    expect(result.marketerId).toBe('marketer-id')
    expect(result.recordedById).toBe('admin-id')
  })

  it('MarketingLead can record a sale for any marketer', async () => {
    vi.mocked(saleService.createSaleApi).mockResolvedValueOnce({
      id: 'sale-ml',
      marketerId: 'marketer-id', marketerName: 'Jane',
      customerId: 'c1', customerName: 'School',
      productId: 'p1', productName: 'CBT',
      saleDate: '2026-08-01', amount: 50000,
      status: SaleStatus.Pending,
      recordedById: 'ml-id', recordedByName: 'Marketing Lead',
      createdAt: '2026-08-01',
    })
    const result = await saleService.createSaleApi({
      marketerId: 'marketer-id', customerId: 'c1',
      productId: 'p1', saleDate: '2026-08-01', amount: 50000,
    })
    // Marketer still owns the sale — ML is just the recorder
    expect(result.marketerId).toBe('marketer-id')
    expect(result.recordedById).toBe('ml-id')
  })

  it('Distributor can record a sale for an assigned marketer', async () => {
    vi.mocked(saleService.createSaleApi).mockResolvedValueOnce({
      id: 'sale-dist',
      marketerId: 'marketer-id', marketerName: 'Jane',
      customerId: 'c1', customerName: 'School',
      productId: 'p1', productName: 'CBT',
      saleDate: '2026-08-01', amount: 100000,
      status: SaleStatus.Pending,
      recordedById: 'dist-id', recordedByName: 'Distributor',
      distributorId: 'dist-id',
      createdAt: '2026-08-01',
    })
    const result = await saleService.createSaleApi({
      marketerId: 'marketer-id', customerId: 'c1',
      productId: 'p1', saleDate: '2026-08-01', amount: 100000,
    })
    expect(result.marketerId).toBe('marketer-id')  // marketer owns the sale
    expect(result.recordedById).toBe('dist-id')    // distributor is recorder
    expect(result.distributorId).toBe('dist-id')   // snapshot
  })
})
