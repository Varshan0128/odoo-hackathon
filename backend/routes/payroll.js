const { Router } = require('express');
const { authMiddleware, requireRole, ownershipOrHR } = require('../middleware/auth');
const { getPayroll, listPayroll, updatePayroll } = require('../controllers/payrollController');

const router = Router();

router.get('/', authMiddleware, requireRole('employee', 'hr'), listPayroll);
router.get('/:userId', authMiddleware, ownershipOrHR('userId'), getPayroll);
router.put('/:userId', authMiddleware, requireRole('hr'), updatePayroll);

module.exports = router;
