const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // References the 'users' collection
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', // References the 'products' collection
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    
    ordered_date: {
        type: Date,
        default: Date.now, // Sets default value to the current date and time
        required: true
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create a model from the schema
const OrderHistory = mongoose.model('orderHistory', orderHistorySchema);

module.exports = OrderHistory;
