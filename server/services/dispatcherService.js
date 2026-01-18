const User = require('../models/User');

exports.findNearbyResponders = async (latitude, longitude, radiusInKm = 5) => {
    // Find users (donors/hospitals) within radius
    const responders = await User.find({
        role: { $in: ['hospital', 'donor'] },
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $maxDistance: radiusInKm * 1000
            }
        }
    }).select('name phone fcmToken role location bloodGroup');

    return responders;
};

exports.filterEligibleDonors = (responders, bloodGroup) => {
    if (!bloodGroup) return responders; // If no blood needed, all are eligible (e.g. general ambulance)

    return responders.filter(user => {
        if (user.role === 'hospital') return true; // Hospitals always eligible
        // Simple blood compatibility Logic
        return user.bloodGroup === bloodGroup || user.bloodGroup === 'O-';
    });
};
