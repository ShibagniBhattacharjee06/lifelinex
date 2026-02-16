const mongoose = require('mongoose');

const LifestyleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    water: {
        type: Number,
        default: 0
    },
    sleep: {
        type: Number,
        default: 0
    },
    mood: {
        type: String,
        enum: ['happy', 'neutral', 'sad', 'stressed', 'excited'],
        default: 'neutral'
    },
    habits: {
        exercise: { type: Boolean, default: false },
        meditate: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        journal: { type: Boolean, default: false }
    }
});

// Compound index to ensure one entry per user per day (handled in logic, but good for query perf)
LifestyleSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Lifestyle', LifestyleSchema);
