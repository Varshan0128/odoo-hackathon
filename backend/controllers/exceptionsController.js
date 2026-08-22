const prisma = require('../config/prisma');
const { asyncHandler } = require('./shared');
const { evaluate, serializeException } = require('../services/exceptions/exceptionEngine');
const { dbToSeverity, statusToDb } = require('../services/exceptions/constants');

const listExceptions = asyncHandler(async (req, res) => {
  await evaluate();
  const where = {};
  if (req.query.severity) where.severity = String(req.query.severity).toLowerCase();
  if (req.query.status) where.status = statusToDb[String(req.query.status).toUpperCase()] || String(req.query.status).toLowerCase();
  const records = await prisma.aiException.findMany({ where, include: { user: { include: { profile: true } } }, orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }] });
  return res.json({ exceptions: records.map(serializeException), unavailable: false });
});

const getException = asyncHandler(async (req, res) => {
  const record = await prisma.aiException.findUnique({ where: { id: req.params.id }, include: { user: { include: { profile: true } } } });
  if (!record) return res.status(404).json({ message: 'Exception not found' });
  if (req.user.role !== 'hr' && record.userId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
  return res.json({ exception: serializeException(record) });
});

const evaluateExceptions = asyncHandler(async (req, res) => res.json({ exceptions: await evaluate(), unavailable: false }));

const updateExceptionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const mapped = statusToDb[String(status || '').toUpperCase()];
  if (!mapped) return res.status(400).json({ message: 'status must be REVIEWED, RESOLVED, or DISMISSED' });

  const exception = await prisma.aiException.update({
    where: { id: req.params.id },
    data: {
      status: mapped,
      resolvedAt: ['resolved', 'ignored'].includes(mapped) ? new Date() : null,
    },
    include: { user: { include: { profile: true } } },
  });

  return res.json({ exception: serializeException(exception) });
});

module.exports = {
  listExceptions,
  getException,
  evaluateExceptions,
  updateExceptionStatus,
};
