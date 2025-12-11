const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const protect = require('./middleware/authMiddleware');

dotenv.config({ path: path.join(__dirname, '../.env') }); // Load .env from root

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Global User Middleware (Available in all views)
app.use(protect);

// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/carRoutes'));
app.use('/', require('./routes/contactRoutes'));

// Basic Page Routes
app.get('/', (req, res) => res.render('index', { user: req.user }));
app.get('/about', (req, res) => res.render('about', { user: req.user }));
app.get('/contact', (req, res) => res.render('contact', { user: req.user }));
app.get('/login', (req, res) => res.render('login', { user: req.user, error: null }));
app.get('/register', (req, res) => res.render('register', { user: req.user, error: null }));
app.get('/crud', async (req, res) => {
    if(!req.user) return res.redirect('/login');
    const Car = require('./models/car');
    const cars = await Car.find();
    res.render('crud', { user: req.user, cars });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));