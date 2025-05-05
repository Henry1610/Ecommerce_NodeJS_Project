const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Các route cho admin
router.get('/dashboard', authenticate, authorize(['admin']), (req, res) => {
    res.json({ message: 'Welcome to admin dashboard' });
});

module.exports = router;
