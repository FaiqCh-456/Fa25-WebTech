
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String },
    year: { type: Number, default: 2024 },
    transmission: { type: String, default: 'Automatic' },
    fuelType: { type: String, default: 'Petrol' },
    seats: { type: Number, default: 4 }
});

module.exports = mongoose.models.Car || mongoose.model('Car', carSchema);