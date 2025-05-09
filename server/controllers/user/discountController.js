// [GET] /api/users/discounts/check?code=SUMMER2025
exports.checkDiscountCode = async (req, res) => {
    try {
      const { code } = req.query;
  
      const discount = await Discount.findOne({
        code: code.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
      });
  
      if (!discount) {
        return res.status(404).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' });
      }
  
      res.json({
        code: discount.code,
        discountPercent: discount.discountPercent,
        description: discount.description
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi kiểm tra mã giảm giá', error });
    }
  };
  