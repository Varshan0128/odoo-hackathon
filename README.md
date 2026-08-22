# Dayflow HRMS

Dayflow is a role-aware Human Resources Management System built for the Odoo × NMIT Bangalore Hackathon. It provides HR and employee experiences for authentication, employee records, attendance, leave, payroll, notifications, reports, and exception review.

## Services

| Service | URL | Purpose |
| --- | --- | --- |
| Frontend | http://localhost:5173 | React/Vite web application |
| Backend | http://localhost:5000 | Express REST API |
| Odoo | http://localhost:8069 | Local Odoo server |
| PostgreSQL | localhost:5432 | Odoo database server |

Dayflow application data uses the database configured in `backend/.env`. Odoo is a separate service and requires PostgreSQL.

## Requirements

- Windows 10 or later
- Node.js and npm
- PostgreSQL 18 or a compatible version
- Odoo 19

Check installations:

```powershell
node --version
npm --version
psql --version
```

## Project structure

```text
odoo-hackathon/
├── backend/                 Express API and Prisma database code
│   ├── controllers/         Request handlers
│   ├── middleware/          Authentication and authorization
│   ├── prisma/              Schema and seed data
│   ├── routes/              API routes
│   └── index.js             API entry point
├── frontend/frontend/       React and Vite application
│   ├── src/pages/           Application screens
│   ├── src/services/        API clients
│   └── src/lib/             Auth and application state
├── odoo_19.0.latest.exe     Odoo installer
└── README.md
```

## Environment setup

Create `backend/.env` from `backend/.env.example` if it does not exist:

```env
PORT=5000
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
DIRECT_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
JWT_SECRET=use-a-long-random-secret
FRONTEND_ORIGIN=http://localhost:5173
ODOO_URL=http://localhost:8069
ODOO_DB=dayflowdb
ODOO_USERNAME=hr@dayflow.local
ODOO_API_KEY=<odoo-api-key>
```

Do not commit real database passwords, API keys, or JWT secrets.

## Install dependencies

```powershell
cd backend
npm ci

cd ..\frontend\frontend
npm ci
```

## Prepare demo data

The active seed file is `backend/prisma/seed.js`:

```powershell
cd backend
npx prisma db push
npx prisma db seed
```

Seeding clears and recreates the Dayflow demo records. Do not run it if you need to preserve current application data.

## Demo login accounts

All accounts created by `backend/prisma/seed.js` use this password:

```text
Password123!
```

### HR accounts

| Name | Email | Employee ID |
| --- | --- | --- |
| Aarav Menon | `admin@yourcompany.example.com` | HR001 |
| Nisha Rao | `jeffrey.kelly72@example.com` | HR002 |

HR users can manage employees, review attendance and leave, update payroll, view reports, and review exceptions.

### Employee accounts

| Name | Email | Employee ID |
| --- | --- | --- |
| Alice Johnson | `mark.brown23@example.com` | EMP001 |
| Bob Singh | `gail.peterson39@example.com` | EMP00abi2 |
| Charlie Patel | `audrey.peterson25@example.com` | EMP003 |
| Diana Thomas | `anita.oliver32@example.com` | EMP004 |
| Ethan Varma | `tina.williamson98@example.com` | EMP005 |
| Fatima Khan | `sharlene.rhodes49@example.com` | EMP006 |

Employees can access their own profile, attendance, leave, payroll, documents, notifications, and activity. They cannot manage other employees or approve leave.

> `backend/prisma/seed.sql` contains older demo emails. The credentials above come from `backend/prisma/seed.js`, which is executed by `npx prisma db seed`.

## Run the complete project

### 1. Start PostgreSQL

```powershell
Start-Service postgresql-x64-18
Get-NetTCPConnection -LocalPort 5432 -State Listen
```

### 2. Start Odoo

```powershell
Start-Service odoo-server-19.0
```

Open http://localhost:8069. Odoo must use a PostgreSQL role whose username, password, and database permissions match `server/odoo.conf`. The Odoo database-manager master password is separate from the PostgreSQL password.

### 3. Start the backend

In terminal 1:

```powershell
cd backend
npm start
```

### 4. Start the frontend

In terminal 2:

```powershell
cd frontend\frontend
npm run dev -- --host 127.0.0.1
```

Open the application at http://localhost:5173.

## Verify services

```powershell
Invoke-WebRequest http://localhost:5000/health -UseBasicParsing
Invoke-WebRequest http://localhost:5000/api/health -UseBasicParsing
Invoke-WebRequest http://localhost:5173 -UseBasicParsing
Invoke-WebRequest http://localhost:8069/web/database/selector -UseBasicParsing
```

The backend health endpoints return:

```json
{"status":"ok"}
```

## API overview

| Area | Main endpoints | Access |
| --- | --- | --- |
| Authentication | `/api/auth/login`, `/api/auth/signup`, `/api/auth/me` | Public/authenticated |
| Employees | `/api/employees` | HR or own record |
| Attendance | `/api/attendance/*` | HR or own records |
| Leave | `/api/leaves/*` | HR or own requests |
| Payroll | `/api/payroll/*` | HR or own payroll |
| Notifications | `/api/notifications` | Authenticated |
| Exceptions | `/api/exceptions/*` | HR |
| Health | `/health`, `/api/health` | Public |

## Useful commands

Run backend tests:

```powershell
cd backend
npm test
```

Build the frontend:

```powershell
cd frontend\frontend
npm run build
```

Check all local ports:

```powershell
Get-NetTCPConnection -State Listen |
  Where-Object { $_.LocalPort -in 5000,5173,5432,8069 } |
  Select-Object LocalPort,OwningProcess
```

Stop services when needed:

```powershell
Stop-Service odoo-server-19.0
Stop-Service postgresql-x64-18
```

Stop the frontend and backend development servers with `Ctrl+C` in their terminals.

## Troubleshooting

### Odoo says password authentication failed for `sasidharan`

The PostgreSQL password configured in Odoo does not match the password assigned to that PostgreSQL role. Update the PostgreSQL role password or update these values in Odoo's `odoo.conf`:

```ini
db_host = localhost
db_port = 5432
db_user = sasidharan
db_password = <matching-postgresql-password>
```

Restart Odoo after changing the configuration.

### Odoo says Access Denied

The database-manager Master Password is the Odoo master password. It is not the PostgreSQL password and not the Dayflow login password. Reset it in Odoo's `odoo.conf` if unknown, then restart Odoo.

### Frontend cannot reach the API

Confirm the backend is running on port `5000` and open the frontend through Vite at `http://localhost:5173`.

### Login says Invalid credentials

Run the seed command again and use the exact credentials listed above:

```powershell
cd backend
npx prisma db seed
```

Seeding deletes and recreates demo application records.

## Security

The accounts and passwords in this README are development/demo credentials only. Change all passwords, JWT secrets, database credentials, and Odoo keys before deployment or external sharing.
