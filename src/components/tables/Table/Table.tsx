import type { ReactNode } from 'react'
import LoadingState from '@/components/feedback/LoadingState'
import EmptyState from '@/components/feedback/EmptyState'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  keyExtractor: (row: T) => string | number
  className?: string
}

export default function Table<T>({
  columns,
  data,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  keyExtractor,
  className = '',
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-[#EEEEEE] bg-white ${className}`}>
      <table className="w-full text-sm" role="table">
        <thead>
          <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={[
                  'px-4 py-3 text-left text-xs font-semibold text-[#757575] uppercase tracking-wide',
                  col.headerClassName ?? '',
                ].join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length}>
                <LoadingState message="Loading data…" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={['px-4 py-3 text-[#424242]', col.className ?? ''].join(' ')}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
