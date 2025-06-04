import ShippingZone from "../../models/ShippingZone.js";

export const getPublicShippingZones = async (req, res) => {
    try {
      const zones = await ShippingZone.find(); 
      res.status(200).json(zones);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy vùng vận chuyển', error: error.message });
    }
  };
  