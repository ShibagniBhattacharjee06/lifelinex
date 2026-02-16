const Lifestyle = require('../models/Lifestyle');

// @desc    Get today's lifestyle stats
// @route   GET /api/lifestyle/today
// @access  Private
exports.getToday = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let lifestyle = await Lifestyle.findOne({
            user: req.user.id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (!lifestyle) {
            lifestyle = await Lifestyle.create({
                user: req.user.id,
                date: new Date()
            });
        }

        res.json(lifestyle);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update today's stats
// @route   PUT /api/lifestyle/update
// @access  Private
exports.updateToday = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let lifestyle = await Lifestyle.findOne({
            user: req.user.id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (!lifestyle) {
            lifestyle = new Lifestyle({
                user: req.user.id,
                date: new Date()
            });
        }

        // Update fields if present in body
        if (req.body.water !== undefined) lifestyle.water = req.body.water;
        if (req.body.sleep !== undefined) lifestyle.sleep = req.body.sleep;
        if (req.body.mood !== undefined) lifestyle.mood = req.body.mood;
        if (req.body.habits) {
            lifestyle.habits = { ...lifestyle.habits, ...req.body.habits };
        }

        await lifestyle.save();
        res.json(lifestyle);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
