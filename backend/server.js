const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoute'); // Import the product routes
const userRoutes = require('./routes/usersRoute');     // Import the user routes
const cartRoutes = require('./routes/cartRoutes');     // Import the cart routes
// const orderRoutes = require('./routes/orderRoutes');   
 
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://athirakb:Password@cluster0.x4f6q.mongodb.net/medicalshop?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());               // Enable Cross-Origin Requests
app.use(bodyParser.json());    // Parse JSON requests

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/products', productRoutes);  // Prefix all product-related routes with /api/products
app.use('/api/users', userRoutes);        // Prefix all user-related routes with /api/users
app.use('/api/cart', cartRoutes);         // Prefix all cart-related routes with /api/cart
// app.use('/api/orders', orderRoutes);      

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Medical Shop API');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack trace
  res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
  });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
