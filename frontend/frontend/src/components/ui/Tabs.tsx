import { cn } from '@/lib/utils'

interface Tab {
  value: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn('flex items-center gap-1 border-b border-[var(--color-border)]', className)}>
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative px-3.5 py-2.5 text-sm font-medium transition-colors',
              active ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
            )}
          >
            {tab.label}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[var(--color-primary)]" />}
          </button>
        )
      })}
    </div>
  )
}
