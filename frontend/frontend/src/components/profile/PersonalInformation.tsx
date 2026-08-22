import type { Employee } from '@/types'
export function PersonalInformation({ employee }: { employee: Employee }) { return <section><h2 className="font-semibold">Personal information</h2><p className="mt-2 text-sm text-slate-500">{employee.email} · {employee.phone || 'Phone not provided'}</p><p className="text-sm text-slate-500">{employee.address || 'Address not provided'}</p></section> }
