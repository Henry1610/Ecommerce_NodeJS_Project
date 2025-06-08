import Stripe from 'stripe';
import Product from '../../models/Product.js';
import Discount from '../../models/Discount.js';
import Order from '../../models/Oder.js';
import Payment from '../../models/Payment.js'
import ShippingZone from '../../models/ShippingZone.js';
import Cart from '../../models/Cart.js';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { items, appliedDiscount, shippingAddress } = req.body;
    const userId = req.user.id;

    const discount = appliedDiscount
      ? await Discount.findById(appliedDiscount)
      : null;

    if (discount && discount.quantity <= 0) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }

    const zone = await ShippingZone.findOne({ city: shippingAddress.city.city });
    if (!zone) {
      return res.status(400).json({ message: 'Không tìm thấy khu vực giao hàng cho thành phố này' });
    }

    const shippingFee = zone.fee;
    const lineItems = [];
    let totalOriginal = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);
      totalOriginal += product.price * item.quantity;
    }

    // Tính giảm giá
    let discountValue = 0;
    if (discount) {
      const rawDiscount = (discount.discountPercent / 100) * totalOriginal;
      discountValue = Math.min(rawDiscount, discount.maxDiscount || rawDiscount);
    }

    // Tạo line items cho Stripe
    for (let item of items) {
      const product = await Product.findById(item.product);
      const itemTotal = product.price * item.quantity;
      const itemShare = itemTotal / totalOriginal;
      const itemDiscount = discountValue * itemShare;
      const unitDiscount = itemDiscount / item.quantity;

      lineItems.push({
        price_data: {
          currency: 'vnd',
          unit_amount: Math.round(product.price - unitDiscount),
          product_data: {
            name: product.name,
            metadata: {
              productId: product._id.toString(),
            },
          },
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success`,
      cancel_url: `${process.env.CLIENT_URL}/order-fail`,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingFee, currency: 'vnd' },
            display_name: 'Giao hàng tiêu chuẩn',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      metadata: {
        userId,
        shippingAddress: JSON.stringify(shippingAddress),
        appliedDiscount: appliedDiscount || '',
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Error in createCheckoutSession:', err);
    res.status(500).json({ message: 'Checkout session creation failed', err });
  }
};


export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const userId = session.metadata.userId;
      const shippingAddressData = JSON.parse(session.metadata.shippingAddress);
      const appliedDiscount = session.metadata.appliedDiscount || null;

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      const items = await Promise.all(
        lineItems.data.map(async (lineItem) => {
          const productId = lineItem.price.product.metadata.productId;
          const product = await Product.findById(productId);

          return {
            product: product._id,
            name: product.name,
            image: product.images?.[0] || '',
            quantity: lineItem.quantity,
            price: product.price,
          };
        })
      );

      const totalPrice = session.amount_total / 100;

      const payment = new Payment({
        stripeSessionId: session.id,
        amount: totalPrice,
        paymentStatus: 'paid',
        paymentMethod: 'card',
        paidAt: new Date(),
      });
      await payment.save();

      const order = new Order({
        user: userId,
        shippingAddress: shippingAddressData._id,
        payment: payment._id,
        items,
        appliedDiscount,
        totalPrice,
        isPaid: true,
        paidAt: new Date(),
        isShipped: false,
        shippedAt: null,
        isDelivered: false,
        deliveredAt: null,
      });
      await order.save();

      // Trừ tồn kho
      await Promise.all(
        items.map(async (item) => {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        })
      );

      // Trừ lượt mã giảm giá
      if (appliedDiscount) {
        await Discount.findOneAndUpdate(
          { _id: appliedDiscount, quantity: { $gt: 0 } },
          { $inc: { quantity: -1 } }
        );
      }

      // Xóa giỏ hàng
      await Cart.deleteOne({ user: userId });

      console.log(`✅ Đơn hàng ${order._id} đã được tạo sau thanh toán Stripe`);
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('❌ Lỗi khi xử lý webhook:', error);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  } else {
    res.status(200).json({ received: true });
  }
};

