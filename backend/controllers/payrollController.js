const prisma = require('../config/prisma');
const { asyncHandler, createNetPay, serialize, toDecimal, toFrontendPayroll } = require('./shared');

const include = { user: { include: { profile: true } }, salarySlip: true };

async function resolveUser(value) {
  return prisma.user.findFirst({ where: { OR: [{ id: value }, { employeeId: value }] }, select: { id: true } });
}

const listPayroll = asyncHandler(async (req, res) => {
  const requested = req.query.employeeId || req.query.userId;
  const target = requested ? await resolveUser(requested) : null;
  if (requested && !target) return res.status(404).json({ message: 'Employee not found' });
  const userId = req.user.role === 'hr' ? target?.id : req.user.userId;
  const payrolls = await prisma.payroll.findMany({ where: userId ? { userId } : {}, include, orderBy: [{ year: 'desc' }, { month: 'desc' }] });
  const data = payrolls.map(toFrontendPayroll);
  return res.json({ data, payrolls: data });
});

const getPayroll = asyncHandler(async (req, res) => {
  const target = await resolveUser(req.params.userId);
  if (!target) return res.status(404).json({ message: 'Employee not found' });
  if (req.user.role !== 'hr' && target.id !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
  const payrolls = await prisma.payroll.findMany({ where: { userId: target.id }, include, orderBy: [{ year: 'desc' }, { month: 'desc' }] });
  const data = payrolls.map(toFrontendPayroll);
  return res.json({ data, payrolls: data });
});

const updatePayroll = asyncHandler(async (req, res) => {
  const target = await resolveUser(req.params.userId);
  if (!target) return res.status(404).json({ message: 'Employee not found' });
  const existing = await prisma.payroll.findFirst({ where: { userId: target.id }, orderBy: [{ year: 'desc' }, { month: 'desc' }] });
  if (!existing) return res.status(404).json({ message: 'Payroll record not found' });
  const basic = req.body.basic ?? req.body.baseSalary;
  if (basic === undefined) return res.status(400).json({ message: 'basic salary is required' });
  const allowances = req.body.allowances === undefined ? existing.allowances : toDecimal(req.body.allowances);
  const deductions = req.body.deductions === undefined ? existing.deductions : toDecimal(req.body.deductions);
  const updated = await prisma.$transaction(async (tx) => {
    const beforeState = serialize(existing);
    const payroll = await tx.payroll.update({ where: { id: existing.id }, data: { baseSalary: toDecimal(basic), allowances, deductions, netPay: createNetPay(basic, allowances, deductions), status: req.body.status || existing.status, payDate: req.body.status === 'paid' ? new Date() : existing.payDate }, include });
    await tx.auditLog.create({ data: { actorId: req.user.userId, action: 'payroll_update', entity: 'payroll', entityId: existing.id, beforeState, afterState: serialize(payroll) } });
    return payroll;
  });
  const data = toFrontendPayroll(updated);
  return res.json({ data, payroll: data });
});

module.exports = { getPayroll, listPayroll, updatePayroll };
