const express = require('express');
const { getStats, getAnalytics, getRecentActivities } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/statistics', getStats);
router.get('/analytics', getAnalytics);
router.get('/activities', getRecentActivities);

module.exports = router;
