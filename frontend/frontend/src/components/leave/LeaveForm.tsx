import { Button } from '@/components/ui/Button'
export function LeaveForm({ onSubmit }: { onSubmit?: () => void }) { return <Button onClick={onSubmit}>Request leave</Button> }
