import type { Employee } from '@/types'
export function JobInformation({ employee }: { employee: Employee }) { return <section><h2 className="font-semibold">Job information</h2><p className="mt-2 text-sm text-slate-500">{employee.position} · {employee.department}</p><p className="text-sm text-slate-500">Joined {employee.joinDate}</p></section> }
