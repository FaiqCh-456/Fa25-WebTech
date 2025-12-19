const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session'); 
const connectDB = require('./config/db');
const protect = require('./middleware/authMiddleware');

// --- LAB FINAL IMPORTS ---
const Order = require('./models/order'); 
const { checkCartNotEmpty, adminOnly } = require('./middleware/labMiddleware');

dotenv.config({ path: path.join(__dirname, '../.env') }); 

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// --- 2. SESSION CONFIGURATION ---
app.use(session({
    secret: 'secretkey',
    resave: false, 
    saveUninitialized: false, // Fix for empty sessions
    cookie: { 
        secure: false, // False for localhost
        httpOnly: true, 
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    } 
}));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Global User Middleware (Auth)
app.use(protect);

// --- 3. CART MIDDLEWARE ---
app.use((req, res, next) => {
    res.locals.cart = req.session.cart || [];
    res.locals.user = req.user || null;
    next();
});

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

// Existing Admin Route (CRUD)
app.get('/crud', async (req, res) => {
    if(!req.user || !req.user.isAdmin) return res.redirect('/login');
    const Car = require('./models/car');
    const cars = await Car.find();
    res.render('crud', { user: req.user, cars });
});


// ============================================================
//  LAB FINAL NEW ROUTES
// ============================================================

// --- NEW: CART PAGE ROUTE (The Professional View) ---
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    // Render the new professional cart.ejs page
    res.render('cart', { cart, total, user: req.user });
});

// --- TASK 1: ADD TO CART ---
app.post('/cart/add/:id', async (req, res) => {
    const productId = req.params.id;
    const Car = require('./models/car'); 
    
    try {
        const product = await Car.findById(productId);
        
        if (!product) {
            console.log("Product not found");
            return res.redirect('/offer');
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Check if item exists
        const existingItem = req.session.cart.find(item => item._id == productId);
        if (existingItem) {
            existingItem.quantity++;
            console.log("Updated quantity:", product.name);
        } else {
            req.session.cart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
            console.log("Added to cart:", product.name);
        }

        // Save session and redirect to the CART page
        req.session.save(err => {
            if(err) console.log("Session Save Error:", err);
            res.redirect('/cart'); 
        });

    } catch (err) {
        console.error(err);
        res.redirect('/offer');
    }
});


// --- TASK 1 & 4: CHECKOUT ROUTES ---

// GET Checkout Page (Final Payment Form Only)
app.get('/checkout', (req, res) => {
    const cart = req.session.cart || [];
    
    // If cart is empty, force them back to the cart page
    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    res.render('checkout', { cart, total, user: req.user });
});
//  GET SINGLE ORDER DETAILS ---
app.get('/admin/orders/:id', adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.redirect('/admin/orders');
        }
        res.render('admin-order-details', { order, user: req.user });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/orders');
    }
});

// POST Process Order
app.post('/checkout', checkCartNotEmpty, async (req, res) => {
    try {
        const cart = req.session.cart || [];
        const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

        // Validation
        if(!req.body.name || !req.body.email || !req.body.email.includes('@')) {
            return res.status(400).send("Invalid Name or Email");
        }

        // Map flat cart items to nested Order Schema structure
        const orderItems = cart.map(item => ({
            product: { 
                _id: item._id, 
                name: item.name, 
                image: item.image 
            },
            quantity: item.quantity,
            price: item.price
        }));

        const newOrder = new Order({
            customerName: req.body.name,
            email: req.body.email,
            phone: req.body.number,
            address: req.body.address,
            items: orderItems,
            totalAmount: total,
            status: 'Pending'
        });

        await newOrder.save();

        req.session.cart = []; // Clear Cart
        
        req.session.save(() => {
            res.render('order-confirmation', { order: newOrder, user: req.user });
        });

    } catch (err) {
        console.error("Order Save Error:", err); 
        res.status(500).send("Error processing order: " + err.message); 
    }
});


// --- TASK 3: ADMIN ORDERS DASHBOARD ---

// GET All Orders
app.get('/admin/orders', adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.render('admin-orders', { orders, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// POST Update Status
app.post('/admin/order/status', adminOnly, async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status: status });
        res.redirect('/admin/orders');
    } catch (err) {
        res.status(500).send("Error updating status");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));