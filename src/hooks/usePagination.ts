import { useState } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
}

/**
 * Manages pagination state for table/list views.
 */
export function usePagination({ initialPage = 1, initialPageSize = 20 }: UsePaginationOptions = {}) {
  const [pageNumber, setPageNumber] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  function goToPage(page: number) {
    setPageNumber(page)
  }

  function changePageSize(size: number) {
    setPageSize(size)
    setPageNumber(1) // reset to first page when size changes
  }

  function reset() {
    setPageNumber(initialPage)
    setPageSize(initialPageSize)
  }

  return { pageNumber, pageSize, goToPage, changePageSize, reset }
}
