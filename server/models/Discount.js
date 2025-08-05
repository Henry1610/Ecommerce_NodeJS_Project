import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    quantity: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, default: null, min: 0 },
    
    // Điều kiện áp dụng cơ bản
    conditions: {
        // Giá trị đơn hàng tối thiểu
        minimumOrderValue: { type: Number, default: 0, min: 0 },
        
        // Số lượng sản phẩm tối thiểu trong đơn hàng
        minimumQuantity: { type: Number, default: 1, min: 1 },
        
        // Danh mục sản phẩm được áp dụng (nếu rỗng thì áp dụng cho tất cả)
        applicableCategories: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category' 
        }],
        
        // Thương hiệu được áp dụng (nếu rỗng thì áp dụng cho tất cả)
        applicableBrands: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Brand' 
        }],
        
        // Số lần sử dụng tối đa cho mỗi user
        maxUsagePerUser: { type: Number, default: 1, min: 1 }
    },
    
    // Thống kê sử dụng đơn giản
    usageStats: {
        totalUsed: { type: Number, default: 0 },
        usedByUsers: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            usageCount: { type: Number, default: 0 }
        }]
    }
}, {
    timestamps: true
});

export default mongoose.model('Discount', discountSchema);

