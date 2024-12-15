const mongoose = require('mongoose');
 
// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  credit_card: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;

