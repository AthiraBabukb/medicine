const mongoose = require('mongoose');

const cartProductSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
        cartProduct: [cartProductSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
