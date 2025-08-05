import Discount from '../models/Discount.js';

export async function getApplicableDiscounts(cart, userId) {
    // Lấy các discount còn hiệu lực
    const now = new Date();
    const discounts = await Discount.find({
        isActive: true,
        validFrom: { $lte: now },
        validTo: { $gte: now },
        quantity: { $gt: 0 }
    });

    // Lọc discount phù hợp
    const applicableDiscounts = [];

    for (const discount of discounts) {
        const cond = discount.conditions || {};

        // Tính tổng giá trị đơn hàng (chưa có discount)
        let cartTotal = 0;
        let totalQuantity = 0;
        const cartCategories = new Set();
        const cartBrands = new Set();

        for (const item of cart.items) {
            const product = item.product;
            const price = product.price || 0;
            const quantity = item.quantity || 0;
            
            cartTotal += price * quantity;
            totalQuantity += quantity;
            
            if (product.category) {
                cartCategories.add(String(product.category));
            }
            if (product.brand) {
                cartBrands.add(String(product.brand));
            }
        }

        // 1. Kiểm tra giá trị đơn hàng tối thiểu
        if (cartTotal < (cond.minimumOrderValue || 0)) {
            continue;
        }

        // 2. Kiểm tra số lượng sản phẩm tối thiểu
        if (totalQuantity < (cond.minimumQuantity || 1)) {
            continue;
        }

        // 3. Kiểm tra danh mục sản phẩm áp dụng
        if (cond.applicableCategories && cond.applicableCategories.length > 0) {
            const hasCategory = cond.applicableCategories.some(catId => 
                cartCategories.has(String(catId))
            );
            if (!hasCategory) {
                continue;
            }
        }

        // 4. Kiểm tra thương hiệu áp dụng
        if (cond.applicableBrands && cond.applicableBrands.length > 0) {
            const hasBrand = cond.applicableBrands.some(brandId => 
                cartBrands.has(String(brandId))
            );
            if (!hasBrand) {
                continue;
            }
        }

        // 5. Kiểm tra số lần sử dụng tối đa cho mỗi user
        if (discount.usageStats && discount.usageStats.usedByUsers) {
            const userUsage = discount.usageStats.usedByUsers.find(
                u => String(u.userId) === String(userId)
            );
            if (userUsage && userUsage.usageCount >= (cond.maxUsagePerUser || 1)) {
                continue;
            }
        }

        // Nếu qua hết các điều kiện thì discount này hợp lệ
        applicableDiscounts.push(discount);
    }

    return applicableDiscounts;
}

export async function validateDiscountForCart(discount, cart, userId) {
    const cond = discount.conditions || {};

    // Tính tổng giá trị đơn hàng
    let cartTotal = 0;
    let totalQuantity = 0;

    for (const item of cart.items) {
        const product = item.product;
        const price = product.price || 0;
        const quantity = item.quantity || 0;
        
        cartTotal += price * quantity;
        totalQuantity += quantity;
    }

    // Kiểm tra các điều kiện
    if (cartTotal < (cond.minimumOrderValue || 0)) {
        return { 
            isValid: false, 
            message: `Đơn hàng phải có giá trị tối thiểu ${cond.minimumOrderValue?.toLocaleString()}đ` 
        };
    }

    if (totalQuantity < (cond.minimumQuantity || 1)) {
        return { 
            isValid: false, 
            message: `Đơn hàng phải có ít nhất ${cond.minimumQuantity} sản phẩm` 
        };
    }

    // Kiểm tra danh mục sản phẩm
    if (cond.applicableCategories && cond.applicableCategories.length > 0) {
        const cartCategories = new Set();
        for (const item of cart.items) {
            if (item.product.category) {
                cartCategories.add(String(item.product.category));
            }
        }
        
        const hasCategory = cond.applicableCategories.some(catId => 
            cartCategories.has(String(catId))
        );
        if (!hasCategory) {
            return { 
                isValid: false, 
                message: 'Mã giảm giá chỉ áp dụng cho một số danh mục sản phẩm nhất định' 
            };
        }
    }

    // Kiểm tra thương hiệu
    if (cond.applicableBrands && cond.applicableBrands.length > 0) {
        const cartBrands = new Set();
        for (const item of cart.items) {
            if (item.product.brand) {
                cartBrands.add(String(item.product.brand));
            }
        }
        
        const hasBrand = cond.applicableBrands.some(brandId => 
            cartBrands.has(String(brandId))
        );
        if (!hasBrand) {
            return { 
                isValid: false, 
                message: 'Mã giảm giá chỉ áp dụng cho một số thương hiệu nhất định' 
            };
        }
    }

    // Kiểm tra số lần sử dụng
    if (discount.usageStats && discount.usageStats.usedByUsers) {
        const userUsage = discount.usageStats.usedByUsers.find(
            u => String(u.userId) === String(userId)
        );
        if (userUsage && userUsage.usageCount >= (cond.maxUsagePerUser || 1)) {
            return { 
                isValid: false, 
                message: 'Bạn đã sử dụng hết lượt mã giảm giá này' 
            };
        }
    }

    return { isValid: true };
} 