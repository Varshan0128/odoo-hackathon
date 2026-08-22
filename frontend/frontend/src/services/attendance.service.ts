import type { AttendanceRecord } from '@/types'
import { api } from './api'

export interface AttendanceFilters {
  date?: string
  startDate?: string
  endDate?: string
  employeeId?: string
}

function queryString(filters: AttendanceFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const value = params.toString()
  return value ? '?' + value : ''
}

export const attendanceService = {
  async list(filters: AttendanceFilters = {}) {
    const response = await api<{ data: AttendanceRecord[] }>('/attendance' + queryString(filters))
    return response.data
  },
  async checkIn() {
    const response = await api<{ data: AttendanceRecord }>('/attendance/check-in', { method: 'POST' })
    return response.data
  },
  async checkOut() {
    const response = await api<{ data: AttendanceRecord }>('/attendance/check-out', { method: 'POST' })
    return response.data
  },
}
