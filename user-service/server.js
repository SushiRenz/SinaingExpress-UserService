// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add both origins
  credentials: true
}));
app.use(express.json());

// Add logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'User Service is running!' });
});

// Routes
app.use('/api/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sinaing_express', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 User Service running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`📍 Test signup: POST http://localhost:${PORT}/api/users/signup`);
  console.log(`📍 Test login: POST http://localhost:${PORT}/api/users/login`);
});