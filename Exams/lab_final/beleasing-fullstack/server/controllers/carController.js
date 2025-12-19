//server/controllers/carController.js  
const Car = require('../models/car');


exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.redirect('/offer'); // Redirect if ID doesn't exist
        res.render('carDetails', { car, user: req.user });
    } catch (err) {
        res.redirect('/offer');
    }
};

exports.getAllCars = async (req, res) => {
    try {
        // 1. Filter Logic
        let query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }

        // 2. Pagination Logic
        const page = parseInt(req.query.page) || 1;
        const limit = 6; // Limit: 6 cars per page
        const skip = (page - 1) * limit;

        // 3. Get Data
        const cars = await Car.find(query).skip(skip).limit(limit);
        const totalCars = await Car.countDocuments(query);
        const totalPages = Math.ceil(totalCars / limit);

        res.render('offer', { 
            cars, 
            user: req.user,
            currentPage: page,
            totalPages: totalPages,
            currentCategory: req.query.category || '' // Send category to keep filter active
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Create Car (for CRUD)
exports.createCar = async (req, res) => {
    try {
        const newCar = await Car.create(req.body);
        res.status(201).json({ success: true, data: newCar });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Update Car 
exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Check schema rules
        });

        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Delete Car
exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        
        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }

        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
