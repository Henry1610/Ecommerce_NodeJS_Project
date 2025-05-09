const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');


const paymentRoutes = require('../routes/user/user.payment.routes')
const cartRoutes = require('../routes/user/user.cart.routes')
const discountRoutes = require('../routes/user/user.discount.routes')
const productRoutes = require('../routes/user/user.product.routes')
const orderRoutes = require('../routes/user/user.order.routes')
const userRoutes = require('../routes/user/user.user.routes')
const shippingRoutes = require('../routes/user/user.shipping.routes')
const reviewRoutes = require('../routes/user/user.review.routes')

// Các route cho user
router.get('/', authenticate, (req, res) => {
    res.json({ user: req.user });
});

app.use('/carts', authenticate, cartRoutes);
app.use('/users', authenticate, userRoutes);
app.use('/discounts', authenticate, discountRoutes);
app.use('/orders', authenticate, orderRoutes);
app.use('/payments', authenticate, paymentRoutes);
app.use('/products', authenticate, productRoutes)
app.use('/shippings', authenticate, shippingRoutes);
app.use('/reviews', authenticate, reviewRoutes);



module.exports = router;