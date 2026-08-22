const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const employeesRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');
const leaveRequestsRoutes = require('./routes/leaveRequests');
const payrollRoutes = require('./routes/payroll');
const notificationsRoutes = require('./routes/notifications');
const exceptionsRoutes = require('./routes/exceptions');
const compatRoutes = require('./routes/compat');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Keep the API prefix used by the frontend while preserving the original routes.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/api/users', usersRoutes);
app.use('/employees', employeesRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/leave-requests', leaveRequestsRoutes);
app.use('/api/leave-requests', leaveRequestsRoutes);
app.use('/leaves', leaveRequestsRoutes);
app.use('/api/leaves', leaveRequestsRoutes);
app.use('/payroll', payrollRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/exceptions', exceptionsRoutes);
app.use('/api/exceptions', exceptionsRoutes);
app.use('/api', compatRoutes);

app.use((error, req, res, next) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
