const Hospital = require('../models/Hospital');
const Donor = require('../models/Donor');
const User = require('../models/User');

// @desc    Get nearby hospitals/blood banks
// @route   GET /api/resources/hospitals
// @access  Private
exports.getNearbyHospitals = async (req, res) => {
    const { latitude, longitude, distance } = req.query; // distance in meters

    try {
        // Find users who are hospitals/blood banks near the location
        /*
          Note: The Hospital model links to a User. Location is stored in User model.
          We first find Users near location with role 'hospital', then fetch their Hospital profile.
        */

        // Simple approach: Find all hospitals and filter (for small scale) OR aggregate
        // Better approach: GeoNear on User collection, then lookup Hospital

        const maxDist = parseInt(distance) || 5000; // 5km default

        const nearbyUsers = await User.find({
            role: 'hospital',
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: maxDist
                }
            }
        });

        const userIds = nearbyUsers.map(u => u._id);
        const hospitals = await Hospital.find({ user: { $in: userIds } }).populate('user', 'name location phone email');

        res.json(hospitals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get nearby donors
// @route   GET /api/resources/donors
// @access  Private
exports.getNearbyDonors = async (req, res) => {
    const { latitude, longitude, distance, bloodGroup } = req.query;

    try {
        const maxDist = parseInt(distance) || 5000;

        const nearbyUsers = await User.find({
            role: 'donor',
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: maxDist
                }
            }
        });

        const userIds = nearbyUsers.map(u => u._id);
        let query = { user: { $in: userIds }, isAvailable: true };
        if (bloodGroup) {
            query.bloodGroup = bloodGroup;
        }

        const donors = await Donor.find(query).populate('user', 'name location phone email');

        res.json(donors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update hospital inventory
// @route   PUT /api/resources/inventory
// @access  Private (Hospital Only)
exports.updateInventory = async (req, res) => {
    try {
        const hospital = await Hospital.findOne({ user: req.user.id });
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital profile not found' });
        }

        hospital.inventory = { ...hospital.inventory, ...req.body };
        await hospital.save();

        res.json(hospital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
