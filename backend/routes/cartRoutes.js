const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel'); // Adjust path as needed
const Product = require('../models/productsModel');
const User = require('../models/usersModel'); // Assuming you have a User model for credit card validation

// Fetch Cart Details API
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user's cart and populate product details
        const userCart = await Cart.findOne({ userId }).populate('cartProduct.productId');

        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found for this user.' });
        }

        // Prepare cart details with product info
        const cartDetails = userCart.cartProduct.map(item => ({
            productName: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            total: item.productId.price * item.quantity,
        }));

        res.status(200).json({ cartDetails });
    } catch (error) {
        console.error('Error fetching cart details:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Add to Cart API
router.post('/add-to-cart', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Find the cart for the user
        let userCart = await Cart.findOne({ userId });

        if (!userCart) {
            // Create a new cart if none exists
            userCart = new Cart({
                userId,
                cartProduct: [{ productId, quantity }],
            });
        } else {
            // Check if product already exists in cartProduct array
            const productIndex = userCart.cartProduct.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (productIndex > -1) {
                // Update the quantity if product exists
                userCart.cartProduct[productIndex].quantity += quantity;
            } else {
                // Add new product to cartProduct array
                userCart.cartProduct.push({ productId, quantity });
            }
        }

        // Save the cart
        await userCart.save();

        res.status(200).json({ message: 'Cart updated successfully.', cart: userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Buy Now API (Check for Credit Card)
router.post('/buy-now', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        // Find the user to check credit card information
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the user has a credit card
        if (!user.credit_card || user.credit_card === "") {
            return res.status(400).json({ message: 'Please add your credit card information.' });
        }

        // Proceed with the purchase logic (you can add further steps like order creation, payment, etc.)
        res.status(200).json({ message: 'Thanks for purchasing!' });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
