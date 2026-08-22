const { Router } = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { createLeaveRequest, decideLeaveRequest, listLeaveRequests, listLeaveTypes } = require('../controllers/leaveRequestsController');
const { validateLeave } = require('../services/exceptions/leaveValidation');
const prisma = require('../config/prisma');

const router = Router();

router.post('/', authMiddleware, requireRole('employee', 'hr'), createLeaveRequest);
router.post('/validate', authMiddleware, requireRole('employee', 'hr'), async (req, res, next) => { try { const requested = req.user.role === 'hr' && req.body.employeeId ? req.body.employeeId : req.user.userId; const user = await prisma.user.findFirst({ where: { OR: [{ id: requested }, { employeeId: requested }] }, select: { id: true } }); if (!user) return res.status(404).json({ message: 'Employee not found' }); const result = await validateLeave({ prisma, userId: user.id, startDate: req.body.startDate, endDate: req.body.endDate, leaveTypeId: req.body.leaveTypeId }); res.json(result); } catch (error) { next(error); } });
router.put('/:id/decision', authMiddleware, requireRole('hr'), decideLeaveRequest);
router.patch('/:id/decision', authMiddleware, requireRole('hr'), decideLeaveRequest);
router.get('/', authMiddleware, requireRole('employee', 'hr'), listLeaveRequests);
router.get('/types', authMiddleware, requireRole('employee', 'hr'), listLeaveTypes);

module.exports = router;
