import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type {
  ActivityItem,
  AdminDashboardData,
  AttendanceRecord,
  DocumentItem,
  Employee,
  EmployeeDashboardData,
  LeaveRequest,
  SalaryStructure,
} from '@/types'
import { useAuth } from '@/lib/auth'
import { employeeService, type CreateEmployeeInput } from '@/services/employee.service'
import { attendanceService } from '@/services/attendance.service'
import { leaveService, type ApplyLeaveInput } from '@/services/leave.service'
import { payrollService, type PayrollInput } from '@/services/payroll.service'
import { activityService } from '@/services/activity.service'
import { documentService } from '@/services/document.service'
import { dashboardService, type DashboardPeriod } from '@/services/dashboard.service'

interface DataShape {
  employees: Employee[]
  attendance: AttendanceRecord[]
  leaveRequests: LeaveRequest[]
  salaries: SalaryStructure[]
  activity: ActivityItem[]
  documents: DocumentItem[]
  dashboard: AdminDashboardData | null
  employeeDashboard: EmployeeDashboardData | null
}

const emptyData: DataShape = {
  employees: [],
  attendance: [],
  leaveRequests: [],
  salaries: [],
  activity: [],
  documents: [],
  dashboard: null,
  employeeDashboard: null,
}

interface DataContextValue extends DataShape {
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  reloadDashboard: (period: DashboardPeriod) => Promise<void>
  addEmployee: (input: CreateEmployeeInput) => Promise<Employee>
  updateEmployee: (employeeId: string, patch: Partial<Employee>) => Promise<Employee>
  checkIn: () => Promise<AttendanceRecord>
  checkOut: () => Promise<AttendanceRecord>
  applyLeave: (input: ApplyLeaveInput) => Promise<LeaveRequest>
  approveLeave: (id: string, comment?: string) => Promise<LeaveRequest>
  rejectLeave: (id: string, comment?: string) => Promise<LeaveRequest>
  updateSalary: (employeeId: string, input: PayrollInput) => Promise<SalaryStructure>
  todayAttendanceFor: (employeeId: string) => AttendanceRecord | undefined
  weeklyAttendanceFor: (employeeId: string) => AttendanceRecord[]
}

const DataContext = createContext<DataContextValue | null>(null)

function dateInIndia() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== 'literal') result[part.type] = part.value
      return result
    }, {})
  return parts.year + '-' + parts.month + '-' + parts.day
}

function addDays(date: string, amount: number) {
  const values = date.split('-').map(Number)
  const next = new Date(Date.UTC(values[0], values[1] - 1, values[2] + amount))
  return next.toISOString().slice(0, 10)
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to load data. Please try again.'
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isRestoring } = useAuth()
  const [data, setData] = useState<DataShape>(emptyData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setData(emptyData)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    const today = dateInIndia()
    try {
      const results = await Promise.all([
        user.role === 'admin' ? employeeService.list() : employeeService.get(user.employeeId).then((employee) => [employee]),
        attendanceService.list({ startDate: addDays(today, -90), endDate: today }),
        leaveService.list(),
        payrollService.list(),
        activityService.list(),
        documentService.list(),
        user.role === 'admin' ? dashboardService.getAdmin() : dashboardService.getEmployee(),
      ])
      setData({
        employees: results[0],
        attendance: results[1],
        leaveRequests: results[2],
        salaries: results[3],
        activity: results[4],
        documents: results[5],
        dashboard: user.role === 'admin' ? (results[6] as AdminDashboardData) : null,
        employeeDashboard: user.role === 'employee' ? (results[6] as EmployeeDashboardData) : null,
      })
    } catch (requestError) {
      setData(emptyData)
      setError(errorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!isRestoring) void refresh()
  }, [isRestoring, refresh])

  const reloadDashboard = useCallback(
    async (period: DashboardPeriod) => {
      if (!user || user.role !== 'admin') return
      const dashboard = await dashboardService.getAdmin(period)
      setData((previous) => ({ ...previous, dashboard }))
    },
    [user],
  )

  const addEmployee = useCallback(
    async (input: CreateEmployeeInput) => {
      const employee = await employeeService.create(input)
      await refresh()
      return employee
    },
    [refresh],
  )

  const updateEmployee = useCallback(
    async (employeeId: string, patch: Partial<Employee>) => {
      const employee = await employeeService.update(employeeId, patch)
      await refresh()
      return employee
    },
    [refresh],
  )

  const checkIn = useCallback(async () => {
    const record = await attendanceService.checkIn()
    await refresh()
    return record
  }, [refresh])

  const checkOut = useCallback(async () => {
    const record = await attendanceService.checkOut()
    await refresh()
    return record
  }, [refresh])

  const applyLeave = useCallback(
    async (input: ApplyLeaveInput) => {
      const leave = await leaveService.apply(input)
      await refresh()
      return leave
    },
    [refresh],
  )

  const approveLeave = useCallback(
    async (id: string, comment?: string) => {
      const leave = await leaveService.decide(id, 'Approved', comment)
      await refresh()
      return leave
    },
    [refresh],
  )

  const rejectLeave = useCallback(
    async (id: string, comment?: string) => {
      const leave = await leaveService.decide(id, 'Rejected', comment)
      await refresh()
      return leave
    },
    [refresh],
  )

  const updateSalary = useCallback(
    async (employeeId: string, input: PayrollInput) => {
      const salary = await payrollService.save(employeeId, input)
      await refresh()
      return salary
    },
    [refresh],
  )

  const value = useMemo<DataContextValue>(
    () => ({
      ...data,
      loading,
      error,
      refresh,
      reloadDashboard,
      addEmployee,
      updateEmployee,
      checkIn,
      checkOut,
      applyLeave,
      approveLeave,
      rejectLeave,
      updateSalary,
      todayAttendanceFor: (employeeId) =>
        data.attendance.find((record) => record.employeeId === employeeId && record.date === dateInIndia()),
      weeklyAttendanceFor: (employeeId) =>
        data.attendance
          .filter((record) => record.employeeId === employeeId)
          .sort((left, right) => right.date.localeCompare(left.date))
          .slice(0, 7),
    }),
    [
      addEmployee,
      applyLeave,
      approveLeave,
      checkIn,
      checkOut,
      data,
      error,
      loading,
      refresh,
      rejectLeave,
      reloadDashboard,
      updateEmployee,
      updateSalary,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
