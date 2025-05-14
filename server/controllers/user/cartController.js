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
export const setCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = req.body || [];

    // Lọc ra các item có quantity > 0
    const validItems = items.filter(item => item.quantity > 0);

    // Format lại giỏ hàng
    const formattedItems = validItems.map(item => ({
      product: item.productId,
      quantity: item.quantity
    }));

    // Tìm giỏ hàng của user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: formattedItems });
    } else {
      cart.items = formattedItems; // Ghi đè toàn bộ giỏ
    }

    await cart.save();


    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi cập nhật giỏ hàng' });
  }
};







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

