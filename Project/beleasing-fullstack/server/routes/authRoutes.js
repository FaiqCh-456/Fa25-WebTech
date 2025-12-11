const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// Page Renders (GET)
router.get('/login', (req, res) => res.render('login', { user: req.user, error: null }));
router.get('/register', (req, res) => res.render('register', { user: req.user, error: null }));
router.get('/logout', logout);

// Logic Handlers (POST)
router.post('/register', register);
router.post('/login', login);

module.exports = router;