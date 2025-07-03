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
          <div className="col-12 col-md-6 col-lg-4" key={review._id}>
            <div className="card shadow-sm rounded-4 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <img src={review.product?.images?.[0] || '/default-product.png'} alt="product" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                  <div>
                    <div className="fw-bold text-dark">{review.product?.name || 'Sản phẩm'}</div>
                    <div className="small text-muted">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star${i < review.rating ? ' text-warning' : ' text-muted'}`}
                      style={{ fontSize: 15 }}
                    ></i>
                  ))}
                </div>
                <div className="mb-2 text-secondary" style={{ fontSize: 15 }}>
                  {review.comment}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewTab; 