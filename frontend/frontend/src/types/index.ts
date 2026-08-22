export type Role = 'admin' | 'employee'

export interface User {
  id: string
  employeeId: string
  name: string
  email: string
  role: Role
  department: string
  position: string
  avatarColor: string
}

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave'

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string // ISO date
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
}

export type LeaveType = 'Paid' | 'Sick' | 'Unpaid'
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected'

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  type: LeaveType
  startDate: string
  endDate: string
  days: number
  remarks?: string
  status: LeaveStatus
  comment?: string
  appliedOn: string
}

export interface SalaryStructure {
  employeeId: string
  basic: number
  hra: number
  allowances: number
  deductions: number
  netSalary: number
  lastRevised: string
}

export interface ActivityItem {
  id: string
  type: 'leave_submitted' | 'leave_approved' | 'leave_rejected' | 'attendance' | 'employee_updated'
  message: string
  timestamp: string
}

export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive'

export interface Employee extends User {
  status: EmployeeStatus
  phone: string
  address: string
  joinDate: string
}
