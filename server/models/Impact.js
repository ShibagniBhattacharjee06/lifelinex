const mongoose = require('mongoose');

const ImpactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    xp: {
        type: Number,
        default: 0
    },
    badges: [{
        type: String
    }],
    completedChallenges: [{
        challengeId: Number,
        completedAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Impact', ImpactSchema);
