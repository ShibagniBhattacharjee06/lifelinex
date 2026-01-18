const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        console.log('Ensuring Indexes for User...');
        await User.syncIndexes();
        console.log('Indexes Synced Successfully!');

        console.log('Checking indexes...');
        const indexes = await User.listIndexes();
        console.log(indexes);

        process.exit();
    } catch (err) {
        console.error('Index Fix Failed:', err);
        process.exit(1);
    }
};

fixIndexes();
