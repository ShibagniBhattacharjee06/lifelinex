const mongoose = require('mongoose');
require('dotenv').config();
const SOSRequest = require('./models/SOSRequest');
const User = require('./models/User');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Helper to generate random coords around a center
        const generatePoint = (center, radiusKm) => {
            const r = radiusKm / 111.32; // Rough approximation
            const u = Math.random();
            const v = Math.random();
            const w = r * Math.sqrt(u);
            const t = 2 * Math.PI * v;
            const x = w * Math.cos(t);
            const y = w * Math.sin(t);
            // new_lat = y + centerLat, new_lon = x + centerLon / cos(centerLat)
            const newLat = y + center[0];
            const newLon = x + center[1] / Math.cos(center[0] * (Math.PI / 180));
            return [newLon, newLat];
        };

        const center = [20.5937, 78.9629]; // Default Map Center
        const mockRequests = [];

        // Find a valid user to assign these to (or create a dummy one)
        let user = await User.findOne();
        if (!user) {
            console.log("No users found. Creating dummy user.");
            user = await User.create({
                name: "Demo User", email: "demo@example.com", password: "password", phone: "1234567890"
            });
        }

        console.log(`Seeding data for User: ${user.name}`);

        for (let i = 0; i < 15; i++) {
            const coords = generatePoint(center, 50); // 50km radius
            const type = Math.random() > 0.5 ? 'accident' : 'blood_request';

            mockRequests.push({
                user: user._id,
                type: type,
                description: `Mock Emergency ${i + 1}`,
                priorityScore: Math.floor(Math.random() * 50) + 50, // High priority
                status: 'active',
                timeline: [{ status: 'created', details: 'Mock Alert' }],
                location: {
                    type: 'Point',
                    coordinates: [coords[1], coords[0]] // GeoJSON is [lon, lat]
                }
            });
        }

        await SOSRequest.insertMany(mockRequests);
        console.log('✅ Successfully seeded 15 Mock SOS signals!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
