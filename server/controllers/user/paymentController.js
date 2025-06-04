import Stripe from 'stripe';
import Product from '../../models/Product.js';
import ShippingAddress from '../../models/ShippingAddress.js';
import Discount from '../../models/Discount.js';
import Order from '../../models/Oder.js';
import Payment from '../../models/Payment.js'
import ShippingZone from '../../models/ShippingZone.js';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { items, appliedDiscount, shippingAddress } = req.body
    const discountPercent = await Discount.findOne({ code: appliedDiscount })
    const zone = await ShippingZone.findOne({ city: shippingAddress.city });
    if (!zone) {
      return res.status(400).json({ message: 'Không tìm thấy khu vực giao hàng cho thành phố này' });
    }
    const shippingFee = zone.fee;
    const userId = req.user.id;
    const lineItems = []
    for (let item of items) {
      const product = await Product.findById(item.product);
      lineItems.push({
        price_data: {
          currency: 'vnd',
          unit_amount: Math.round(product.price * (1 - discountPercent?.discountPercent / 100)),
          product_data: {
            name: product.name,
            metadata: {
              productId: product._id.toString()
            }
          }
        },
        quantity: item.quantity

      })
    }
    // console.log('🧾 Stripe lineItems:', lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/cart`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      // ✅ THÊM PHÍ GIAO HÀNG
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
        userId: userId,
        shippingAddress: JSON.stringify(shippingAddress),
        appliedDiscount: appliedDiscount || ''
      }
    });
    // console.log('✅ Stripe session created:', session.id); // log session id

    res.json({ url: session.url });

  } catch (err) {
    console.error('❌ Error in createCheckoutSession:', err); // ghi rõ nguồn lỗi
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

      // 1. Tạo địa chỉ giao hàng
      const shippingAddress = new ShippingAddress(
        shippingAddressData,
      );
      await shippingAddress.save();

      // 2. Lấy line_items từ Stripe
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      // 3. Tạo snapshot sản phẩm từ lineItems
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

      // 4. Tính tổng tiền
      const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

      // 5. Tạo đơn hàng (LÚC NÀY items và totalPrice đã có)
      const order = new Order({
        user: userId,
        shippingAddress: shippingAddress._id,
        items,
        appliedDiscount,
        totalPrice,
        isPaid: true,
        paidAt: new Date(),
      });
      await order.save();

      // 6. Tạo Payment
      const payment = new Payment({
        stripeSessionId: session.id,
        amount: session.amount_total / 100,
        status: 'paid',
        paymentMethod: 'card',
        order: order._id,
      });
      await payment.save();

      // 7. Cập nhật lại order với payment
      order.payment = payment._id;
      await order.save();

      // 8. Trừ tồn kho
      await Promise.all(
        items.map(async (item) => {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        })
      );

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
