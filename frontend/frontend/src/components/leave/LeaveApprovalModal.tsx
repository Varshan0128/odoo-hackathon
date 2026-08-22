import { Button } from '@/components/ui/Button'
export function LeaveApprovalModal({ onApprove, onReject }: { onApprove: () => void; onReject: () => void }) { return <div className="flex gap-2"><Button onClick={onApprove}>Approve</Button><Button variant="danger" onClick={onReject}>Reject</Button></div> }
