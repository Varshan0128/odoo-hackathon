import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: 'neutral' | 'success' | 'warning' | 'info'
  trend?: string
}

const toneClasses = {
  neutral: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
  success: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  info: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
}

export function KpiCard({ label, value, icon: Icon, tone = 'neutral', trend }: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[var(--color-ink-muted)]">{label}</p>
          <p className="mt-2 font-[var(--font-display)] text-[28px] font-semibold leading-none text-[var(--color-ink)]">
            {value}
          </p>
          {trend && <p className="mt-2 text-xs text-[var(--color-ink-muted)]">{trend}</p>}
        </div>
        <div className={cn('flex size-9 items-center justify-center rounded-[var(--radius-sm)]', toneClasses[tone])}>
          <Icon className="size-[18px]" />
        </div>
      </div>
    </Card>
  )
}
