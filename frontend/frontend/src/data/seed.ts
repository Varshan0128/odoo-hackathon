/**
 * SEED / DEMO DATA
 * ------------------------------------------------------------------
 * This file exists ONLY to make the frontend demonstrable before the
 * backend + database are connected (Phase 2 of the build).
 *
 * Nothing in src/pages or src/components should import raw arrays
 * from here directly for anything other than the demo data provider
 * in src/lib/store.tsx — when the real API lands, only that store
 * needs to change.
 * ------------------------------------------------------------------
 */
import type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  SalaryStructure,
  ActivityItem,
} from '@/types'

export const seedEmployees: Employee[] = [
  {
    id: 'u1',
    employeeId: 'DF-1001',
    name: 'Ananya Rao',
    email: 'ananya.rao@dayflow.io',
    role: 'admin',
    department: 'Human Resources',
    position: 'HR Manager',
    avatarColor: '#43302A',
    status: 'Active',
    phone: '+91 98765 43210',
    address: 'Indiranagar, Bengaluru',
    joinDate: '2022-03-14',
  },
  {
    id: 'u2',
    employeeId: 'DF-1002',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@dayflow.io',
    role: 'employee',
    department: 'Engineering',
    position: 'Frontend Engineer',
    avatarColor: '#3F6A93',
    status: 'Active',
    phone: '+91 98765 11223',
    address: 'Koramangala, Bengaluru',
    joinDate: '2023-01-09',
  },
  {
    id: 'u3',
    employeeId: 'DF-1003',
    name: 'Priya Nair',
    email: 'priya.nair@dayflow.io',
    role: 'employee',
    department: 'Engineering',
    position: 'Backend Engineer',
    avatarColor: '#3F7D58',
    status: 'On Leave',
    phone: '+91 98765 22334',
    address: 'HSR Layout, Bengaluru',
    joinDate: '2021-11-02',
  },
  {
    id: 'u4',
    employeeId: 'DF-1004',
    name: 'Kabir Singh',
    email: 'kabir.singh@dayflow.io',
    role: 'employee',
    department: 'Design',
    position: 'Product Designer',
    avatarColor: '#B5772B',
    status: 'Active',
    phone: '+91 98765 33445',
    address: 'Whitefield, Bengaluru',
    joinDate: '2022-07-19',
  },
  {
    id: 'u5',
    employeeId: 'DF-1005',
    name: 'Meera Iyer',
    email: 'meera.iyer@dayflow.io',
    role: 'employee',
    department: 'Sales',
    position: 'Account Executive',
    avatarColor: '#B23B3B',
    status: 'Active',
    phone: '+91 98765 44556',
    address: 'Jayanagar, Bengaluru',
    joinDate: '2023-05-27',
  },
  {
    id: 'u6',
    employeeId: 'DF-1006',
    name: 'Arjun Verma',
    email: 'arjun.verma@dayflow.io',
    role: 'employee',
    department: 'Finance',
    position: 'Financial Analyst',
    avatarColor: '#6F6459',
    status: 'Inactive',
    phone: '+91 98765 55667',
    address: 'Marathahalli, Bengaluru',
    joinDate: '2020-09-01',
  },
]

export const seedAttendance: AttendanceRecord[] = [
  { id: 'a1', employeeId: 'DF-1002', date: '2026-08-22', status: 'present', checkIn: '09:02 AM' },
  { id: 'a2', employeeId: 'DF-1003', date: '2026-08-22', status: 'leave' },
  { id: 'a3', employeeId: 'DF-1004', date: '2026-08-22', status: 'present', checkIn: '08:55 AM' },
  { id: 'a4', employeeId: 'DF-1005', date: '2026-08-22', status: 'half-day', checkIn: '09:10 AM', checkOut: '01:30 PM' },
  { id: 'a5', employeeId: 'DF-1006', date: '2026-08-22', status: 'absent' },
  { id: 'a6', employeeId: 'DF-1002', date: '2026-08-21', status: 'present', checkIn: '09:00 AM', checkOut: '06:05 PM' },
  { id: 'a7', employeeId: 'DF-1002', date: '2026-08-20', status: 'present', checkIn: '09:12 AM', checkOut: '06:00 PM' },
  { id: 'a8', employeeId: 'DF-1002', date: '2026-08-19', status: 'present', checkIn: '08:58 AM', checkOut: '05:58 PM' },
  { id: 'a9', employeeId: 'DF-1002', date: '2026-08-18', status: 'half-day', checkIn: '09:05 AM', checkOut: '01:15 PM' },
]

