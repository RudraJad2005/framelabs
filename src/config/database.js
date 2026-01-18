// Database Configuration
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if MongoDB URI exists
        if (!process.env.MONGODB_URI) {
            console.log('⚠️  MongoDB URI not set. Running without database.');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Error: ${error.message}`);
        // Don't exit - allow app to run without DB for development
    }
};

module.exports = connectDB;
