import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { LeaveStatusBadge } from './LeaveStatusBadge'
import type { LeaveRequest } from '@/types'
export function LeaveTable({ requests }: { requests: LeaveRequest[] }) { return <Table><Thead><Tr><Th>Employee</Th><Th>Type</Th><Th>Dates</Th><Th>Days</Th><Th>Status</Th></Tr></Thead><tbody>{requests.map((request) => <Tr key={request.id}><Td>{request.employeeName}</Td><Td>{request.type}</Td><Td>{request.startDate} – {request.endDate}</Td><Td>{request.days}</Td><Td><LeaveStatusBadge status={request.status} /></Td></Tr>)}</tbody></Table> }
