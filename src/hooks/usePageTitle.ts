import { useEffect } from 'react'

/**
 * Sets the document title. Appends the app name automatically.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} – iDEAL SalesHub` : 'iDEAL SalesHub'
    return () => {
      document.title = previous
    }
  }, [title])
}
