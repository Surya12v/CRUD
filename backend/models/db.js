// backend/db.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  // const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crud';
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
// MongoDB connection
