type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'neutral' | 'info'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-[#E3F2FD] text-[#1565C0]',
  success: 'bg-[#E8F5E9] text-[#2E7D32]',
  danger:  'bg-[#FFEBEE] text-[#C62828]',
  warning: 'bg-[#FFF8E1] text-[#E65100]',
  neutral: 'bg-[#EEEEEE] text-[#616161]',
  info:    'bg-[#E8EAF6] text-[#283593]',
}

const dotClasses: Record<BadgeVariant, string> = {
  primary: 'bg-[#1565C0]',
  success: 'bg-[#2E7D32]',
  danger:  'bg-[#C62828]',
  warning: 'bg-[#E65100]',
  neutral: 'bg-[#616161]',
  info:    'bg-[#283593]',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
