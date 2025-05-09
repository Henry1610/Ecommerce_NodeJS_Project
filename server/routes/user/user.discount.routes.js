const express = require('express');
const router = express.Router();
const discountController=require('../../controllers/user/discountController') 

router.get('/check', discountController.checkDiscountCode);

module.exports = router;
