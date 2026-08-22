import { useMemo, useState } from 'react'
import { Bell, Calendar, ChevronDown, LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'

interface SearchResult {
  id: string
  label: string
  description: string
  route: string
}

export function TopHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { user, logout } = useAuth()
  const { employees, leaveRequests, documents } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const results = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return []
    const matches: SearchResult[] = []
    if (user?.role === 'admin') {
      employees.forEach((employee) => {
        if ([employee.name, employee.employeeId, employee.department, employee.email].join(' ').toLowerCase().includes(value)) {
          matches.push({ id: 'employee-' + employee.id, label: employee.name, description: employee.employeeId + ' · ' + employee.department, route: '/employees/' + employee.employeeId })
        }
      })
    }
    leaveRequests.forEach((request) => {
      if ([request.employeeName, request.employeeId, request.type, request.status].join(' ').toLowerCase().includes(value)) {
        matches.push({ id: 'leave-' + request.id, label: request.employeeName + ' · ' + request.type + ' leave', description: request.status, route: '/leave' })
      }
    })
    documents.forEach((document) => {
      if (document.name.toLowerCase().includes(value)) {
        matches.push({ id: 'document-' + document.id, label: document.name, description: 'Document', route: '/documents' })
      }
    })
    return matches.slice(0, 6)
  }, [documents, employees, leaveRequests, query, user?.role])

  const selectResult = (result: SearchResult) => {
    setQuery('')
    navigate(result.route)
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-6">
      <button onClick={onOpenMobileNav} aria-label="Open navigation" className="rounded-md p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-sunken)] lg:hidden"><Menu className="size-5" /></button>
      <div className="relative hidden max-w-sm flex-1 sm:block">
        <label className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)]/60 px-3 py-1.5 text-sm text-[var(--color-ink-faint)] focus-within:border-[var(--color-primary)]">
          <Search className="size-4 shrink-0" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search available records…" className="w-full bg-transparent text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none" />
        </label>
        {query.trim() && (
          <div className="absolute top-[calc(100%+6px)] z-40 w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white py-1 shadow-[var(--shadow-popover)]">
            {results.length === 0 ? <p className="px-3 py-3 text-sm text-[var(--color-ink-muted)]">No matching records.</p> : results.map((result) => (
              <button key={result.id} onMouseDown={(event) => event.preventDefault()} onClick={() => selectResult(result)} className="block w-full px-3 py-2 text-left hover:bg-[var(--color-surface-sunken)]">
                <span className="block text-sm font-medium text-[var(--color-ink)]">{result.label}</span>
                <span className="block text-xs text-[var(--color-ink-muted)]">{result.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="hidden items-center gap-1.5 text-sm text-[var(--color-ink-muted)] md:flex"><Calendar className="size-4 text-[var(--color-ink-faint)]" />{today}</div>
      <div className="ml-auto flex items-center gap-1.5">
        <button aria-label="Notifications" className="rounded-md p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-sunken)]"><Bell className="size-[18px]" /></button>
        <Dropdown
          trigger={<button className="ml-1 flex items-center gap-2 rounded-[var(--radius-sm)] px-1.5 py-1 hover:bg-[var(--color-surface-sunken)]"><Avatar name={user?.name ?? ''} color={user?.avatarColor} size="sm" /><span className="hidden text-left sm:block"><span className="block text-[13px] font-medium leading-tight text-[var(--color-ink)]">{user?.name}</span><span className="block text-[11px] leading-tight text-[var(--color-ink-muted)]">{user?.position}</span></span><ChevronDown className="hidden size-3.5 text-[var(--color-ink-faint)] sm:block" /></button>}
        >
          <DropdownItem onClick={() => navigate('/profile')}><UserIcon className="size-4" /> View profile</DropdownItem>
          <DropdownItem onClick={() => navigate('/settings')}><Settings className="size-4" /> Settings</DropdownItem>
          <DropdownItem onClick={() => { void logout().then(() => navigate('/signin')) }} className="text-[var(--color-danger)]"><LogOut className="size-4" /> Log out</DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}
