import ShippingAddress from '../../models/shippingAddress.js';

export const getSavedShippingAddresses = async (req, res) => {
    try {

      const shippingAddresses = await ShippingAddress.find({ user: req.user.id }).populate('city');
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
    const { fullName, address, city, phoneNumber,isDefault } = req.body;

    // Kiểm tra đủ thông tin
    if (!fullName || !address || !city || !phoneNumber) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin địa chỉ.' });
    }

    const newAddress = new ShippingAddress({
      user: req.user.id,
      fullName,
      address,
      city,
      phoneNumber,
      isDefault
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error('Lỗi tạo địa chỉ giao hàng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo địa chỉ giao hàng.', error });
  }
};
export const getShippingAddressById = async (req, res) => {
  try {
    
    const address = await ShippingAddress.findById( req.params.id).populate('city');

    if (!address) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ giao hàng' });
    }

    // Kiểm tra quyền truy cập: chỉ user chủ sở hữu mới được xem
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền truy cập địa chỉ này' });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy địa chỉ giao hàng', error });
  }
};
export const getDefaultShippingAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const defaultAddress = await ShippingAddress.findOne({
      user: userId,
      isDefault: true
    }).populate('city'); 

    if (!defaultAddress) {
      return res.status(404).json({ message: 'No default address found' });
    }

    res.status(200).json(defaultAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

