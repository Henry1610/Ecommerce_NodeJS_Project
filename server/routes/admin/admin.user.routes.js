const express = require('express');
const userController = require('../../controllers/admin/userController');
const router = express.Router();

router.get('/', userController.getAllUsers);              
router.get('/:id', userController.getUserById);            
router.put('/:id', userController.updateUserRole);        
router.delete('/:id', userController.deleteUser);         

module.exports = router;
