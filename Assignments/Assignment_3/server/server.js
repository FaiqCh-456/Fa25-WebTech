// Assignment3/server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Car = require('./server/models/Car'); // Adjust path if needed

dotenv.config();
const app = express();

// 1. Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/offer', async (req, res) => {
    try {
        // Filtering
        let query = {};
        if (req.query.category && req.query.category !== 'all') {
            query.category = req.query.category;
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = 6; // Limit items per page
        const skip = (page - 1) * limit;

        const cars = await Car.find(query).skip(skip).limit(limit);
        const totalCars = await Car.countDocuments(query);
        const totalPages = Math.ceil(totalCars / limit);

        res.render('offer', { 
            cars, 
            user: null, 
            currentCategory: req.query.category || '',
            currentPage: page, 
            totalPages: totalPages 
        });
    } catch (err) {
        res.send("Error fetching data");
    }
});

app.get('/', (req, res) => res.render('index', { user: null }));

app.listen(3000, () => console.log("Assignment 3 Running on Port 3000"));