import type { LucideIcon } from 'lucide-react'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { Card } from '@/components/ui/Card'

type Tone = 'neutral' | 'success' | 'info' | 'warning'

const TONE_STYLES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--color-primary-soft)', fg: 'var(--color-primary)' },
  success: { bg: 'var(--color-success-soft)', fg: 'var(--color-success)' },
  info: { bg: 'var(--color-info-soft)', fg: 'var(--color-info)' },
  warning: { bg: 'var(--color-warning-soft)', fg: 'var(--color-warning)' },
}

interface KpiCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  tone: Tone
  trend: string
  /** Optional trailing indicator, e.g. { direction: 'up', value: '12%', label: 'vs last month' } */
  change?: { direction: 'up' | 'down' | 'flat'; value: string; label: string }
}

export function KpiCard({ label, value, icon: Icon, tone, trend, change }: KpiCardProps) {
  const style = TONE_STYLES[tone]

  return (
    <Card className="flex items-start justify-between gap-3 p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)]"
          style={{ backgroundColor: style.bg, color: style.fg }}
        >
          <Icon className="size-[18px]" />
        </div>
        <div>
          <p className="text-[13px] text-[var(--color-ink-muted)]">{label}</p>
          <p className="mt-0.5 text-[22px] font-semibold leading-none text-[var(--color-ink)]">{value}</p>
          <p className="mt-1.5 text-xs text-[var(--color-ink-faint)]">{trend}</p>
        </div>
      </div>

      {change && (
        <div className="shrink-0 text-right">
          <span
            className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
              change.direction === 'up'
                ? 'text-[var(--color-success)]'
                : change.direction === 'down'
                  ? 'text-[var(--color-danger)]'
                  : 'text-[var(--color-ink-faint)]'
            }`}
          >
            {change.direction === 'up' && <ArrowUp className="size-3" />}
            {change.direction === 'down' && <ArrowDown className="size-3" />}
            {change.direction === 'flat' && <Minus className="size-3" />}
            {change.value}
          </span>
          <span className="mt-1 block text-[11px] text-[var(--color-ink-faint)]">{change.label}</span>
        </div>
      )}
    </Card>
  )
}