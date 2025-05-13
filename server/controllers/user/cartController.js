import Cart from '../../models/Cart.js';

export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) return res.json({ items: [] });

    res.json(cart);
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
    res.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error); // Log thêm lỗi để debug

    res.status(500).json({ message: 'Không thể thêm vào giỏ hàng', error });
  }
};

export const updateQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Sản phẩm không có trong giỏ' });

    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Không thể cập nhật số lượng', error });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Không thể xóa sản phẩm khỏi giỏ', error });
  }
};

// export const initCart = async (req, res) => {
//   const userId = req.user._id;

//   try {
//     const existingCart = await Cart.findOne({ user: userId });
//     if (existingCart) return res.status(400).json({ message: 'Giỏ hàng đã tồn tại' });

//     const newCart = new Cart({ user: userId, items: [] });
//     await newCart.save();

//     res.status(201).json({ message: 'Đã tạo giỏ hàng rỗng', cart: newCart });
//   } catch (error) {
//     res.status(500).json({ message: 'Không thể tạo giỏ hàng', error });
//   }
// };

