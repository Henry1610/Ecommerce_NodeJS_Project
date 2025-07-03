import Stripe from 'stripe';
import Product from '../../models/Product.js';
import Discount from '../../models/Discount.js';
import Order from '../../models/Order.js';
import Payment from '../../models/Payment.js';
import ShippingZone from '../../models/ShippingZone.js';
import ShippingAddress from '../../models/shippingAddress.js';
import Cart from '../../models/Cart.js';
import { calculateShippingFee } from '../../utils/calculateShippingFee.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Hàm phụ: tính giá sau giảm giá sản phẩm
const calculateProductDiscountPrice = (price, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return price;
  return price - (price * discountPercent) / 100;
};

// Hàm phụ: xử lý cart items, tính tổng gốc và trả về processedItems
const processCartItems = async (items) => {
  const processedItems = [];
  let totalOriginal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Không tìm thấy sản phẩm ${item.product}`);

    const priceAfterProductDiscount = calculateProductDiscountPrice(product.price, product.discountPercent);
    totalOriginal += priceAfterProductDiscount * item.quantity;

    processedItems.push({
      product,
      quantity: item.quantity,
      priceAfterProductDiscount
    });
  }

  return { processedItems, totalOriginal };
};

// Hàm phụ: tính giảm giá từ mã discount
const calculateGlobalDiscount = (discount, totalOriginal) => {
  if (!discount) return 0;
  const rawDiscount = (discount.discountPercent / 100) * totalOriginal;
  return Math.min(rawDiscount, discount.maxDiscount || rawDiscount);
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { items, appliedDiscount, shippingAddressId } = req.body;
    const userId = req.user.id;

    const discount = appliedDiscount ? await Discount.findById(appliedDiscount) : null;

    if (discount && discount.quantity <= 0) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }
    if (!shippingAddressId) {
      return res.status(400).json({ message: 'Bạn chưa chọn địa chỉ' });
    }

    // Get shipping address with populated city
    const shippingAddress = await ShippingAddress.findById(shippingAddressId).populate('city');
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Không tìm thấy địa chỉ giao hàng' });
    }
    
    // Calculate shipping fee using utility function
    const { fee: shippingFee, zone } = await calculateShippingFee(shippingAddress.city.city);

    // Xử lý giỏ hàng
    const { processedItems, totalOriginal } = await processCartItems(items);
    const discountValue = calculateGlobalDiscount(discount, totalOriginal);

    const lineItems = processedItems.map(item => {
      const itemTotal = item.priceAfterProductDiscount * item.quantity;
      const itemShare = itemTotal / totalOriginal;
      const itemDiscount = discountValue * itemShare;
      const unitDiscount = itemDiscount / item.quantity;

      return {
        price_data: {
          currency: 'vnd',
          unit_amount: Math.round(item.priceAfterProductDiscount - unitDiscount),
          product_data: {
            name: item.product.name,
            metadata: {
              productId: item.product._id.toString(),
            },
          },
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success`,
      cancel_url: `${process.env.CLIENT_URL}/order-fail`,
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shippingFee, currency: 'vnd' },
          display_name: 'Giao hàng tiêu chuẩn',
          delivery_estimate: { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 5 } }
        }
      }],
      metadata: {
        userId,
        shippingAddress: JSON.stringify(shippingAddress),
        appliedDiscount: appliedDiscount || '',
        shippingFee,
        discountValue
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
      const shippingFee = parseFloat(session.metadata.shippingFee || 0);
      const discountValue = parseFloat(session.metadata.discountValue || 0);

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });

      const items = await Promise.all(
        lineItems.data.map(async (lineItem) => {
          const productId = lineItem.price.product.metadata.productId;
          const product = await Product.findById(productId);

          const priceAfterDiscount = calculateProductDiscountPrice(product.price, product.discountPercent);

          return {
            product: product._id,
            name: product.name,
            image: product.images?.[0] || '',
            quantity: lineItem.quantity,
            originalPrice: product.price,
            price: priceAfterDiscount
          };
        })
      );

      const totalPrice = session.amount_total;

      const payment = await Payment.create({
        paymentIntentId: session.payment_intent,
        stripeSessionId: session.id,
        amount: totalPrice,
        paymentStatus: 'succeeded',
        refundStatus: 'none',
        paymentMethod: 'card',
        paidAt: new Date(),
      });

      // Prepare embedded shipping address data
      const embeddedShippingAddress = {
        fullName: shippingAddressData.fullName,
        address: shippingAddressData.address,
        city: shippingAddressData.city.city, // Extract city name
        cityId: shippingAddressData.city._id, // Keep reference to ShippingZone
        phoneNumber: shippingAddressData.phoneNumber,
        originalAddressId: shippingAddressData._id, // Keep reference to original address
        shippingZoneName: shippingAddressData.city.city // Store city name for shipping zone lookup
      };

      const order = await Order.create({
        user: userId,
        shippingAddress: embeddedShippingAddress,
        payment: payment._id,
        items,
        appliedDiscount,
        discountValue,
        shippingFee,
        totalPrice,
        status: 'pending',
        statusHistory: [
          {
            status: 'pending',
            updatedAt: new Date(),
          }
        ]
      });

      // Trừ tồn kho
      await Promise.all(
        items.map(item =>
          Product.findByIdAndUpdate(item.product, {
            $inc: {
              stock: -item.quantity,
              sold: item.quantity
            }
          })
        )
      );
      

      // Trừ lượt mã giảm giá
      if (appliedDiscount) {
        await Discount.findOneAndUpdate({ _id: appliedDiscount, quantity: { $gt: 0 } }, { $inc: { quantity: -1 } });
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
export const requestRefund = async (req, res) => {
  try {
    const orderNumber = req.params.orderNumber; // truyền orderNumber từ URL
    const userId = req.user.id;

    const order = await Order.findOne({ orderNumber, user: userId }).populate('payment');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Nếu đã yêu cầu refund
    if (order.status === 'cancel_requested' || order.payment.refundStatus === 'requested') {
      return res.status(400).json({ message: 'Refund already requested' });
    }
    order.statusHistory.push({ status: 'cancel_requested', updatedAt: new Date() });
    order.status = 'cancel_requested';

    // Cập nhật payment
    const payment = order.payment;
    payment.refundStatus = 'requested';
    payment.refundHistory.push({ status: 'requested', updatedAt: new Date() });

    await payment.save();
    await order.save();

    res.status(200).json({ message: 'Refund request submitted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


