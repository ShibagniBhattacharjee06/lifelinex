const User = require('../models/User');

exports.checkFraud = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.isSuspended) {
            return res.status(403).json({ msg: 'Account suspended due to repeated false alarms.' });
        }

        // Simple Rate Limit (Max 1 SOS every 10 mins)
        // In a real Redis setup, we'd check keys. Here we assume client-side handles basic throttling,
        // or check last SOS timestamp if persistent.
        // For MVP: We just check suspension status here.

        next();
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.flagFalseAlarm = async (userId) => {
    const user = await User.findById(userId);
    user.falseAlarmCount += 1;
    if (user.falseAlarmCount >= 3) {
        user.isSuspended = true;
    }
    await user.save();
};
