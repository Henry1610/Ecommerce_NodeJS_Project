import Cart from '../../models/Cart.js';
import Discount from '../../models/Discount.js'
import { MAX_STRIPE_AMOUNT } from '../../../client/src/config/constants.js';
import Product from '../../models/Product.js'
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {

    const cart = await Cart.findOne({ user: userId }).populate('items.product').populate('appliedDiscount');
    if (!cart) return res.json({ items: [] });

    res.json({
      items: cart.items,
      appliedDiscount: cart.appliedDiscount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy giỏ hàng', error });
  }
};


export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const clonedItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }));

    const itemIndex = clonedItems.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex !== -1) {
      clonedItems[itemIndex].quantity += quantity;
    } else {
      // Kiểm tra product tồn tại
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }
      clonedItems.push({ product: productId, quantity });
    }

    // Tính tổng tiền
    let total = 0;
    for (const item of clonedItems) {
      const product = await Product.findById(item.product);
      const price = product?.price || 0;
      total += price * item.quantity;
    }

    if (total > MAX_STRIPE_AMOUNT) {
      return res.status(400).json({
        message: 'Tổng giá trị đơn hàng không được vượt quá 100 triệu đồng.',
      });
    }

    // Cập nhật cart thật
    const realItemIndex = cart.items.findIndex(
      item => item.product._id.toString() === productId
    );

    if (realItemIndex !== -1) {
      cart.items[realItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      message: 'Không thể thêm vào giỏ hàng',
      error,
    });
  }
};


export const setCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { items, appliedDiscount, shippingFee } = req.body || [];
    let subtotal = 0;
    //Tính tổng tiền tất cả sản phẩm đã áp mã giảm giá
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

      if (item.quantity > product.stock) {
        return res.status(400).json({ message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} cái` });
      }

      const discount = product.discountPercent || 0;
      const discountedPrice = product.price * (1 - discount / 100);
      subtotal += discountedPrice * item.quantity;
    }    
    // Tính tiền mã giảm giá 
    let totalDiscount = 0;
    if (appliedDiscount && appliedDiscount.discountPercent) {
      const raw = subtotal * (appliedDiscount.discountPercent / 100);
      totalDiscount = appliedDiscount.maxDiscount
        ? Math.min(Math.round(raw), appliedDiscount.maxDiscount)
        : Math.round(raw);
    }
    
    // Tổng tiền cuối cùng
    const finalTotal = subtotal - totalDiscount+shippingFee ;

    if (finalTotal > MAX_STRIPE_AMOUNT) {
      return res.status(400).json({ message: 'Tổng đơn hàng không được vượt quá 100 triệu!' });
    }
    


    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { items, appliedDiscount },
      { new: true, upsert: true }
    ).populate('items.product appliedDiscount');

    // await cart.save();


    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi cập nhật giỏ hàng' });
  }
};

export const applyDiscountToCart = async (req, res) => {
  try {
    const { code } = req.body;

    const userId = req.user.id;

    const discount = await Discount.findOne({ code });

    if (!discount || !discount.isActive) {
      return res.status(400).json({ message: 'Mã giảm giá không tồn tại hoặc đã tắt.' });
    }

    const now = new Date();
    if (discount.validFrom > now || discount.validTo < now) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết hạn.' });
    }

    if (discount.quantity <= 0) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng.' });
    }

    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    cart.appliedDiscount = discount._id;


    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống.' });
    }
    await cart.save();
    cart = await Cart.findById(cart._id).populate('appliedDiscount');

    return res.json({
      message: 'Áp dụng mã giảm giá thành công.',
      appliedDiscount: cart.appliedDiscount,
    });
  } catch (error) {
    console.error('Lỗi áp dụng mã giảm giá:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
export const removeDiscountFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(400).json({ message: 'Không tìm thấy giỏ hàng.' });
    }

    cart.appliedDiscount = null;

    await cart.save();

    return res.json({ message: 'Đã gỡ mã giảm giá.' });
  } catch (error) {
    console.error('Lỗi khi gỡ mã giảm giá:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

