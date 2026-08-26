type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
}

export default function Spinner({ size = 'md', className = '', label = 'Loading…' }: SpinnerProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={[
        'inline-block rounded-full',
        'border-[#BBDEFB] border-t-[#1565C0]',
        'animate-spin',
        sizeClasses[size],
        className,
      ].join(' ')}
    />
  )
}
