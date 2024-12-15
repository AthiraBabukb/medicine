const express = require('express');
const router = express.Router();
const Product = require('../models/productsModel');

// Create a new product (used for the cart page)
router.post('/products', async (req, res) => {
    const { name, price, stock, company_name } = req.body;

    try {
        const newProduct = new Product({ name, price, stock, company_name });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all products (used for the shop page)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a specific product by ID (used for the sproduct page)
router.get('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
