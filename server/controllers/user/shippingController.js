exports.getSavedShippingAddresses = async (req, res) => {
    try {
      const shippingAddresses = await Shipping.find({ user: req.user._id });
      res.json(shippingAddresses);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy địa chỉ giao hàng', error });
    }
  };
  