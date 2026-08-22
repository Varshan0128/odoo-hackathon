import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { employeeService } from '@/services/employee.service'
import type { Employee, EmployeeStatus, Role } from '@/types'

const statusTone: Record<EmployeeStatus, 'success' | 'info' | 'neutral'> = {
  Active: 'success',
  'On Leave': 'info',
  Inactive: 'neutral',
}

const defaultForm = {
  name: '',
  employeeId: '',
  email: '',
  password: '',
  department: '',
  position: '',
}

export function EmployeeDirectory() {
  const { employees, addEmployee, loading, error } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All')
  const [role, setRole] = useState<Role | 'All'>('All')
  const [status, setStatus] = useState<EmployeeStatus | 'All'>('All')
  const [addOpen, setAddOpen] = useState(false)
  const [records, setRecords] = useState<Employee[]>([])
  const [recordsLoading, setRecordsLoading] = useState(true)
  const [recordsError, setRecordsError] = useState('')

  const departments = useMemo(() => ['All', ...new Set(employees.map((employee) => employee.department).filter(Boolean))], [employees])
  const loadEmployees = useCallback(async () => {
    setRecordsLoading(true)
    setRecordsError('')
    try {
      setRecords(await employeeService.list({
        search: query.trim() || undefined,
        department,
        role,
        status,
      }))
    } catch (requestError) {
      setRecords([])
      setRecordsError(requestError instanceof Error ? requestError.message : 'Unable to load employees.')
    } finally {
      setRecordsLoading(false)
    }
  }, [department, query, role, status])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadEmployees() }, 200)
    return () => window.clearTimeout(timer)
  }, [loadEmployees])

  return (
    <div>
      <PageHeader
        title="Employees"
        description={employees.length + ' people in the organization.'}
        action={<Button size="sm" onClick={() => setAddOpen(true)}><UserPlus className="size-4" /> Add employee</Button>}
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
          <Input placeholder="Search name, ID, email, or department" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" />
        </div>
        <Select value={department} onChange={(event) => setDepartment(event.target.value)}>{departments.map((item) => <option key={item} value={item}>{item}</option>)}</Select>
        <div className="grid grid-cols-2 gap-3">
          <Select value={role} onChange={(event) => setRole(event.target.value as Role | 'All')}><option value="All">All roles</option><option value="admin">Admin</option><option value="employee">Employee</option></Select>
          <Select value={status} onChange={(event) => setStatus(event.target.value as EmployeeStatus | 'All')}><option value="All">All status</option><option value="Active">Active</option><option value="On Leave">On leave</option><option value="Inactive">Inactive</option></Select>
        </div>
      </div>

      {loading || recordsLoading ? <SkeletonTable rows={7} /> : error || recordsError ? (
        <EmptyState title="Unable to load employees" description={error || recordsError} />
      ) : records.length === 0 ? (
        <EmptyState title="No employees found" description="Try a different search term or filter." />
      ) : (
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Department</Th><Th>Role</Th><Th>Joined</Th><Th>Status</Th></tr></Thead>
          <tbody>
            {records.map((employee) => (
              <Tr key={employee.id} className="cursor-pointer" onClick={() => navigate('/employees/' + employee.employeeId)}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={employee.name} color={employee.avatarColor} size="sm" />
                    <div><p className="font-medium text-[var(--color-ink)]">{employee.name}</p><p className="text-xs text-[var(--color-ink-muted)]">{employee.employeeId} · {employee.email}</p></div>
                  </div>
                </Td>
                <Td className="text-[var(--color-ink-muted)]">{employee.department}</Td>
                <Td className="text-[var(--color-ink-muted)]">{employee.position}</Td>
                <Td className="text-[var(--color-ink-muted)]">{formatDate(employee.joinDate)}</Td>
                <Td><Badge tone={statusTone[employee.status]}>{employee.status}</Badge></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <AddEmployeeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={async (input) => {
          const employee = await addEmployee(input)
          await loadEmployees()
          toast(employee.name + ' was added.')
          setAddOpen(false)
        }}
      />
    </div>
  )
}

function AddEmployeeModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: typeof defaultForm) => Promise<void>
}) {
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.department.trim() || !form.position.trim()) {
      setError('Name, email, initial password, department, and position are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Enter a valid work email.')
      return
    }
    if (form.password.length < 8) {
      setError('The initial password must be at least 8 characters.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ ...form, employeeId: form.employeeId.trim() || undefined })
      setForm(defaultForm)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to add employee.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add employee"
      description="This creates an account and persistent employee profile."
      footer={<><Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button><Button onClick={() => { void submit() }} loading={submitting}>Add employee</Button></>}
    >
      <div className="space-y-3">
        <Input label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Employee ID (optional)" value={form.employeeId} onChange={(event) => setForm({ ...form, employeeId: event.target.value })} />
          <Input label="Department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
        </div>
        <Input label="Position" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} />
        <Input label="Work email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input label="Initial password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      </div>
    </Modal>
  )
}
