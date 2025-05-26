// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Add logging for route access
router.use((req, res, next) => {
  console.log(`User route accessed: ${req.method} ${req.path}`);
  next();
});

// Test route for user service
router.get('/', (req, res) => {
  res.json({ message: 'User routes working!' });
});

router.post('/signup', registerUser);
router.post('/login', loginUser);

module.exports = router;