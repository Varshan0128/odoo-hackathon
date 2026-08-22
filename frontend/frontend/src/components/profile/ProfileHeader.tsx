import { Avatar } from '@/components/ui/Avatar'
import type { Employee } from '@/types'
export function ProfileHeader({ employee }: { employee: Employee }) { return <div className="mb-6 flex items-center gap-4"><Avatar name={employee.name} color={employee.avatarColor} size="lg" /><div><h1 className="text-2xl font-semibold">{employee.name}</h1><p className="text-sm text-slate-500">{employee.position} · {employee.department}</p></div></div> }
