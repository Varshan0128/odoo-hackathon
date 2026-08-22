import { api, ApiError } from './api'
import type { HrException } from '@/types/exception'

export const exceptionService = {
  async list() { const response = await api<{ exceptions?: HrException[] }>('/exceptions'); return (response.exceptions ?? []).filter(Boolean).map((item) => ({ ...item, type: typeof item.type === 'string' ? item.type : 'HR_EXCEPTION', severity: item.severity ?? 'WATCH', status: item.status ?? 'OPEN', title: item.title || 'HR exception', summary: item.summary || 'Review the available evidence.' })) },
  async review(id: string) {
    try { return await api<{ exception: HrException }>(`/exceptions/${id}/review`, { method: 'POST' }) }
    catch (error) { if (!(error instanceof ApiError) || error.status !== 404) throw error; return api<{ exception: HrException }>(`/exceptions/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: 'investigating' }) }) }
  },
  async dismiss(id: string) {
    try { return await api<{ exception: HrException }>(`/exceptions/${id}/dismiss`, { method: 'POST' }) }
    catch (error) { if (!(error instanceof ApiError) || error.status !== 404) throw error; return api<{ exception: HrException }>(`/exceptions/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: 'ignored' }) }) }
  },
}
