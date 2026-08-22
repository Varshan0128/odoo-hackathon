import type { ActivityItem } from '@/types'
import { api } from './api'

export const activityService = {
  async list(limit = 20) {
    const response = await api<{ data: ActivityItem[] }>('/activity?limit=' + limit)
    return response.data
  },
}
