const express = require('express');
const router = express.Router();
const { getHeatmapData, getAdminStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/heatmap', getHeatmapData);
router.get('/stats', protect, getAdminStats);

module.exports = router;
