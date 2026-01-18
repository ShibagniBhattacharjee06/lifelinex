const User = require('../models/User');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { name, email, password, phone, role, location, extraData } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role,
            profileImage: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&color=fff`,
            location: {
                type: 'Point',
                coordinates: location || [0, 0] // Default to 0,0 if not provided
            }
        });

        // Create related profile based on role
        if (role === 'donor') {
            await Donor.create({
                user: user._id,
                bloodGroup: extraData.bloodGroup,
                lastDonationDate: extraData.lastDonationDate
            });
        } else if (role === 'hospital') {
            await Hospital.create({
                user: user._id,
                name: extraData.hospitalName,
                type: extraData.type, // Hospital or BloodBank
                address: extraData.address,
                inventory: extraData.inventory || {}
            });
        }

        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({
            ...userObj,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const userObj = user.toObject();
            delete userObj.password;

            res.json({
                ...userObj,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get current user profile
// @route   PUT /api/auth/update
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const fields = ['name', 'age', 'bloodGroup', 'medicalHistory', 'emergencyContact', 'profileImage', 'location'];
        const updateData = {};

        fields.forEach(field => {
            if (req.body[field] !== undefined) updateData[field] = req.body[field];
        });

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');

    let profile = null;
    if (user.role === 'donor') {
        profile = await Donor.findOne({ user: user._id });
    } else if (user.role === 'hospital') {
        profile = await Hospital.findOne({ user: user._id });
    }

    res.status(200).json({ user, profile });
};
