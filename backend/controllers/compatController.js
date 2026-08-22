const prisma = require('../config/prisma');
const { asyncHandler, serialize, toFrontendAttendance, toFrontendLeave, toFrontendUser } = require('./shared');

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function dateOnly(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

async function dashboard(req, res) {
  const isHr = req.user.role === 'hr';
  const today = dateOnly(new Date());
  const scope = isHr ? {} : { userId: req.user.userId };
  const [user, employees, attendance, leaves, payrolls, logs] = await Promise.all([
    prisma.user.findUnique({ where: { id: req.user.userId }, include: { profile: true } }),
    isHr ? prisma.user.findMany({ where: { role: 'employee' }, include: { profile: true } }) : [],
    prisma.attendanceRecord.findMany({ where: { ...scope, date: { gte: new Date(today.getTime() - 6 * 86400000), lte: today } }, include: { user: { include: { profile: true } } }, orderBy: { date: 'asc' } }),
    prisma.leaveRequest.findMany({ where: scope, include: { user: { include: { profile: true } }, leaveType: true }, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.payroll.findMany({ where: scope, take: 1, orderBy: [{ year: 'desc' }, { month: 'desc' }] }),
    prisma.auditLog.findMany({ where: isHr ? {} : { actorId: req.user.userId }, orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);
  const todayKey = dayKey(today);
  const todayAttendance = attendance.find((record) => dayKey(record.date) === todayKey) || null;
  const leaveCounts = { pending: 0, approved: 0, rejected: 0 };
  leaves.forEach((leave) => { if (leave.status in leaveCounts) leaveCounts[leave.status] += 1; });
  if (!isHr) return res.json({ data: { todayAttendance: todayAttendance ? toFrontendAttendance(todayAttendance) : null, leaveCounts, hasPayroll: payrolls.length > 0 } });
  const attendanceSeries = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getTime() - (6 - index) * 86400000);
    const key = dayKey(date);
    const records = attendance.filter((record) => dayKey(record.date) === key);
    return { date: key, day: new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date), present: records.filter((record) => record.status === 'present').length, leave: 0, absent: Math.max(0, employees.length - records.length) };
  });
  const onLeaveToday = leaves.filter((leave) => leave.status === 'approved' && dayKey(leave.startDate) <= todayKey && dayKey(leave.endDate) >= todayKey).length;
  return res.json({ data: { metrics: { totalEmployees: employees.length, presentToday: attendance.filter((record) => dayKey(record.date) === todayKey && record.status === 'present').length, onLeaveToday, pendingRequests: leaveCounts.pending }, attendanceSeries, leaveDistribution: leaveCounts, activity: serialize(logs.map((log) => ({ id: log.id, type: log.action, message: log.action, timestamp: log.createdAt }))) } });
}

const documents = asyncHandler(async (req, res) => {
  const records = await prisma.document.findMany({ where: req.user.role === 'hr' ? {} : { userId: req.user.userId }, include: { user: { include: { profile: true } } }, orderBy: { createdAt: 'desc' } });
  const data = records.map((document) => ({ id: document.id, name: document.title, url: document.url, mimeType: document.metadata?.mimeType || null, createdAt: document.createdAt, employeeId: document.user?.employeeId || null, fullName: document.user?.profile?.fullName || null }));
  return res.json({ data });
});

const activity = asyncHandler(async (req, res) => {
  const logs = await prisma.auditLog.findMany({ where: req.user.role === 'hr' ? {} : { actorId: req.user.userId }, orderBy: { createdAt: 'desc' }, take: Number(req.query.limit) || 20 });
  return res.json({ data: serialize(logs.map((log) => ({ id: log.id, type: log.action, message: log.action, timestamp: log.createdAt }))) });
});

const reportSummary = asyncHandler(async (req, res) => {
  const startDate = dateOnly(req.query.startDate) || new Date(Date.now() - 30 * 86400000);
  const endDate = dateOnly(req.query.endDate) || dateOnly(new Date());
  const [employees, attendance, leaves, payrolls] = await Promise.all([
    prisma.user.count({ where: { role: 'employee' } }),
    prisma.attendanceRecord.findMany({ where: { date: { gte: startDate, lte: endDate } } }),
    prisma.leaveRequest.findMany({ where: { createdAt: { gte: startDate, lte: new Date(endDate.getTime() + 86400000) } } }),
    prisma.payroll.findMany(),
  ]);
  const distribution = { approved: 0, pending: 0, rejected: 0 };
  leaves.forEach((leave) => { if (leave.status in distribution) distribution[leave.status] += 1; });
  const attendanceSeries = [];
  for (let date = new Date(startDate); date <= endDate; date = new Date(date.getTime() + 86400000)) {
    const key = dayKey(date);
    const records = attendance.filter((record) => dayKey(record.date) === key);
    attendanceSeries.push({ date: key, day: new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date), present: records.filter((record) => record.status === 'present').length, leave: 0, absent: Math.max(0, employees - records.length) });
  }
  return res.json({ data: { startDate: req.query.startDate || '', endDate: req.query.endDate || '', totalEmployees: employees, attendanceSeries, leaveDistribution: distribution, totalNetPayroll: payrolls.reduce((sum, payroll) => sum + Number(payroll.netPay), 0) } });
});

module.exports = { dashboard: asyncHandler(dashboard), documents, activity, reportSummary };
