import ShippingZone from '../../models/shippingZone.js';

// Lấy tất cả shipping zones
export const getShippingZones = async (req, res) => {
  try {
    const zones = await ShippingZone.find();
    res.status(200).json(zones);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách vùng vận chuyển', error: error.message });
  }
};

// Lấy chi tiết một shipping zone theo ID
export const getShippingZoneById = async (req, res) => {
  try {
    const zone = await ShippingZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Không tìm thấy vùng vận chuyển' });
    }
    res.status(200).json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Tạo một shipping zone mới
export const createShippingZone = async (req, res) => {
  try {
    const { city, fee } = req.body;

    const existingZone = await ShippingZone.findOne({ city });
    if (existingZone) {
      return res.status(400).json({ message: 'Vùng vận chuyển đã tồn tại' });
    }

    const newZone = new ShippingZone({ city, fee });
    await newZone.save();

    res.status(201).json({ message: 'Tạo vùng vận chuyển thành công', zone: newZone });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật một shipping zone
export const updateShippingZone = async (req, res) => {
  try {
    const { city, fee } = req.body;
    const zone = await ShippingZone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({ message: 'Không tìm thấy vùng vận chuyển' });
    }

    zone.city = city || zone.city;
    zone.fee = fee !== undefined ? fee : zone.fee;

    await zone.save();
    res.status(200).json({ message: 'Cập nhật vùng vận chuyển thành công', zone });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xoá một shipping zone
export const deleteShippingZone = async (req, res) => {
  try {
    const zone = await ShippingZone.findByIdAndDelete(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Không tìm thấy vùng vận chuyển' });
    }

    res.status(200).json({ message: 'Xoá vùng vận chuyển thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
