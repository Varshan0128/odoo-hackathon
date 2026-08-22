const prisma = require('../config/prisma');
const { asyncHandler, normalizeDateOnly, toFrontendAttendance } = require('./shared');

const include = { user: { include: { profile: true } } };

function today() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return normalizeDateOnly(`${values.year}-${values.month}-${values.day}`);
}

function resolveUserId(req) {
  return req.user.role === 'hr' && (req.query.employeeId || req.body?.employeeId)
    ? req.query.employeeId || req.body.employeeId
    : req.user.userId;
}

async function findUserId(value) {
  const user = await prisma.user.findFirst({ where: { OR: [{ id: value }, { employeeId: value }] }, select: { id: true } });
  return user?.id || null;
}

const checkIn = asyncHandler(async (req, res) => {
  const userId = await findUserId(resolveUserId(req));
  if (!userId) return res.status(400).json({ message: 'Employee not found' });
  const date = today();
  const existing = await prisma.attendanceRecord.findUnique({ where: { userId_date: { userId, date } } });
  if (existing?.checkInTime && !existing.checkOutTime) return res.status(409).json({ message: 'Attendance is already checked in' });
  const record = existing
    ? await prisma.attendanceRecord.update({ where: { id: existing.id }, data: { checkInTime: new Date(), checkOutTime: null, status: 'present' }, include })
    : await prisma.attendanceRecord.create({ data: { userId, date, checkInTime: new Date(), status: 'present' }, include });
  return res.status(201).json({ data: toFrontendAttendance(record), attendance: toFrontendAttendance(record) });
});

const checkOut = asyncHandler(async (req, res) => {
  const userId = await findUserId(resolveUserId(req));
  if (!userId) return res.status(400).json({ message: 'Employee not found' });
  const record = await prisma.attendanceRecord.findUnique({ where: { userId_date: { userId, date: today() } }, include });
  if (!record?.checkInTime || record.checkOutTime) return res.status(404).json({ message: 'Open attendance record not found' });
  const updated = await prisma.attendanceRecord.update({ where: { id: record.id }, data: { checkOutTime: new Date() }, include });
  return res.json({ data: toFrontendAttendance(updated), attendance: toFrontendAttendance(updated) });
});

const listAttendance = asyncHandler(async (req, res) => {
  const userId = req.user.role === 'hr' && (req.query.employeeId || req.query.employee_id)
    ? await findUserId(req.query.employeeId || req.query.employee_id)
    : req.user.role === 'hr' ? null : req.user.userId;
  if (req.user.role === 'hr' && (req.query.employeeId || req.query.employee_id) && !userId) return res.status(404).json({ message: 'Employee not found' });
  const startValue = req.query.startDate || req.query.from || req.query.date;
  const endValue = req.query.endDate || req.query.to || req.query.date;
  const records = await prisma.attendanceRecord.findMany({
    where: { ...(userId ? { userId } : {}), ...(startValue || endValue ? { date: { ...(startValue ? { gte: normalizeDateOnly(startValue) } : {}), ...(endValue ? { lte: normalizeDateOnly(endValue) } : {}) } } : {}) },
    include,
    orderBy: { date: 'desc' },
  });
  const data = records.map(toFrontendAttendance);
  return res.json({ data, attendance: data });
});

module.exports = { checkIn, checkOut, listAttendance };
