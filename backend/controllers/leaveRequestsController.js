const prisma = require('../config/prisma');
const { asyncHandler, daysInclusive, normalizeDateOnly, toFrontendLeave } = require('./shared');
const { validateLeave } = require('../services/exceptions/leaveValidation');

const include = { user: { include: { profile: true } }, leaveType: true };

async function resolveUserId(value) {
  const user = await prisma.user.findFirst({ where: { OR: [{ id: value }, { employeeId: value }] }, select: { id: true } });
  return user?.id || null;
}

async function resolveLeaveType(value) {
  if (!value) return null;
  return prisma.leaveType.findFirst({ where: { OR: [{ id: String(value) }, { code: String(value) }, { name: { equals: String(value), mode: 'insensitive' } }] } });
}

const createLeaveRequest = asyncHandler(async (req, res) => {
  const userId = req.user.role === 'hr' && req.body.employeeId ? await resolveUserId(req.body.employeeId) : req.user.userId;
  const leaveType = await resolveLeaveType(req.body.leaveTypeId || req.body.type);
  const { startDate, endDate, remarks } = req.body;
  if (!userId || !leaveType || !startDate || !endDate) return res.status(400).json({ message: 'Employee, leave type, start date, and end date are required' });
  const validation = await validateLeave({ prisma, userId, startDate, endDate, leaveTypeId: leaveType.id });
  if (!validation.valid) return res.status(422).json({ message: `Leave request validation failed: ${validation.reason}`, validation });
  const days = daysInclusive(startDate, endDate);
  if (days < 1) return res.status(400).json({ message: 'End date must be on or after start date' });
  const request = await prisma.leaveRequest.create({ data: { userId, leaveTypeId: leaveType.id, startDate: normalizeDateOnly(startDate), endDate: normalizeDateOnly(endDate), days, remarks: remarks || null }, include });
  const data = toFrontendLeave(request);
  return res.status(201).json({ data, leaveRequest: data });
});

const decideLeaveRequest = asyncHandler(async (req, res) => {
  const status = String(req.body.status || '').toLowerCase();
  const comment = req.body.comment || null;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'status must be approved or rejected' });
  if (status === 'rejected' && !comment) return res.status(400).json({ message: 'A comment is required when rejecting a leave request' });
  const existing = await prisma.leaveRequest.findUnique({ where: { id: req.params.id }, include });
  if (!existing) return res.status(404).json({ message: 'Leave request not found' });
  if (existing.status !== 'pending') return res.status(409).json({ message: 'Leave request is not awaiting approval' });
  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.leaveRequest.update({ where: { id: existing.id }, data: { status, decisionComment: comment, decidedAt: new Date() }, include });
    if (status === 'approved') {
      await tx.leaveBalance.updateMany({ where: { userId: existing.userId, leaveTypeId: existing.leaveTypeId, year: existing.startDate.getUTCFullYear() }, data: { used: { increment: existing.days } } });
    }
    await tx.auditLog.create({ data: { actorId: req.user.userId, action: `leave_${status}`, entity: 'leave_request', entityId: existing.id, beforeState: { status: existing.status }, afterState: { status } } });
    return next;
  });
  const data = toFrontendLeave(updated);
  return res.json({ data, leaveRequest: data });
});

const listLeaveRequests = asyncHandler(async (req, res) => {
  const userId = req.user.role === 'hr' && req.query.employeeId ? await resolveUserId(req.query.employeeId) : req.user.role === 'hr' ? undefined : req.user.userId;
  const status = req.query.status && String(req.query.status).toLowerCase();
  const requests = await prisma.leaveRequest.findMany({ where: { ...(userId ? { userId } : {}), ...(status && status !== 'all' ? { status: status === 'pending' ? 'pending' : status === 'approved' ? 'approved' : 'rejected' } : {}) }, include, orderBy: { createdAt: 'desc' } });
  const data = requests.map(toFrontendLeave);
  return res.json({ data, leaveRequests: data });
});

const listLeaveTypes = asyncHandler(async (req, res) => {
  const types = await prisma.leaveType.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  return res.json({ data: types.map((type) => ({ id: type.id, name: type.name, code: type.code, isPaid: type.isPaid, annualAllocation: Number(type.annualAllocation) })) });
});

module.exports = { createLeaveRequest, decideLeaveRequest, listLeaveRequests, listLeaveTypes };
