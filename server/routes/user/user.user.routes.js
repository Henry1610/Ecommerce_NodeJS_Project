const express = require('express');
const { getMe,
    updateMe} = require('../../controllers/user/userController');
const router = express.Router();

router.get('/me', getMe);                     
router.put('/:id', updateMe);           
  

module.exports = router