import Discount from "../../models/Discount.js";

export const getPublicDiscounts = async (req, res) => {
    try {
      const now = new Date();
      console.log("Current time:", now);

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
