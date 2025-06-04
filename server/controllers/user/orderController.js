// import Stripe from 'stripe';
// import Order from '../../models/order.js';
// import Product from '../../models/product.js';
// import Shipping from '../../models/shippingAddress.js';
// import Discount from '../../models/discount.js';
// import Payment from '../../models/payment.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const createCheckoutSession = async (req, res) => {
//     try {
//         const { items, appliedDiscount } = req.body
//         const userId = req.user.id;
//         const lineItems = []
//         for (let item of items) {
//             const product = await Product.findById(item.product);
//             lineItems.push({
//                 price_data: {
//                     currency: 'vnd',
//                     unit_amount: product.price,
//                     product_data: {
//                         name: product.name,
//                     }
//                 },
//                 quantity: item.quantity

//             })

//         }
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: lineItems,
//             mode: 'payment',
//             success_url: `${process.env.CLIENT_URL}/payment-success`,
//             cancel_url: `${process.env.CLIENT_URL}/cart`,
//             metadata: {
//                 userId: req.user.id,
//                 shippingAddress: JSON.stringify(shippingAddress),
//                 appliedDiscount: appliedDiscount || ''
//             }
//         });
//         res.json({ url: session.url });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Checkout session creation failed' });
//     }


// };
// export const getOrderById = async (req, res) => { /* ... */ };
// export const updateOrder = async (req, res) => { /* ... */ };
// export const deleteOrder = async (req, res) => { /* ... */ };
