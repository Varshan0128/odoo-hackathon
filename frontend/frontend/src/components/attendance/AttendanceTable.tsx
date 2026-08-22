import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import type { AttendanceRecord } from '@/types'
export function AttendanceTable({ records }: { records: AttendanceRecord[] }) { return <Table><Thead><Tr><Th>Date</Th><Th>Employee</Th><Th>Status</Th><Th>Check in</Th><Th>Check out</Th></Tr></Thead><tbody>{records.map((record) => <Tr key={record.id}><Td>{record.date}</Td><Td>{record.employeeId}</Td><Td>{record.status}</Td><Td>{record.checkIn ?? '—'}</Td><Td>{record.checkOut ?? '—'}</Td></Tr>)}</tbody></Table> }
