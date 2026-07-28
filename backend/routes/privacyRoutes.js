const express = require('express');
const { exportUserData, deleteUserAccount } = require('../controllers/privacyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/export-data', exportUserData);
router.delete('/delete-account', deleteUserAccount);

module.exports = router;
