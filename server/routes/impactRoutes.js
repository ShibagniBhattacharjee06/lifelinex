const express = require('express');
const router = express.Router();
const { getStats, getLeaderboard, joinChallenge } = require('../controllers/impactController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);
router.get('/leaderboard', protect, getLeaderboard);
router.post('/join-challenge', protect, joinChallenge);

module.exports = router;
