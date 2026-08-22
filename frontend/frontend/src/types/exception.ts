export type ExceptionSeverity = 'URGENT' | 'ATTENTION' | 'WATCH'
export type ExceptionStatus = 'OPEN' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'
export interface HrException {
  id: string; type: string; severity: ExceptionSeverity; status: ExceptionStatus; title: string; summary: string
  employeeId?: string; employeeName?: string; departmentName?: string; detectedAt: string
  evidence?: Record<string, unknown>; metrics?: Record<string, unknown>; aiExplanation?: string; recommendation?: string; actionUrl?: string
}
