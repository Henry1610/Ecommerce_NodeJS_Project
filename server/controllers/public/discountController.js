import Discount from "../../models/Discount.js";

export const getPublicDiscounts = async (req, res) => {
    try {
      const now = new Date();
  
      const discounts = await Discount.find({
        isActive: true,
        validFrom: { $lte: now },
        validTo: { $gte: now },
      });
  
      res.status(200).json(discounts);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  // export const getPublicDiscountById = async (req, res) => {
  //     try {
  //         const { id } = req.params;
  //         const discount = await Discount.findById(id);
  //         if (!discount) {
  //             return res.status(404).json({ message: 'Discount not found' });
  //         }
  //         res.status(200).json(discount);
  //     } catch (error) {
  //         res.status(500).json({ message: 'Server error', error: error.message });
  //     }
  // };