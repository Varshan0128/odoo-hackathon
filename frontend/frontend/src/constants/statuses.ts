import type { AttendanceStatus, EmployeeStatus, LeaveStatus } from '@/types'
export const ATTENDANCE_STATUSES: AttendanceStatus[] = ['present', 'absent', 'half-day', 'leave']
export const EMPLOYEE_STATUSES: EmployeeStatus[] = ['Active', 'On Leave', 'Inactive']
export const LEAVE_STATUSES: LeaveStatus[] = ['Pending', 'Approved', 'Rejected']
