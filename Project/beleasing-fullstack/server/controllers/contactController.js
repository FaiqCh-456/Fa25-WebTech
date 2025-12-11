const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
    try {
        const { fullName, phone, email, message } = req.body;
        
        // Save to MongoDB
        await Contact.create({ fullName, phone, email, message });
        
        // Return success JSON (so the frontend JS can show the success alert)
        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};