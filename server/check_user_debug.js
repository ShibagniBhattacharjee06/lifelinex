const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUser = async () => {
    try {
        // Revert to cloud connection to test if IP is whitelisted
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'bhattacharjeeshibagni85@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`Role: ${user.role}`);
            // Don't log the password hash obviously, but maybe check if it looks hashed
            console.log(`Password hash length: ${user.password ? user.password.length : 'No password'}`);
        } else {
            console.log('User NOT found');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUser();
