import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import Badge from '@/components/common/Badge'

describe('Badge', () => {
  it('renders label', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies danger variant classes', () => {
    const { container } = render(<Badge variant="danger">Error</Badge>)
    expect(container.firstChild).toHaveClass('bg-[#FFEBEE]')
  })

  it('renders dot when dot prop is true', () => {
    render(<Badge dot>Online</Badge>)
    // dot is aria-hidden so we look in container
    const dots = document.querySelectorAll('[aria-hidden="true"]')
    expect(dots.length).toBeGreaterThan(0)
  })
})
