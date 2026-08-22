const { daysInclusive, normalizeDateOnly } = require('../../controllers/shared');

async function validateLeave({ prisma, userId, startDate, endDate, leaveTypeId }) {
  if (!startDate || !endDate) return { valid: false, type: 'LEAVE_VALIDATION', reason: 'INVALID_DATE_RANGE' };
  const start = normalizeDateOnly(startDate); const end = normalizeDateOnly(endDate); const today = normalizeDateOnly(new Date());
  if (start < today) return { valid: false, type: 'LEAVE_VALIDATION', reason: 'PAST_DATE' };
  if (end < start) return { valid: false, type: 'LEAVE_VALIDATION', reason: 'INVALID_DATE_RANGE' };
  const existing = await prisma.leaveRequest.findMany({ where: { userId, status: { in: ['pending', 'approved'] }, startDate: { lte: end }, endDate: { gte: start } }, select: { startDate: true, endDate: true } });
  if (existing.length) {
    const conflicts = [];
    for (const item of existing) for (let date = new Date(Math.max(start, item.startDate)); date <= new Date(Math.min(end, item.endDate)); date.setUTCDate(date.getUTCDate() + 1)) conflicts.push(date.toISOString().slice(0, 10));
    return { valid: false, type: 'LEAVE_VALIDATION', reason: 'OVERLAP', conflictingDates: [...new Set(conflicts)] };
  }
  if (leaveTypeId) {
    const balance = await prisma.leaveBalance.findUnique({ where: { userId_leaveTypeId_year: { userId, leaveTypeId, year: start.getUTCFullYear() } } });
    if (balance && daysInclusive(start, end) > Number(balance.allocated) - Number(balance.used)) return { valid: false, type: 'LEAVE_VALIDATION', reason: 'INSUFFICIENT_BALANCE', requestedDays: daysInclusive(start, end), availableBalance: Number(balance.allocated) - Number(balance.used) };
  }
  return { valid: true, requestedDays: daysInclusive(start, end), balance: leaveTypeId ? 'available-if-configured' : 'unavailable' };
}
module.exports = { validateLeave };
