import { Menu, Search, Bell, LogOut, Settings, User as UserIcon, Calendar, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useAuth } from '@/lib/auth'

export function TopHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-6">
      <button
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="rounded-md p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-sunken)] lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <label className="hidden max-w-sm flex-1 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)]/60 px-3 py-1.5 text-sm text-[var(--color-ink-faint)] focus-within:border-[var(--color-primary)] sm:flex">
        <Search className="size-4 shrink-0" />
        <input
          type="text"
          placeholder="Search employees, requests, documents..."
          className="w-full bg-transparent text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none"
        />
        <kbd className="hidden shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-ink-faint)] md:block">
          ⌘K
        </kbd>
      </label>

      <div className="hidden items-center gap-1.5 text-sm text-[var(--color-ink-muted)] md:flex">
        <Calendar className="size-4 text-[var(--color-ink-faint)]" />
        {today}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          aria-label="Notifications"
          className="relative rounded-md p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-sunken)]"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--color-danger)]" />
        </button>

        <Dropdown
          trigger={
            <button className="ml-1 flex items-center gap-2 rounded-[var(--radius-sm)] px-1.5 py-1 hover:bg-[var(--color-surface-sunken)]">
              <Avatar name={user?.name ?? ''} color={user?.avatarColor} size="sm" />
              <span className="hidden text-left sm:block">
                <span className="block text-[13px] font-medium leading-tight text-[var(--color-ink)]">{user?.name}</span>
                <span className="block text-[11px] leading-tight text-[var(--color-ink-muted)]">
                  {user?.role === 'admin' ? 'HR Manager' : user?.position}
                </span>
              </span>
              <ChevronDown className="hidden size-3.5 text-[var(--color-ink-faint)] sm:block" />
            </button>
          }
        >
          <DropdownItem onClick={() => navigate('/profile')}>
            <UserIcon className="size-4" /> View profile
          </DropdownItem>
          <DropdownItem onClick={() => navigate('/settings')}>
            <Settings className="size-4" /> Settings
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              logout()
              navigate('/signin')
            }}
            className="text-[var(--color-danger)]"
          >
            <LogOut className="size-4" /> Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}
