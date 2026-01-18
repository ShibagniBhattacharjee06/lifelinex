const express = require('express');
const router = express.Router();
const { createSOS, getActiveSOS, respondToSOS, generateReport } = require('../controllers/sosController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSOS);
router.get('/active', protect, getActiveSOS);
router.put('/:id/respond', protect, respondToSOS);
router.get('/:id/report', protect, generateReport);

module.exports = router;
