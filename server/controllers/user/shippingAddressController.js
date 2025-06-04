import ShippingAddress from '../../models/shippingAddress.js';

export const getSavedShippingAddresses = async (req, res) => {
    try {
      const shippingAddresses = await ShippingAddress.find({ user: req.user._id });
      res.json(shippingAddresses);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy địa chỉ giao hàng', error });
    }
  };

export const updateShippingAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;

    const updatedAddress = await ShippingAddress.findByIdAndUpdate(
      addressId,
      { $set: updates },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ giao hàng' });
    }

    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật địa chỉ giao hàng' });
  }
};
export const createShippingAddress = async (req, res) => {
  try {
    const { fullName, address, city, phoneNumber } = req.body;

    // Kiểm tra đủ thông tin
    if (!fullName || !address || !city || !phoneNumber) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin địa chỉ.' });
    }

    const newAddress = new ShippingAddress({
      user: req.user.id, // lấy từ middleware xác thực
      fullName,
      address,
      city,
      phoneNumber
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error('Lỗi tạo địa chỉ giao hàng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo địa chỉ giao hàng.', error });
  }
};