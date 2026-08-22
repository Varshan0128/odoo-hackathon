import { type SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id ?? props.name
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-[13px] font-medium text-[var(--color-ink)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-9 w-full appearance-none rounded-[var(--radius-sm)] border bg-white pl-3 pr-8 text-sm text-[var(--color-ink)]',
              error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-strong)] hover:border-[var(--color-ink-faint)]',
              'focus:outline-none focus-visible:border-[var(--color-primary)]',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
        </div>
        {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'
