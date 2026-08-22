const { Router } = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { listEmployees, getEmployee, createEmployee, updateEmployee, listDepartments } = require('../controllers/employeesController');

const router = Router();

router.get('/', authMiddleware, requireRole('hr'), listEmployees);
router.get('/departments', authMiddleware, listDepartments);
router.post('/', authMiddleware, requireRole('hr'), createEmployee);
router.get('/:id', authMiddleware, getEmployee);
router.put('/:id', authMiddleware, updateEmployee);
router.patch('/:id', authMiddleware, updateEmployee);

module.exports = router;
