import Cart from '../../models/Cart.js';
import Discount from '../../models/Discount.js'
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
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    res.json(populatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error); // Log thêm lỗi để debug

    res.status(500).json({ message: 'Không thể thêm vào giỏ hàng', error });
  }
};
export const setCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { items,appliedDiscount } = req.body || [];
    //  console.log(' Items:', req.body);

 


    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { items,appliedDiscount },
     
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
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(400).json({ message: 'Không tìm thấy giỏ hàng.' });
    }

    cart.discount = null;

    await cart.save();

    return res.json({ message: 'Đã gỡ mã giảm giá.' });
  } catch (error) {
    console.error('Lỗi khi gỡ mã giảm giá:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

