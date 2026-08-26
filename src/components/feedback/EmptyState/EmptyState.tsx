import type { ReactNode } from 'react'
import { InboxIcon } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export default function EmptyState({
  title = 'No data found',
  description = 'There is nothing to display here yet.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-[#E3F2FD] flex items-center justify-center text-[#1565C0]">
        {icon ?? <InboxIcon size={22} />}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#212121]">{title}</h3>
        <p className="text-sm text-[#757575] mt-1">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
