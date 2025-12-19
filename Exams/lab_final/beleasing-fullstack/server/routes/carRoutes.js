const express = require('express');
const router = express.Router();
const { getAllCars, getCarById, createCar, deleteCar , updateCar } = require('../controllers/carController');
const protect = require('../middleware/authMiddleware');

router.get('/offer', protect, getAllCars); // Renders offer page
router.get('/offer/:id', protect, getCarById);
router.post('/api/cars', createCar);       // API for creating
router.delete('/api/cars/:id', deleteCar); // API for deleting
router.put('/api/cars/:id', updateCar);

module.exports = router;