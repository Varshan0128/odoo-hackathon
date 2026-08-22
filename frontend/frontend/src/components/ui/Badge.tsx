import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-[var(--color-surface-sunken)] text-[var(--color-ink-muted)]',
  success: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  info: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className
      )}
      {...props}
    />
  )
}

/** Dot + label status indicator — never relies on color alone. */
export function StatusIndicator({ tone, label }: { tone: Tone; label: string }) {
  const dotClasses: Record<Tone, string> = {
    neutral: 'bg-[var(--color-ink-faint)]',
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger)]',
    info: 'bg-[var(--color-info)]',
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink)]">
      <span className={cn('size-1.5 rounded-full', dotClasses[tone])} aria-hidden />
      {label}
    </span>
  )
}
