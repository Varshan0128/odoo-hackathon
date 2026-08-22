import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-[var(--color-ink)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-9 w-full rounded-[var(--radius-sm)] border bg-white px-3 text-sm text-[var(--color-ink)]',
            'placeholder:text-[var(--color-ink-faint)] transition-colors',
            error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-strong)] hover:border-[var(--color-ink-faint)]',
            'focus:outline-none focus-visible:border-[var(--color-primary)]',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className="text-xs text-[var(--color-danger)]">
            {error}
          </span>
        )}
        {!error && hint && (
          <span id={`${inputId}-hint`} className="text-xs text-[var(--color-ink-muted)]">
            {hint}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
