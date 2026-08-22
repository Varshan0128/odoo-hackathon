const { Router } = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { checkIn, checkOut, listAttendance } = require('../controllers/attendanceController');

const router = Router();

router.post('/checkin', authMiddleware, requireRole('employee', 'hr'), checkIn);
router.post('/check-in', authMiddleware, requireRole('employee', 'hr'), checkIn);
router.post('/checkout', authMiddleware, requireRole('employee', 'hr'), checkOut);
router.post('/check-out', authMiddleware, requireRole('employee', 'hr'), checkOut);
router.get('/', authMiddleware, requireRole('employee', 'hr'), listAttendance);

module.exports = router;
