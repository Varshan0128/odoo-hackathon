import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { RedirectIfAuthed, RequireAdmin, RequireAuth, RequireEmployee } from './guards'
import { SignIn } from '@/pages/auth/Login'
import { SignUp } from '@/pages/auth/Signup'
import { VerifyEmail } from '@/pages/auth/VerifyEmail'
import { Dashboard } from '@/pages/Dashboard'
import { Attendance } from '@/pages/Attendance'
import { EmployeeDirectory } from '@/pages/EmployeeDirectory'
import { EmployeeProfile } from '@/pages/EmployeeProfile'
import { MyLeave } from '@/pages/MyLeave'
import { AdminLeaveApproval } from '@/pages/AdminLeaveApproval'
import AdminPayroll from '@/pages/admin/Payroll'
import Reports from '@/pages/admin/Reports'
import AdminSettings from '@/pages/admin/Settings'
import AdminDocuments from '@/pages/admin/Documents'
import EmployeePayroll from '@/pages/employee/Payroll'
import EmployeeDocuments from '@/pages/employee/Documents'
import EmployeeSettings from '@/pages/employee/Settings'
import { NotFound } from '@/pages/common/NotFound'
import { Unauthorized } from '@/pages/common/Unauthorized'
import { useAuth } from '@/lib/auth'

function SelfProfile() { const { user } = useAuth(); return <EmployeeProfile forceEmployeeId={user?.employeeId} /> }
function PayrollRoute() { const { user } = useAuth(); return user?.role === 'admin' ? <AdminPayroll /> : <EmployeePayroll /> }
function LeaveRoute() { const { user } = useAuth(); return user?.role === 'admin' ? <AdminLeaveApproval /> : <MyLeave /> }
function DocumentsRoute() { const { user } = useAuth(); return user?.role === 'admin' ? <AdminDocuments /> : <EmployeeDocuments /> }
function SettingsRoute() { const { user } = useAuth(); return user?.role === 'admin' ? <AdminSettings /> : <EmployeeSettings /> }
export function AppRoutes() { return <Routes>
  <Route path="/signin" element={<RedirectIfAuthed><SignIn /></RedirectIfAuthed>} />
  <Route path="/signup" element={<RedirectIfAuthed><SignUp /></RedirectIfAuthed>} />
  <Route path="/verify-email" element={<VerifyEmail />} />
  <Route element={<RequireAuth><AppShell /></RequireAuth>}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/attendance" element={<Attendance />} />
    <Route path="/employees" element={<RequireAdmin><EmployeeDirectory /></RequireAdmin>} />
    <Route path="/employees/:employeeId" element={<RequireAdmin><EmployeeProfile /></RequireAdmin>} />
    <Route path="/leave" element={<LeaveRoute />} />
    <Route path="/payroll" element={<PayrollRoute />} />
    <Route path="/profile" element={<SelfProfile />} />
    <Route path="/documents" element={<DocumentsRoute />} />
    <Route path="/reports" element={<RequireAdmin><Reports /></RequireAdmin>} />
    <Route path="/settings" element={<SettingsRoute />} />
    <Route path="/departments" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
    <Route path="/roles" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
  </Route>
  <Route path="/hr/dashboard" element={<RequireAuth><RequireAdmin><Navigate to="/dashboard" replace /></RequireAdmin></RequireAuth>} />
  <Route path="/hr/employees" element={<RequireAuth><RequireAdmin><Navigate to="/employees" replace /></RequireAdmin></RequireAuth>} />
  <Route path="/hr/attendance" element={<RequireAuth><RequireAdmin><Navigate to="/attendance" replace /></RequireAdmin></RequireAuth>} />
  <Route path="/hr/leave" element={<RequireAuth><RequireAdmin><Navigate to="/leave" replace /></RequireAdmin></RequireAuth>} />
  <Route path="/hr/payroll" element={<RequireAuth><RequireAdmin><Navigate to="/payroll" replace /></RequireAdmin></RequireAuth>} />
  <Route path="/hr/reports" element={<RequireAuth><RequireAdmin><Navigate to="/reports" replace /></RequireAdmin></RequireAuth>} />
  <Route path="/employee/dashboard" element={<RequireAuth><RequireEmployee><Navigate to="/dashboard" replace /></RequireEmployee></RequireAuth>} />
  <Route path="/employee/profile" element={<RequireAuth><RequireEmployee><Navigate to="/profile" replace /></RequireEmployee></RequireAuth>} />
  <Route path="/employee/attendance" element={<RequireAuth><RequireEmployee><Navigate to="/attendance" replace /></RequireEmployee></RequireAuth>} />
  <Route path="/employee/leave" element={<RequireAuth><RequireEmployee><Navigate to="/leave" replace /></RequireEmployee></RequireAuth>} />
  <Route path="/employee/payroll" element={<RequireAuth><RequireEmployee><Navigate to="/payroll" replace /></RequireEmployee></RequireAuth>} />
  <Route path="/employee/documents" element={<RequireAuth><RequireEmployee><Navigate to="/documents" replace /></RequireEmployee></RequireAuth>} />
  <Route path="/employee/settings" element={<RequireAuth><RequireEmployee><Navigate to="/settings" replace /></RequireEmployee></RequireAuth>} />
  <Route path="/unauthorized" element={<Unauthorized />} />
  <Route path="/404" element={<NotFound />} />
  <Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes> }
