/**
 * DEMO DATA STORE
 * ------------------------------------------------------------------
 * Frontend-only stand-in for the real backend (Phase "Backend API +
 * Database" of the build). It exposes the exact same shape of state
 * and actions a real API client would: reads return data, writes
 * mutate state and persist, and the whole app re-renders from a
 * single source of truth — so when the real API is wired in, only
 * the internals of these functions change (fetch calls instead of
 * array mutation), not the pages that consume them.
 *
 * Persists to localStorage under "dayflow:data" purely so a demo
 * doesn't reset on refresh. This is NOT a substitute for a database.
 * ------------------------------------------------------------------
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  SalaryStructure,
  ActivityItem,
  EmployeeStatus,
} from '@/types'
import {
  seedEmployees,
  seedAttendance,
  seedLeaveRequests,
  seedSalaries,
  seedActivity,
} from '@/data/seed'

const STORAGE_KEY = 'dayflow:data'

interface DataShape {
  employees: Employee[]
  attendance: AttendanceRecord[]
  leaveRequests: LeaveRequest[]
  salaries: SalaryStructure[]
  activity: ActivityItem[]
}

function loadInitial(): DataShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fall through to seed */
  }
  return {
    employees: seedEmployees,
    attendance: seedAttendance,
    leaveRequests: seedLeaveRequests,
    salaries: seedSalaries,
    activity: seedActivity,
  }
}

interface DataContextValue extends DataShape {
  addEmployee: (e: Omit<Employee, 'id'>) => void
  updateEmployee: (employeeId: string, patch: Partial<Employee>) => void
  checkIn: (employeeId: string) => void
  checkOut: (employeeId: string) => void
  applyLeave: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'days'>) => void
  approveLeave: (id: string, comment?: string) => void
  rejectLeave: (id: string, comment?: string) => void
  updateSalary: (employeeId: string, patch: Partial<SalaryStructure>) => void
  todayAttendanceFor: (employeeId: string) => AttendanceRecord | undefined
  weeklyAttendanceFor: (employeeId: string) => AttendanceRecord[]
}

const DataContext = createContext<DataContextValue | null>(null)

const todayIso = () => new Date().toISOString().slice(0, 10)

function pushActivity(list: ActivityItem[], item: Omit<ActivityItem, 'id' | 'timestamp'>) {
  const entry: ActivityItem = {
    ...item,
    id: `ac${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
  return [entry, ...list].slice(0, 20)
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataShape>(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<DataContextValue>(() => ({
    ...state,

    addEmployee: (e) =>
      setState((s) => ({
        ...s,
        employees: [...s.employees, { ...e, id: `u${Date.now()}` }],
        activity: pushActivity(s.activity, {
          type: 'employee_updated',
          message: `${e.name} was added to the organization`,
        }),
      })),

    updateEmployee: (employeeId, patch) =>
      setState((s) => ({
        ...s,
        employees: s.employees.map((emp) =>
          emp.employeeId === employeeId ? { ...emp, ...patch } : emp
        ),
        activity: pushActivity(s.activity, {
          type: 'employee_updated',
          message: `${patch.name ?? employeeId}'s profile was updated`,
        }),
      })),

    checkIn: (employeeId) =>
      setState((s) => {
        const date = todayIso()
        const existing = s.attendance.find(
          (r) => r.employeeId === employeeId && r.date === date
        )
        const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        const attendance = existing
          ? s.attendance.map((r) => (r === existing ? { ...r, checkIn: time, status: 'present' as const } : r))
          : [...s.attendance, { id: `a${Date.now()}`, employeeId, date, status: 'present' as const, checkIn: time }]
        return {
          ...s,
          attendance,
          activity: pushActivity(s.activity, { type: 'attendance', message: `${employeeId} checked in at ${time}` }),
        }
      }),

    checkOut: (employeeId) =>
      setState((s) => {
        const date = todayIso()
        const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        return {
          ...s,
          attendance: s.attendance.map((r) =>
            r.employeeId === employeeId && r.date === date ? { ...r, checkOut: time } : r
          ),
          activity: pushActivity(s.activity, { type: 'attendance', message: `${employeeId} checked out at ${time}` }),
        }
      }),

    applyLeave: (req) =>
      setState((s) => {
        const start = new Date(req.startDate)
        const end = new Date(req.endDate)
        const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1)
        const entry: LeaveRequest = {
          ...req,
          id: `l${Date.now()}`,
          status: 'Pending',
          appliedOn: todayIso(),
          days,
        }
        return {
          ...s,
          leaveRequests: [entry, ...s.leaveRequests],
          activity: pushActivity(s.activity, {
            type: 'leave_submitted',
            message: `${req.employeeName} submitted a ${req.type} leave request`,
          }),
        }
      }),

    approveLeave: (id, comment) =>
      setState((s) => {
        const req = s.leaveRequests.find((r) => r.id === id)
        return {
          ...s,
          leaveRequests: s.leaveRequests.map((r) =>
            r.id === id ? { ...r, status: 'Approved' as const, comment } : r
          ),
          activity: req
            ? pushActivity(s.activity, { type: 'leave_approved', message: `${req.employeeName}'s leave request was approved` })
            : s.activity,
        }
      }),

    rejectLeave: (id, comment) =>
      setState((s) => {
        const req = s.leaveRequests.find((r) => r.id === id)
        return {
          ...s,
          leaveRequests: s.leaveRequests.map((r) =>
            r.id === id ? { ...r, status: 'Rejected' as const, comment } : r
          ),
          activity: req
            ? pushActivity(s.activity, { type: 'leave_rejected', message: `${req.employeeName}'s leave request was rejected` } as any)
            : s.activity,
        }
      }),

    updateSalary: (employeeId, patch) =>
      setState((s) => ({
        ...s,
        salaries: s.salaries.map((sal) => {
          if (sal.employeeId !== employeeId) return sal
          const next = { ...sal, ...patch }
          next.netSalary = next.basic + next.hra + next.allowances - next.deductions
          return next
        }),
      })),

    todayAttendanceFor: (employeeId) =>
      state.attendance.find((r) => r.employeeId === employeeId && r.date === todayIso()),

    weeklyAttendanceFor: (employeeId) =>
      state.attendance
        .filter((r) => r.employeeId === employeeId)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 7),
  }), [state])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

export type { EmployeeStatus }
