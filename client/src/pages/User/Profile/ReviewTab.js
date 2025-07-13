import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyReviews } from '../../../redux/user/reviewSlice';

const ReviewTab = () => {
  const dispatch = useDispatch();
  const { myReviews, loading, error } = useSelector(state => state.user.userReview);

  useEffect(() => {
    dispatch(fetchMyReviews());
  }, [dispatch]);

  if (loading) return <div className="text-center py-5">Đang tải đánh giá...</div>;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;

  if (!myReviews || myReviews.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-star-half-alt mb-3" style={{ fontSize: 48, color: '#e0e7ef' }}></i>
        <h5 className="text-muted">Bạn chưa có đánh giá nào</h5>
        <p className="text-secondary">Hãy mua hàng và để lại nhận xét cho sản phẩm nhé!</p>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <h4 className="fw-bold mb-4">Đánh giá & nhận xét của bạn</h4>
      <div className="row g-3">
      {myReviews.map((review) => (
  <div className="col-12 mb-3" key={review._id}>
    <div className="card shadow-sm rounded-4 d-flex flex-row align-items-start p-3 gap-3">
      {/* Hình ảnh sản phẩm */}
      <img
        src={review.product.images?.[0] || '/default-product.png'}
        alt={review.product.name}
        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
      />

      {/* Nội dung đánh giá */}
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center">
          <strong className="text-dark">{review.product.name}</strong>
          <small className="text-muted">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</small>
        </div>

        {/* Sao đánh giá */}
        <div className="mb-1">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`fas fa-star${i < review.rating ? ' text-warning' : ' text-muted'}`}
              style={{ fontSize: 14 }}
            ></i>
          ))}
        </div>

        {/* Nội dung bình luận */}
        <div className="text-muted small">{review.comment}</div>

        {/* Ảnh review nếu có */}
        {review.images && (
          <img
            src={review.images}
            alt="Ảnh đánh giá"
            className="mt-2"
            style={{ maxWidth: 100, borderRadius: 6 }}
          />
        )}
      </div>
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default ReviewTab; 