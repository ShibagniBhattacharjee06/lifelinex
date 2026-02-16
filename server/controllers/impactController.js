const Impact = require('../models/Impact');
const User = require('../models/User');

// @desc    Get user impact stats
// @route   GET /api/impact/stats
// @access  Private
exports.getStats = async (req, res) => {
    try {
        let impact = await Impact.findOne({ user: req.user.id });

        if (!impact) {
            impact = await Impact.create({ user: req.user.id });
        }

        res.json(impact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get leaderboard
// @route   GET /api/impact/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
    try {
        // Aggregate to combine User name/avatar with Impact score
        // For simplicity in this demo, we'll fetch Impacts and populate User
        // In a real high-scale app, you'd likely store name/avatar in Impact or use efficient aggregation

        const topUsers = await Impact.find()
            .sort({ xp: -1 })
            .limit(10)
            .populate('user', 'name profileImage');

        // Transform for frontend
        const leaderboard = topUsers.map((item, index) => ({
            id: item.user._id,
            name: item.user.name,
            score: item.xp,
            badge: index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐',
            profileImage: item.user.profileImage
        }));

        res.json(leaderboard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Join a challenge (Simulated)
// @route   POST /api/impact/join-challenge
// @access  Private
exports.joinChallenge = async (req, res) => {
    try {
        const { challengeId, xp } = req.body;

        let impact = await Impact.findOne({ user: req.user.id });
        if (!impact) impact = await Impact.create({ user: req.user.id });

        // Check if already joined/completed (simple logic)
        const alreadyCompleted = impact.completedChallenges.find(c => c.challengeId === challengeId);

        if (alreadyCompleted) {
            return res.status(400).json({ msg: 'Challenge already completed' });
        }

        // "Complete" the challenge immediately for this demo and award XP
        impact.completedChallenges.push({ challengeId });
        impact.xp += (xp || 100);

        await impact.save();
        res.json(impact);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
