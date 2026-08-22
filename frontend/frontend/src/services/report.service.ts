import type { AttendanceSeriesItem } from '@/types'
import { api } from './api'

export interface ReportSummary {
  startDate: string
  endDate: string
  totalEmployees: number
  attendanceSeries: AttendanceSeriesItem[]
  leaveDistribution: {
    approved: number
    pending: number
    rejected: number
  }
  totalNetPayroll: number
}

export const reportService = {
  async summary(startDate?: string, endDate?: string) {
    const params = new URLSearchParams()
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    const suffix = params.toString() ? '?' + params.toString() : ''
    const response = await api<{ data: ReportSummary }>('/reports/summary' + suffix)
    return response.data
  },
}