export const seedLeaveRequests: LeaveRequest[] = [
  {
    id: 'l1',
    employeeId: 'DF-1003',
    employeeName: 'Priya Nair',
    department: 'Engineering',
    type: 'Sick',
    startDate: '2026-08-22',
    endDate: '2026-08-24',
    days: 3,
    remarks: 'Viral fever, doctor advised rest.',
    status: 'Pending',
    appliedOn: '2026-08-20',
  },
  {
    id: 'l2',
    employeeId: 'DF-1004',
    employeeName: 'Kabir Singh',
    department: 'Design',
    type: 'Paid',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    days: 3,
    remarks: 'Family function out of town.',
    status: 'Pending',
    appliedOn: '2026-08-19',
  },
  {
    id: 'l3',
    employeeId: 'DF-1002',
    employeeName: 'Rohan Mehta',
    department: 'Engineering',
    type: 'Paid',
    startDate: '2026-07-14',
    endDate: '2026-07-15',
    days: 2,
    remarks: 'Personal work.',
    status: 'Approved',
    comment: 'Approved, enjoy the break.',
    appliedOn: '2026-07-10',
  },
  {
    id: 'l4',
    employeeId: 'DF-1005',
    employeeName: 'Meera Iyer',
    department: 'Sales',
    type: 'Unpaid',
    startDate: '2026-06-02',
    endDate: '2026-06-02',
    days: 1,
    status: 'Rejected',
    comment: 'Critical client meeting scheduled that day.',
    appliedOn: '2026-05-29',
  },
]

export const seedSalaries: SalaryStructure[] = [
  { employeeId: 'DF-1002', basic: 65000, hra: 26000, allowances: 9000, deductions: 8500, netSalary: 91500, lastRevised: '2026-04-01' },
  { employeeId: 'DF-1003', basic: 72000, hra: 28800, allowances: 10000, deductions: 9200, netSalary: 101600, lastRevised: '2026-04-01' },
  { employeeId: 'DF-1004', basic: 58000, hra: 23200, allowances: 7500, deductions: 7100, netSalary: 81600, lastRevised: '2026-04-01' },
  { employeeId: 'DF-1005', basic: 50000, hra: 20000, allowances: 12000, deductions: 6300, netSalary: 75700, lastRevised: '2026-04-01' },
  { employeeId: 'DF-1006', basic: 60000, hra: 24000, allowances: 6000, deductions: 7400, netSalary: 82600, lastRevised: '2026-04-01' },
  { employeeId: 'DF-1001', basic: 80000, hra: 32000, allowances: 11000, deductions: 10400, netSalary: 112600, lastRevised: '2026-04-01' },
]

export const seedActivity: ActivityItem[] = [
  { id: 'ac1', type: 'leave_submitted', message: 'Priya Nair submitted a Sick leave request', timestamp: '2026-08-20T10:12:00' },
  { id: 'ac2', type: 'leave_submitted', message: 'Kabir Singh submitted a Paid leave request', timestamp: '2026-08-19T15:40:00' },
  { id: 'ac3', type: 'leave_approved', message: "Rohan Mehta's leave request was approved", timestamp: '2026-07-10T09:05:00' },
  { id: 'ac4', type: 'attendance', message: 'Meera Iyer checked in for the day', timestamp: '2026-08-22T09:10:00' },
  { id: 'ac5', type: 'employee_updated', message: "Kabir Singh's profile was updated", timestamp: '2026-08-15T11:22:00' },
]
