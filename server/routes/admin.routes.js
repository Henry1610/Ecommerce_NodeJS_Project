const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const productRoutes=require('./product.routes')

// Các route cho admin
router.get('/dashboard', authenticate, authorize(['admin']), (req, res) => {
    res.json({ message: 'Welcome to admin dashboard' });
});
app.use('/products',authenticate, authorize(['admin']),productRoutes)
app.use('/categories', authenticate, authorize(['admin']), categoryRoutes);

module.exports = router;
