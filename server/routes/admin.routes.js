const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const paymentRoutes=require('./admin/admin.payment.routes')
const categoryRoutes=require('./admin/admin.category.routes')
const brandRoutes=require('./admin/admin.brand.routes')
const productRoutes=require('./admin/admin.product.routes')
const orderRoutes=require('./admin/admin.order.routes')
const userRoutes=require('./admin/admin.user.routes')
const discountRoutes=require('./admin/admin.discount.routes')

// Các route cho admin
router.get('/dashboard', authenticate, authorize(['admin']), (req, res) => {
    res.json({ message: 'Welcome to admin dashboard' });
});
app.use('/brands', authenticate, authorize(['admin']), brandRoutes);
app.use('/categories', authenticate, authorize(['admin']), categoryRoutes);
app.use('/discounts', authenticate, authorize(['admin']), discountRoutes);
app.use('/orders', authenticate, authorize(['admin']), orderRoutes);
app.use('/payments', authenticate, authorize(['admin']), paymentRoutes);
app.use('/products',authenticate, authorize(['admin']),productRoutes)
app.use('/users', authenticate, authorize(['admin']), userRoutes);


module.exports = router;
