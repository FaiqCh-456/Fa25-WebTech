//server/continue/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await User.create({ username, email, password: hashedPassword });
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: 'User already exists', user: null });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/crud');
    } else {
        res.render('login', { error: 'Invalid credentials', user: null });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};