import { Input } from '@/components/ui/Input'
export function EmployeeFilters({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <Input placeholder="Search employees" value={value} onChange={(event) => onChange(event.target.value)} /> }
