const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'donor', 'hospital', 'admin'],
        default: 'user'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    profileImage: {
        type: String,
        default: '' // Will use UI Avatars if empty
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Health Profile
    age: { type: Number },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] },
    medicalHistory: { type: String },
    emergencyContact: { type: String },

    // Enterprise Features
    falseAlarmCount: { type: Number, default: 0 },
    isSuspended: { type: Boolean, default: false },
    language: { type: String, default: 'en', enum: ['en', 'hi', 'bn'] },
    fcmToken: { type: String }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
