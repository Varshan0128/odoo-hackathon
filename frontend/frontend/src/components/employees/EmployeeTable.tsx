import { Link } from 'react-router-dom'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { Avatar } from '@/components/ui/Avatar'
import { EmployeeStatusBadge } from './EmployeeStatusBadge'
import type { Employee } from '@/types'
export function EmployeeTable({ employees }: { employees: Employee[] }) { return <Table><Thead><Tr><Th>Employee</Th><Th>Department</Th><Th>Position</Th><Th>Status</Th></Tr></Thead><tbody>{employees.map((employee) => <Tr key={employee.id}><Td><Link className="flex items-center gap-2 font-medium" to={`/employees/${employee.employeeId}`}><Avatar name={employee.name} color={employee.avatarColor} size="sm" />{employee.name}</Link></Td><Td>{employee.department}</Td><Td>{employee.position}</Td><Td><EmployeeStatusBadge status={employee.status} /></Td></Tr>)}</tbody></Table> }
