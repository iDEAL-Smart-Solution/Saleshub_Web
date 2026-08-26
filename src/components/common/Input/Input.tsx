import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftAddon?: ReactNode
  rightAddon?: ReactNode
  wrapperClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftAddon,
      rightAddon,
      wrapperClassName = '',
      id,
      className = '',
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const errorId = inputId ? `${inputId}-error` : undefined
    const hintId = inputId ? `${inputId}-hint` : undefined

    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#424242]"
          >
            {label}
            {props.required && (
              <span className="text-[#D32F2F] ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 text-[#757575]" aria-hidden="true">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={
              [errorId, hintId].filter(Boolean).join(' ') || undefined
            }
            aria-invalid={!!error}
            className={[
              'w-full rounded-lg border bg-white text-sm text-[#212121]',
              'placeholder:text-[#9E9E9E]',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-[#1565C0]',
              'disabled:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:text-[#9E9E9E]',
              error
                ? 'border-[#D32F2F] focus:ring-[#D32F2F] focus:border-[#D32F2F]'
                : 'border-[#BDBDBD] hover:border-[#1565C0]',
              leftAddon ? 'pl-10' : 'pl-3',
              rightAddon ? 'pr-10' : 'pr-3',
              'py-2.5 h-10',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 text-[#757575]" aria-hidden="true">
              {rightAddon}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs text-[#D32F2F] flex items-center gap-1" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-[#757575]">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
