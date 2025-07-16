import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllReviewsAdmin,
  createAdminReviewResponse,
  updateAdminReviewResponse,
  getAdminReviewResponseByReviewId,
} from '../../../redux/admin/reviewSlice';
import './ReviewList.css'; // Import CSS file for styling

function ReviewList() {
  const dispatch = useDispatch();
  const { reviews, reviewResponses, loading, error } = useSelector((state) => state.admin.adminReviews);
  const [responseInputs, setResponseInputs] = useState({});

  useEffect(() => {
    dispatch(getAllReviewsAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (reviews.length > 0) {
      reviews.forEach(review => {
        if (!reviewResponses[review._id]) { // Only fetch if not already in state
            dispatch(getAdminReviewResponseByReviewId(review._id));
        }
      });
    }
  }, [reviews, reviewResponses, dispatch]);

  const handleResponseChange = (reviewId, value) => {
    setResponseInputs(prev => ({
      ...prev,
      [reviewId]: value,
    }));
  };

  const handleSubmitResponse = (reviewId) => {
    const responseContent = responseInputs[reviewId];
    if (!responseContent) {
      alert('Vui lòng nhập phản hồi.');
      return;
    }

    const existingResponse = reviewResponses[reviewId];
    if (existingResponse && existingResponse._id) {
      dispatch(updateAdminReviewResponse({ responseId: existingResponse._id, responseContent }));
    } else {
      dispatch(createAdminReviewResponse({ reviewId, responseContent }));
    }
    setResponseInputs(prev => ({ ...prev, [reviewId]: '' })); // Clear input after submission
  };

  if (loading) {
    return <div>Đang tải đánh giá...</div>;
  }

  if (error) {
    return <div>Lỗi: {error.message || 'Không thể tải đánh giá.'}</div>;
  }

  return (

    <div className="container py-4">
      <h4 className="mb-4 text-secondary fw-semibold">📋 Danh sách Đánh giá Sản phẩm</h4>

      {reviews.length === 0 ? (
        <p className="text-muted fst-italic small">Chưa có đánh giá nào.</p>
      ) : (
        <div className="vstack gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="card border-0 shadow-sm bg-body-tertiary rounded-4 p-3">
              <div className="row g-4 align-items-start">
                {/* --- Cột trái: Thông tin đánh giá --- */}
                <div className="col-md-7 d-flex flex-column gap-2">
                  {/* Tên + ảnh sản phẩm */}
                  <div className="d-flex align-items-center gap-3">
                    {review.product?.images?.[0] && (
                      <img
                        src={review.product.images[0]}
                        alt="Ảnh sản phẩm"
                        className="rounded-2 border"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    )}
                    <h5 className="mb-0 text-dark fw-bold">
                      {review.product?.name || 'Sản phẩm không xác định'}
                    </h5>
                  </div>

                  {/* User + email + đánh giá sao trên cùng một dòng */}
                  <div className="d-flex align-items-center flex-wrap gap-3 small text-muted">
                    <span>
                      <i className="fa-solid fa-user me-1"></i>
                      <strong>{review.user?.username}</strong> ({review.user?.email})
                    </span>
                    <span className="text-warning">
                      <i className="fa-solid fa-star me-1"></i>
                      {review.rating} sao
                    </span>
                  </div>

                  {/* Nhận xét */}
                  <div className="small text-body">
                    <i className="fa-solid fa-comment-dots me-2 text-muted"></i>
                    <span className="fw-semibold text-muted">Nhận xét:</span> {review.comment}
                  </div>

                  {/* Ảnh người dùng đánh giá */}
                  {review.images?.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-1">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Ảnh đánh giá ${idx + 1}`}
                          className="rounded-2 border"
                          style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Ngày đánh giá */}
                  <div className="small text-muted">
                    <i className="fa-regular fa-clock me-1"></i>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>


                {/* --- Cột phải: Phản hồi admin --- */}
                <div className="col-md-5">
                  <div className="bg-white border p-3 rounded-3 shadow-sm h-100">
                    <p className="fw-semibold text-secondary small mb-2">🗣️ Phản hồi từ Admin:</p>

                    {reviewResponses[review._id] ? (
                      <>
                        <textarea
                          className="form-control form-control-sm mb-2"
                          rows="3"
                          value={responseInputs[review._id] || reviewResponses[review._id].responseContent || ''}
                          onChange={(e) => handleResponseChange(review._id, e.target.value)}
                          placeholder="Chỉnh sửa phản hồi..."
                        ></textarea>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleSubmitResponse(review._id)}
                        >
                          Cập nhật
                        </button>
                      </>
                    ) : (
                      <>
                        <textarea
                          className="form-control form-control-sm mb-2"
                          rows="3"
                          value={responseInputs[review._id] || ''}
                          onChange={(e) => handleResponseChange(review._id, e.target.value)}
                          placeholder="Nhập phản hồi của admin..."
                        ></textarea>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleSubmitResponse(review._id)}
                        >
                          Gửi phản hồi
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      )}
    </div>

  );
}

export default ReviewList;