import type { LeaveRequest, LeaveStatus, LeaveType } from '@/types'
import { api } from './api'

export interface LeaveFilters {
  status?: LeaveStatus | 'All'
  employeeId?: string
  search?: string
  startDate?: string
  endDate?: string
}

export interface ApplyLeaveInput {
  type: LeaveType
  startDate: string
  endDate: string
  remarks?: string
}

export interface LeaveTypeOption {
  id: string
  name: string
  code: string
  isPaid: boolean
  annualAllocation: number
}

function queryString(filters: LeaveFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const value = params.toString()
  return value ? '?' + value : ''
}

export const leaveService = {
  async types() {
    const response = await api<{ data: LeaveTypeOption[] }>('/leaves/types')
    return response.data
  },
  async list(filters: LeaveFilters = {}) {
    const response = await api<{ data: LeaveRequest[] }>('/leaves' + queryString(filters))
    return response.data
  },
  async apply(input: ApplyLeaveInput) {
    const response = await api<{ data: LeaveRequest }>('/leaves', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return response.data
  },
  async decide(leaveId: string, status: 'Approved' | 'Rejected', comment?: string) {
    const response = await api<{ data: LeaveRequest }>('/leaves/' + encodeURIComponent(leaveId) + '/decision', {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    })
    return response.data
  },
}
