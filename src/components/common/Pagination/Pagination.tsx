import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalCount?: number
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalCount,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = buildPageNumbers(currentPage, totalPages)

  const from = pageSize && totalCount ? (currentPage - 1) * pageSize + 1 : null
  const to   = pageSize && totalCount ? Math.min(currentPage * pageSize, totalCount) : null

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}
    >
      {from !== null && to !== null && totalCount !== undefined && (
        <p className="text-xs text-[#757575]">
          Showing <span className="font-medium text-[#212121]">{from}–{to}</span> of{' '}
          <span className="font-medium text-[#212121]">{totalCount}</span> results
        </p>
      )}

      <ul className="flex items-center gap-1" role="list">
        {/* Prev */}
        <li>
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#EEEEEE]
              text-[#757575] hover:border-[#1565C0] hover:text-[#1565C0]
              disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {pages.map((p, i) =>
          p === '...' ? (
            <li key={`ellipsis-${i}`} aria-hidden="true">
              <span className="flex items-center justify-center w-8 h-8 text-sm text-[#757575]">
                …
              </span>
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                aria-label={`Page ${p}`}
                aria-current={p === currentPage ? 'page' : undefined}
                onClick={() => onPageChange(p as number)}
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                  p === currentPage
                    ? 'bg-[#1565C0] text-white border border-[#1565C0]'
                    : 'border border-[#EEEEEE] text-[#424242] hover:border-[#1565C0] hover:text-[#1565C0]',
                ].join(' ')}
              >
                {p}
              </button>
            </li>
          ),
        )}

        {/* Next */}
        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#EEEEEE]
              text-[#757575] hover:border-[#1565C0] hover:text-[#1565C0]
              disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  )
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }
  if (current < total - 2) pages.push('...')

  pages.push(total)
  return pages
}
