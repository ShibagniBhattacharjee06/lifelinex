const SOSRequest = require('../models/SOSRequest');

// @route   GET /api/analytics/heatmap
// @access  Public
exports.getHeatmapData = async (req, res) => {
    try {
        // Return only points for heatmap visualization
        const data = await SOSRequest.find({}, 'location.coordinates priorityScore');
        const formatted = data.map(item => ({
            lat: item.location.coordinates[1],
            lng: item.location.coordinates[0],
            weight: item.priorityScore / 10 // Normalize weight
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/analytics/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
    try {
        const stats = await SOSRequest.aggregate([
            {
                $group: {
                    _id: null,
                    totalSOS: { $sum: 1 },
                    avgPriority: { $avg: '$priorityScore' },
                    resolvedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
                    }
                }
            }
        ]);

        const bloodStats = await SOSRequest.aggregate([
            { $match: { type: 'blood_request' } },
            { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
        ]);

        res.json({
            overview: stats[0] || {},
            bloodDemand: bloodStats
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
