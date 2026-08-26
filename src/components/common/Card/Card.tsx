import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  noPadding?: boolean
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  action?: ReactNode
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function Card({ children, noPadding = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#EEEEEE] shadow-sm ${noPadding ? '' : 'p-6'} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ title, subtitle, action, className = '', ...props }: CardHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 mb-4 ${className}`}
      {...props}
    >
      <div>
        <h3 className="text-base font-semibold text-[#212121]">{title}</h3>
        {subtitle && <p className="text-sm text-[#757575] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

function CardBody({ children, className = '', ...props }: CardBodyProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody

export default Card
