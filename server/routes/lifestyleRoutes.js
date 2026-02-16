const express = require('express');
const router = express.Router();
const { getToday, updateToday } = require('../controllers/lifestyleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/today', protect, getToday);
router.put('/update', protect, updateToday);

module.exports = router;
