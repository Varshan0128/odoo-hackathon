import type { DocumentItem } from '@/types'
import { api } from './api'

export const documentService = {
  async list() {
    const response = await api<{ data: DocumentItem[] }>('/documents')
    return response.data
  },
}
