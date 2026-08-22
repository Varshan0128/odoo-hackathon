import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] px-6 py-14 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-[var(--color-surface-sunken)]">
        <Icon className="size-5 text-[var(--color-ink-muted)]" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--color-ink)]">{title}</p>
        {description && <p className="text-sm text-[var(--color-ink-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  )
}
