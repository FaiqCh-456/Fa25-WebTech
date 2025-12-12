const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);