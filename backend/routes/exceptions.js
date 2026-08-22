const { Router } = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { listExceptions, getException, evaluateExceptions, updateExceptionStatus } = require('../controllers/exceptionsController');

const router = Router();

router.get('/', authMiddleware, requireRole('hr'), listExceptions);
router.get('/:id', authMiddleware, requireRole('hr', 'employee'), getException);
router.post('/evaluate', authMiddleware, requireRole('hr'), evaluateExceptions);
router.post('/:id/review', authMiddleware, requireRole('hr'), (req, res, next) => { req.body.status = 'REVIEWED'; next(); }, updateExceptionStatus);
router.post('/:id/dismiss', authMiddleware, requireRole('hr'), (req, res, next) => { req.body.status = 'DISMISSED'; next(); }, updateExceptionStatus);
router.put('/:id/status', authMiddleware, requireRole('hr'), updateExceptionStatus);

module.exports = router;
