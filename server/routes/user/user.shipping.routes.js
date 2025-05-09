const express = require('express');
const router = express.Router();
const { getSavedShippingAddresses } = require('../../controllers/user/shippingController');

router.get('/shipping-addresses', getSavedShippingAddresses);

module.exports = router;
