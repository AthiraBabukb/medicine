
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/usersModel');

const SECRET_KEY = "your_secret_key"; // Replace with a strong secret key
const ENCRYPTION_KEY = 'your-secret-key-12345'; // Same as used in encrypt.js

// Decryption function 
function decrypt(encryptedPassword) {
  const algorithm = 'aes-256-cbc';
  const iv = Buffer.alloc(16, 0); // Initialization vector
  const decipher = crypto.createDecipheriv(algorithm, crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32), iv);
  let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Decrypt stored password and compare with provided password
    const decryptedPassword = decrypt(user.password);
    if (decryptedPassword !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Route to fetch current user details
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'name email age gender credit_card');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user details
router.put('/me', authenticate, async (req, res) => {
  const { name, email, age, gender, credit_card } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, email, age, gender, credit_card },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
