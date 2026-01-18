const mongoose = require('mongoose');

const SOSRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['accident', 'surgery', 'disaster', 'other', 'blood_request'],
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
        default: null
    },
    contactNumber: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'cancelled'],
        default: 'active'
    },
    // Enterprise Features
    priorityScore: { type: Number, default: 10 },
    isFalseAlarm: { type: Boolean, default: false },
    reportUrl: { type: String },
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        details: String
    }],
    description: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            index: '2dsphere'
        }
    },
    responders: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['accepted', 'on_way', 'arrived'] },
        updatedAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SOSRequest', SOSRequestSchema);
