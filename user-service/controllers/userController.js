// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  console.log('🔵 Signup attempt:', req.body);
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log('❌ Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('❌ Username already exists:', username);
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    console.log('✅ User created successfully:', username);
    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: user._id,
      username: user.username 
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  console.log('🔵 Login attempt:', req.body);
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for user:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '2h' }
    );

    console.log('✅ Login successful:', username);
    res.json({ 
      token, 
      username: user.username,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: err.message });
  }
};