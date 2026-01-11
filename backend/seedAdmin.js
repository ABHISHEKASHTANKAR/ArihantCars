const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected');

        // Check if admin exists
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        // Create Admin
        const admin = new Admin({
            username: 'admin',
            password: 'password123' // default password, should be changed
        });

        await admin.save();
        console.log('Admin user created');
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
