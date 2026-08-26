import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from '@/components/common/Button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  action?: ReactNode
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-[#FFEBEE] flex items-center justify-center text-[#D32F2F]">
        <AlertTriangle size={22} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#212121]">{title}</h3>
        <p className="text-sm text-[#757575] mt-1">{message}</p>
      </div>
      {(onRetry || action) && (
        <div className="mt-2 flex items-center gap-3">
          {onRetry && (
            <Button size="sm" variant="secondary" onClick={onRetry}>
              Try again
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  )
}
