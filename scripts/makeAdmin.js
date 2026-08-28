// Promotes an existing user to admin so the admin panel can be opened.
// Usage: npm run make:admin -- someone@example.com
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');

async function makeAdmin() {
    const email = process.argv[2];

    if (!email) {
        console.error('Usage: npm run make:admin -- someone@example.com');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOneAndUpdate(
        { email: email.toLowerCase().trim() },
        { role: 'admin' },
        { new: true }
    );

    if (!user) {
        console.error('No user found with that email. Register first.');
    } else {
        console.log(`${user.email} is now an admin.`);
    }

    await mongoose.disconnect();
}

makeAdmin();
