const express = require('express');
const {
  getAdminStats,
  getUsers,
  updateUserRole,
  toggleUserBan,
  getEmailLogs,
  getAuditLogs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.patch('/users/:id/ban', toggleUserBan);
router.get('/emails', getEmailLogs);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
