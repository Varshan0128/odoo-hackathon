import { BarChart3, Building2, CalendarCheck, CalendarClock, FolderOpen, LayoutGrid, Settings, ShieldCheck, Users, Wallet, type LucideIcon } from 'lucide-react'
import type { Role } from '@/types'

export interface NavigationItem { to: string; label: string; icon: LucideIcon }
export interface NavigationSection { label: string; items: NavigationItem[] }

const workspace = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/leave', label: 'Leave Management', icon: CalendarClock },
  { to: '/payroll', label: 'Payroll', icon: Wallet },
  { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/documents', label: 'Documents', icon: FolderOpen },
]

const management = [
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/roles', label: 'Roles & Permissions', icon: ShieldCheck },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const employeeWork = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/profile', label: 'My Profile', icon: Users },
  { to: '/attendance', label: 'My Attendance', icon: CalendarCheck },
  { to: '/leave', label: 'My Leave', icon: CalendarClock },
  { to: '/payroll', label: 'My Payroll', icon: Wallet },
  { to: '/documents', label: 'My Documents', icon: FolderOpen },
]

export function getNavigationForRole(role: Role | undefined): NavigationSection[] {
  if (role === 'admin') return [{ label: 'Workspace', items: workspace }, { label: 'Management', items: management }, { label: 'Account', items: [{ to: '/profile', label: 'My Profile', icon: Users }] }]
  return [{ label: 'My Work', items: employeeWork }, { label: 'Account', items: [{ to: '/settings', label: 'Settings', icon: Settings }] }]
}
