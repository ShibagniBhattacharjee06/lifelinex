const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    lastDonationDate: {
        type: Date
    },
    medicalHistory: {
        type: String
    }
});

module.exports = mongoose.model('Donor', DonorSchema);
