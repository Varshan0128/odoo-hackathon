import { Input } from '@/components/ui/Input'
export function AttendanceFilters({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <Input aria-label="Filter attendance" placeholder="Search employee ID" value={value} onChange={(event) => onChange(event.target.value)} /> }
