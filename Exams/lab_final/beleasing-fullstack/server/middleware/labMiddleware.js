// server/middleware/labMiddleware.js

// Middleware to ensure cart is not empty before checkout
const checkCartNotEmpty = (req, res, next) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect('/offer'); 
    }
    next();
};

// Middleware to restrict access to Admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).send("Access Denied: You do not have Admin privileges.");
    }
};

module.exports = { checkCartNotEmpty, adminOnly };