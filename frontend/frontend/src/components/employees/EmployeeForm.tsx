import { Button } from '@/components/ui/Button'
export function EmployeeForm({ onSubmit }: { onSubmit?: () => void }) { return <div className="rounded border border-dashed border-[var(--color-border)] p-5"><p className="text-sm text-slate-500">Employee details can be managed from the employee directory.</p>{onSubmit && <Button className="mt-3" onClick={onSubmit}>Save employee</Button>}</div> }
