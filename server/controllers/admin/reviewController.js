import Review from '../../models/Review.js';
import AdminReviewResponse from '../../models/AdminReviewResponse.js';

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).populate('user', 'username email').populate('product', 'name images');
        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
}; 

export const createAdminReviewResponse = async (req, res) => {
    try {
        const { reviewId, responseContent } = req.body;
        const adminId = req.user.id; // Assuming req.user.id contains the authenticated admin's ID

        // Check if a response for this review already exists
        const existingResponse = await AdminReviewResponse.findOne({ review: reviewId });
        if (existingResponse) {
            return res.status(400).json({ message: 'Phản hồi cho đánh giá này đã tồn tại. Vui lòng cập nhật thay vì tạo mới.' });
        }

        const newResponse = new AdminReviewResponse({
            review: reviewId,
            admin: adminId,
            responseContent,
        });

        await newResponse.save();
        res.status(201).json({ message: 'Phản hồi quản trị viên được tạo thành công', response: newResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

export const updateAdminReviewResponse = async (req, res) => {
    try {
        const { responseId } = req.params;
        const { responseContent } = req.body;

        const response = await AdminReviewResponse.findById(responseId);

        if (!response) {
            return res.status(404).json({ message: 'Phản hồi quản trị viên không tìm thấy' });
        }

        response.responseContent = responseContent;
        await response.save();

        res.status(200).json({ message: 'Phản hồi quản trị viên được cập nhật thành công', response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

export const getAdminReviewResponseByReviewId = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const response = await AdminReviewResponse.findOne({ review: reviewId }).populate('admin', 'username');

        if (!response) {
            return res.status(404).json({ message: 'Không tìm thấy phản hồi cho đánh giá này' });
        }

        res.status(200).json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
}; 