import { NavLink } from 'react-router-dom'
import { LogOut, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { getNavigationForRole } from '@/constants/navigation'

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: LucideIcon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-[13.5px] font-medium transition-colors',
          isActive
            ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
            : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-ink)]'
        )
      }
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const { user, logout } = useAuth()
  const sections = getNavigationForRole(user?.role)

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] font-[var(--font-display)] text-sm font-semibold text-white">
            D
          </div>
          <div className="leading-tight">
            <p className="font-[var(--font-display)] text-[16px] font-semibold tracking-tight text-[var(--color-ink)]">
              Dayflow
            </p>
            <p className="text-[11px] text-[var(--color-ink-faint)]">HR Management</p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="rounded-md p-1 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-sunken)] lg:hidden"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {sections.map((section) => <div key={section.label}><p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">{section.label}</p><div className="space-y-0.5">{section.items.map((item) => <NavItem key={item.to} {...item} />)}</div></div>)}
        <div className="mt-auto border-t border-[var(--color-border)] pt-3"><button onClick={() => { void logout() }} className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-[13.5px] font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-sunken)]"><LogOut className="size-4" /> Logout</button></div>
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop / laptop: persistent sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:block">
        {content}
      </aside>

      {/* Mobile: drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[var(--color-ink)]/40" onClick={onCloseMobile} aria-hidden />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[var(--color-surface)] shadow-[var(--shadow-popover)]">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
