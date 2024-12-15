const mongoose = require('mongoose');
 
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {    
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    
    company_name: {
        type: String,
        required: true
    },
    composition: {
        type: String, 
        required: true 
    },
    consume_Type: { 
        type: String, 
        required: true 
    },
    return_policy: { 
        type: String, 
        required: true 
    }
});

const Product = mongoose.model('products', productSchema);
module.exports = Product;