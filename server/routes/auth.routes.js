const express = require('express');
const router = express.Router();
const { login, register,getMe,updateMe } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);


module.exports = router;
