// server/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true},
    address: { type: String, required: true },
    items: [{
        product: { type: Object, required: true }, // Storing full product snapshot
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled'], 
        default: 'Pending' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);