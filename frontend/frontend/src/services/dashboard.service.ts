import type { AdminDashboardData, EmployeeDashboardData } from '@/types'
import { api } from './api'

export type DashboardPeriod = 'this_week' | 'last_week'

export const dashboardService = {
  async getAdmin(period: DashboardPeriod = 'this_week') {
    const response = await api<{ data: AdminDashboardData }>('/dashboard?period=' + period)
    return response.data
  },
  async getEmployee() {
    const response = await api<{ data: EmployeeDashboardData }>('/dashboard')
    return response.data
  },
}
