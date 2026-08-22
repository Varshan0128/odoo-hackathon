# Dayflow HRMS

Dayflow is a role-aware HRMS built for the Odoo × NMIT Bangalore Hackathon. The backend database is the application source of truth: the frontend never seeds, stores, or mutates business records locally.

## Run locally

1. Create `backend/.env` from `backend/.env.example` and set:

   ```env
   DATABASE_URL=postgresql://...
   JWT_SECRET=use-a-long-random-secret
   PORT=5000
   FRONTEND_ORIGIN=http://localhost:5173
   ```

2. Start the API:

   ```powershell
   cd backend
   npm ci
   npm start
   ```

   On startup, the API applies non-destructive `CREATE TABLE IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` statements for the Dayflow tables it owns. Existing `User`, `EmployeeProfile`, `AttendanceRecord`, and `LeaveRequest` data is preserved.

3. Start the UI:

   ```powershell
   cd frontend/frontend
   npm ci
   npm run dev
   ```

   Vite proxies `/api` to `http://localhost:5000` by default. Set `VITE_API_URL` only when the UI is deployed separately from the API.

## Data flow

| Flow | UI → API → database |
| --- | --- |
| Authentication | Sign up/sign in → `/api/auth/*` → `User`, `EmployeeProfile`, `AuthSession` |
| Employees | Directory/profile → `/api/employees` → `User`, `EmployeeProfile` |
| Attendance | Check in/out and history → `/api/attendance/*` → `AttendanceRecord`, `ActivityLog` |
| Leave | Apply/review → `/api/leaves/*` → `LeaveRequest`, `ActivityLog` |
| Payroll | HR setup / employee read-only view → `/api/payroll/*` → `PayrollRecord`, `ActivityLog` |
| Dashboard/reports | Role-aware dashboards → `/api/dashboard`, `/api/reports/summary` → calculated from persisted tables |

The frontend refreshes affected data after every successful mutation, so cross-page and cross-role state remains consistent after a browser refresh.

## Role behavior

- Administrators can manage employees, review all attendance and leave requests, edit payroll, and view reports.
- Employees can only access their own profile, attendance, leave, payroll, documents, and activity.
- Backend authorization validates every protected request; frontend route guards are only an additional UX boundary.

## Intentional limitations

- Document upload is not exposed because the supplied backend did not include a safe file-upload/storage API. Stored document rows, if any, are displayed.
- Persistent settings, department management, and role-configuration APIs are not provided by the supplied schema, so those routes show an explicit unavailable state.
- Email delivery/password reset is not configured in the supplied backend.

## Verification

```powershell
cd backend
npm test
npm run check

cd ../frontend/frontend
npm run build
```
