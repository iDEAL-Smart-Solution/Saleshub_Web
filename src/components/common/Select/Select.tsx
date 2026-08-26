import { forwardRef, type SelectHTMLAttributes } from 'react'
import type { SelectOption } from '@/types'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
  wrapperClassName?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder,
      wrapperClassName = '',
      id,
      className = '',
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const errorId = selectId ? `${selectId}-error` : undefined

    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#424242]">
            {label}
            {props.required && (
              <span className="text-[#D32F2F] ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          aria-describedby={errorId}
          aria-invalid={!!error}
          className={[
            'w-full rounded-lg border bg-white text-sm text-[#212121]',
            'px-3 py-2.5 h-10',
            'appearance-none',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-[#1565C0]',
            'disabled:bg-[#F5F5F5] disabled:cursor-not-allowed',
            error
              ? 'border-[#D32F2F] focus:ring-[#D32F2F]'
              : 'border-[#BDBDBD] hover:border-[#1565C0]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <p id={errorId} className="text-xs text-[#D32F2F]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#757575]">{hint}</p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'

export default Select
