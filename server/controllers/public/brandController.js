import Brand from "../../models/Brand.js";

export const getPublicBrands = async (req, res) => {
    try {
      const brands = await Brand.find({ isActive: true });
      res.status(200).json(brands);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  export const getPublicBrandById = async (req, res) => {
    try {
        const { id } = req.params;


        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};