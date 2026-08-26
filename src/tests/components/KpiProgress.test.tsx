import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import KpiProgress from '@/features/kpi/components/KpiProgress'

describe('KpiProgress', () => {
  it('uses the supplied backend percentage', () => {
    render(<KpiProgress value={66.67} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '66.67')
    expect(screen.getByText('66.67%')).toBeInTheDocument()
  })
})
