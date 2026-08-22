import type { ReactNode } from 'react'
export function EmployeeHeader({ count, action }: { count: number; action?: ReactNode }) { return <div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-500">{count} employees</p>{action}</div> }
