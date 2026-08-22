const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { dashboard, documents, activity, reportSummary } = require('../controllers/compatController');

const router = Router();
router.use(authMiddleware);
router.get('/dashboard', dashboard);
router.get('/documents', documents);
router.get('/activity', activity);
router.get('/reports/summary', reportSummary);

module.exports = router;
