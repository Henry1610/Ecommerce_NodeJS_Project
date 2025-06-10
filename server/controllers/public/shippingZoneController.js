import ShippingZone from "../../models/ShippingZone.js";

export const getPublicShippingZones = async (req, res) => {
    try {
      const zones = await ShippingZone.find(); 
      res.status(200).json(zones);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy vùng vận chuyển', error: error.message });
    }
  };
  export const getPublicShippingZoneById = async (req, res) => {
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