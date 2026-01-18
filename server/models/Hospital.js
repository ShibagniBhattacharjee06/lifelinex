const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Hospital', 'BloodBank'],
        required: true
    },
    inventory: {
        bloodA_Pos: { type: Number, default: 0 },
        bloodA_Neg: { type: Number, default: 0 },
        bloodB_Pos: { type: Number, default: 0 },
        bloodB_Neg: { type: Number, default: 0 },
        bloodAB_Pos: { type: Number, default: 0 },
        bloodAB_Neg: { type: Number, default: 0 },
        bloodO_Pos: { type: Number, default: 0 },
        bloodO_Neg: { type: Number, default: 0 },
        beds: { type: Number, default: 0 },
        icu: { type: Number, default: 0 },
        ambulances: { type: Number, default: 0 },
        oxygen: { type: Number, default: 0 }
    },
    address: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Hospital', HospitalSchema);
