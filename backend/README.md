# Backend API

## Auth
- `POST /auth/login` - public

## Users
- `GET /users/me` - employee or HR

## Employees
- `GET /employees` - HR only
- `GET /employees/:id` - own record or HR
- `PUT /employees/:id` - own record or HR

## Attendance
- `POST /attendance/checkin` - employee or HR
- `POST /attendance/checkout` - employee or HR
- `GET /attendance` - own record or HR

## Leave Requests
- `POST /leave-requests` - employee or HR
- `PUT /leave-requests/:id/decision` - HR only
- `GET /leave-requests` - own record or HR

## Payroll
- `GET /payroll/:userId` - own record or HR
- `PUT /payroll/:userId` - HR only

## Notifications
- `GET /notifications` - authenticated user

## Exceptions
- `GET /exceptions` - HR only
- `PUT /exceptions/:id/status` - HR only
