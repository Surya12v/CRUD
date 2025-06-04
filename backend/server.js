const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const connectDB = require('./models/db');
const FormBuilder = require('./models/FormBuilderSchema'); // Import FormBuilder model
const FormBuilderRoutes = require('./routes/formBuilderRoutes'); // Import FormBuilder routes
const dynamicRoutes = require('./routes/DynamicRoutes');
const app = express();
const PORT = process.env.PORT || 5000;
connectDB(); // Connect to MongoDB
const User = require('./models/User'); // Import User model

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/formbuilders', FormBuilderRoutes); // Ensure this matches frontend config
app.use('/api/dynamic', dynamicRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
