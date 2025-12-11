const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

// Handle form submission
router.post('/api/contact', submitContact);

module.exports = router;