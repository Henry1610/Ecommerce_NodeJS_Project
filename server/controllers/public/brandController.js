import Brand from "../../models/Brand.js";

export const getPublicBrands = async (req, res) => {
    try {
      const brands = await Brand.find({ isActive: true });
      res.status(200).json(brands);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };