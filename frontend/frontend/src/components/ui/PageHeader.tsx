import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  breadcrumbs?: string[]
}

export function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-1.5 flex items-center gap-1 text-xs text-[var(--color-ink-muted)]">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3" />}
                {crumb}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">{title}</h1>
        {description && <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
