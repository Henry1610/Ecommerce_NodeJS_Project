import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    try {
        const { totalAmount, currency = 'vnd', metadata = {} } = req.body;

        // Validate input
        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Số tiền thanh toán không hợp lệ'
            });
        }

        // Tạo Payment Intent với Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount), // Stripe yêu cầu số nguyên (đơn vị nhỏ nhất của tiền tệ)
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: req.user?.id || 'guest',
                ...metadata
            }
        });

        res.status(200).json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency
            }
        });

    } catch (error) {
        console.error('Lỗi tạo Payment Intent:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo Payment Intent',
            error: error.message
        });
    }
};

// Controller cho việc xác nhận thanh toán
export const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment Intent ID là bắt buộc'
            });
        }

        // Lấy thông tin Payment Intent từ Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // TODO: Xử lý logic sau khi thanh toán thành công
            // - Tạo đơn hàng trong database
            // - Xóa giỏ hàng
            // - Gửi email xác nhận
            // - Cập nhật inventory

            res.status(200).json({
                success: true,
                message: 'Thanh toán thành công',
                data: {
                    paymentIntentId: paymentIntent.id,
                    amount: paymentIntent.amount,
                    status: paymentIntent.status
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Thanh toán chưa hoàn thành',
                status: paymentIntent.status
            });
        }

    } catch (error) {
        console.error('Lỗi xác nhận thanh toán:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xác nhận thanh toán',
            error: error.message
        });
    }
};

// Controller để lấy public key
export const getPublicKey = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                publicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy public key'
        });
    }
};

