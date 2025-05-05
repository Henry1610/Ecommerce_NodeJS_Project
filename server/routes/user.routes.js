const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

// Các route cho user
router.get('/', authenticate, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;