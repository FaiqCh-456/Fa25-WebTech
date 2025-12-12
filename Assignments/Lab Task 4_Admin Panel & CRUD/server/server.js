// LabTask4/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Car = require('./server/models/Car');

const app = express();

// Connect DB
mongoose.connect('mongodb://localhost:27017/beleasing_db');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

// 1. Admin Dashboard Route
app.get('/admin', async (req, res) => {
    const cars = await Car.find();
    res.render('crud', { 
        cars, 
        user: { username: "Admin" }, 
        layout: 'layouts/admin_header'
    }); 
});

// 2. CREATE
app.post('/api/cars', async (req, res) => {
    try {
        await Car.create(req.body);
        res.json({ success: true });
    } catch(err) { res.status(400).json({ error: err.message }); }
});

// 3. UPDATE
app.put('/api/cars/:id', async (req, res) => {
    try {
        await Car.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch(err) { res.status(400).json({ error: err.message }); }
});

// 4. DELETE
app.delete('/api/cars/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch(err) { res.status(400).json({ error: err.message }); }
});

app.listen(3000, () => console.log("Lab Task 4 (Admin) Running on http://localhost:3000/admin"));