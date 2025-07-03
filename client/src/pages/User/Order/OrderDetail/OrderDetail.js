import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderByOrderNumber } from '../../../../redux/user/orderSlice';
import { requestRefund } from '../../../../redux/user/paymentSlice';

import formatDateTime from '../../../../untils/dateUtils';
import Swal from 'sweetalert2';
import { createReview, getReviewByOrderNumberAndProduct, updateReviewByOrderNumberAndProduct } from '../../../../redux/user/reviewSlice';
const MAX_IMAGES = 3;
const MAX_REVIEW_LENGTH = 500;
const OrderDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderNumber } = useParams();
  const { orderDetail, loading, error } = useSelector(state => state.user.userOrder);
  const { review } = useSelector(state => state.user.userReview)
  // console.log('review:',review);

  useEffect(() => {
    if (orderNumber) {
      dispatch(fetchOrderByOrderNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const handleRequestCancel = (orderNumber) => {
    if (!orderNumber) return;

    Swal.fire({
      title: 'Bạn có chắc muốn hủy đơn hàng?',
      text: `Mã đơn: ${orderNumber}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, hủy ngay',
      cancelButtonText: 'Không',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(requestRefund(orderNumber));
        Swal.fire('Đã gửi yêu cầu hủy!', '', 'success');
      }
    });
  };
  const getOrderStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao thành công';
      case 'cancel_requested':
        return 'Yêu cầu hủy';
      case 'cancelled':
        return 'Đã hủy';
      case 'cancel_rejected':
        return 'Từ chối hủy';
      default:
        return 'Không xác định';
    }
  }
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showViewReviewModal, setShowViewReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenReviewModal = (item) => {
    setSelectedProduct(item);
    setShowReviewModal(true);
  };
  const handleOpenViewReviewModal = async (item) => {
    setSelectedProduct(item);
    setShowViewReviewModal(true);
  };
  useEffect(() => {
    if (showViewReviewModal && selectedProduct) {
      dispatch(getReviewByOrderNumberAndProduct({
        orderNumber: orderDetail.orderNumber,
        productId: selectedProduct.product._id
      }));
    }
  }, [showViewReviewModal, selectedProduct, dispatch, orderDetail?.orderNumber]);


  const handleCloseReviewModal = () => {
    setSelectedProduct(null);
    setShowReviewModal(false);
  };


  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra: {error}</div>;
  }

  if (!orderDetail) {
    return <div>Không tìm thấy đơn hàng.</div>;
  }

  // Calculate progress
  const totalSteps = 4;
  let completedSteps = 1; // "Đặt hàng" step is always completed
  const statusSet = new Set(orderDetail.statusHistory.map(item => item.status));

  if (statusSet.has('processing')) completedSteps++;
  if (statusSet.has('shipped')) completedSteps++;
  if (statusSet.has('delivered')) completedSteps++;

  const progressPercent = (completedSteps / totalSteps) * 100;

  // Status mapping
  const statusMap = {
    pending: { icon: 'bi-cart-fill', label: 'Đặt hàng' },
    processing: { icon: 'bi-credit-card-fill', label: 'Đang xử lý' },
    shipped: { icon: 'bi-truck', label: 'Đang giao' },
    delivered: { icon: 'bi-house-door-fill', label: 'Đã giao' }
  };

  // Create steps array
  const steps = Object.entries(statusMap).map(([statusKey, { icon, label }]) => {
    const found = orderDetail.statusHistory.find(entry => entry.status === statusKey);
    return {
      icon,
      label,
      completed: Boolean(found),
      date: found ? new Date(found.updatedAt).toLocaleString() : '-'
    };
  });

  // Calculate subtotal
  const subtotal = orderDetail.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );



  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': {
        text: 'Mới tạo',
        style: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue
        icon: 'bi-clock'
      },
      'processing': {
        text: 'Đang xử lý',
        style: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Orange
        icon: 'bi-gear'
      },
      'shipped': {
        text: 'Đã giao cho đơn vị V/C',
        style: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // Purple
        icon: 'bi-truck'
      },
      'delivered': {
        text: 'Đã giao thành công',
        style: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green
        icon: 'bi-check-circle'
      },
      'cancel_requested': {
        text: 'Người dùng yêu cầu hủy',
        style: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', // Orange-Red
        icon: 'bi-exclamation-triangle'
      },
      'cancelled': {
        text: 'Đã hủy thành công',
        style: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Red
        icon: 'bi-x-circle'
      },
      'cancel_rejected': {
        text: 'Từ chối hủy đơn',
        style: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', // Gray
        icon: 'bi-shield-x'
      }
    };

    const config = statusConfig[status] || {
      text: status,
      style: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      icon: 'bi-question-circle'
    };

    return (
      <span
        className="badge fs-6 px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-1"
        style={{
          background: config.style,
          color: 'white'
        }}
      >
        <i className={`bi ${config.icon}`}></i>
        {config.text}
      </span>
    );
  };

  const renderCancelButton = () => {
    // Chỉ cho phép hủy đơn hàng khi status là pending hoặc processing
    const allowedCancelStatuses = ['pending', 'processing'];
    const canCancel = allowedCancelStatuses.includes(orderDetail.status);

    if (!canCancel) return null;

    return (
      <button
        className='btn bg-danger text-white me-2 fw-bold'
        disabled={orderDetail.status === 'cancel_requested'}
        onClick={() => handleRequestCancel(orderNumber)}
      >
        {orderDetail.status === 'cancel_requested' ? 'Yêu cầu đã gửi' : 'Yêu cầu hoàn tiền'}
      </button>
    );
  };

  const renderStatusSteps = () => (
    <div className="row g-3">
      {steps.map(({ icon, label, date, completed }) => (
        <div key={label} className="col-6 col-lg-3 text-center">
          <div className="position-relative">
            <div
              className="mx-auto mb-3 rounded-circle d-flex justify-content-center align-items-center shadow-lg transition-all"
              style={{
                width: 64,
                height: 64,
                background: completed
                  ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                  : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                transform: completed ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              <i className={`bi ${icon} fs-4 ${completed ? 'text-white' : 'text-dark'}`}></i>
            </div>
            <span className={`d-block fw-semibold small mb-1 ${completed ? 'text-dark' : 'text-secondary'}`}>
              {label}
            </span>
            <span className="text-muted small">{formatDateTime(date)}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProductItem = (item, index) => (
    <div
      key={index}
      className="d-flex align-items-center border rounded-4 p-3 shadow-sm position-relative overflow-hidden"
      style={{
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {orderDetail.status === 'delivered' && (
        item.reviewed === false ? (
          <button
            className="btn btn-sm btn-outline-primary position-absolute"
            style={{
              top: 10,
              right: 10,
              zIndex: 1,
              fontSize: '0.75rem',
              padding: '4px 8px',
              borderRadius: '12px'
            }}
            onClick={(e) => {
              e.stopPropagation(); // Tránh kích hoạt sự kiện click của card
              handleOpenReviewModal(item); // Mở modal đánh giá
            }}
          >
            Đánh giá
          </button>
        ) : (
          <button
            className="btn btn-sm btn-outline-secondary position-absolute"
            style={{
              top: 10,
              right: 10,
              zIndex: 1,
              fontSize: '0.75rem',
              padding: '4px 8px',
              borderRadius: '12px'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenViewReviewModal(item);
            }}
          >
            Xem đánh giá
          </button>
        )
      )}

      <div
        className="rounded-3 overflow-hidden me-3 shadow-sm"
        style={{
          width: 60,
          height: 60,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}
      >
        <img
          src={item.product.images[0]}
          alt={item.name}
          className="img-fluid w-100 h-100 object-fit-cover"
        />
      </div>

      <div className="flex-grow-1">
        <h3 className="fw-bold mb-1 text-dark fs-6">{item.name}</h3>
        <p className="text-muted mb-2 small">Color: {item.product.color}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span
            className="badge rounded-pill px-2 py-1"
            style={{
              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
              color: '#4338ca',
              fontSize: '0.75rem'
            }}
          >
            Số lượng: {item.quantity}
          </span>
          <div>
            <span
              className="fw-bold fs-6 me-2"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {item.price.toLocaleString()}đ
            </span>
            <span
              className="text-muted text-decoration-line-through small fw-semibold"
              style={{ fontSize: '0.9rem' }}
            >
              {item.originalPrice.toLocaleString()}đ
            </span>
          </div>
        </div>
      </div>

    </div>

  );

  const ReviewModal = ({ product, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [previewImages, setPreviewImages] = useState([]); // base64 dùng để hiển thị
    const [imageFiles, setImageFiles] = useState([]); // File dùng để upload

    const fileInputRef = useRef(null);

    const handleRatingClick = (value) => setRating(value);
    const handleRatingHover = (value) => setHoverRating(value);
    const handleRatingLeave = () => setHoverRating(0);

    const handleCommentChange = (e) => {
      if (e.target.value.length <= MAX_REVIEW_LENGTH) {
        setComment(e.target.value);
      }
    };

    const handleImageUpload = (e) => {
      if (e.target.files && previewImages.length < MAX_IMAGES) {
        const file = e.target.files[0];

        // Preview
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target.result === 'string') {
            setPreviewImages((prev) => [...prev, event.target.result]);
            setImageFiles((prev) => [...prev, file]); // Save real file
          }
        };
        reader.readAsDataURL(file);
      }
    };


    const triggerFileInput = () => fileInputRef.current?.click();

    const removeImage = (index) => {
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };


    const handleSubmit = async () => {
      if (rating > 0) {
        const result = await Swal.fire({
          title: 'Xác nhận gửi đánh giá?',
          text: 'Bạn sẽ không thể chỉnh sửa sau khi gửi!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Gửi đánh giá',
          cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append('product', product._id);
          formData.append('rating', rating);
          formData.append('comment', comment);
          formData.append('orderNumber', orderDetail.orderNumber);

          imageFiles.slice(0, 3).forEach((file) => {
            formData.append('images', file);
          });

          // Gửi đánh giá
          dispatch(createReview({ slug: product.slug, formData }));

          // Hiển thị thông báo thành công
          Swal.fire('Đã gửi!', 'Cảm ơn bạn đã đánh giá sản phẩm.', 'success');

          // Reset state
          setRating(0);
          setHoverRating(0);
          setComment('');
          setPreviewImages([]);
          setImageFiles([]);

          // Đóng modal
          onClose();
        }
      }
    };



    return (
      <div
        className="modal show fade d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered modal-md" role="document"
        >
          <div className="modal-content" style={{ height: '650px' }}
          >
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Đánh giá sản phẩm</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* product content */}
              <div className="d-flex p-3 border-bottom gap-3 align-items-center">
                <img
                  src={product.images[0]}
                  alt={product.slug}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                />
                <div className="text-muted small">
                  <strong className="text-dark">{product.name}</strong>
                  <div>Màu: {product.color} / Size: 42</div>
                </div>
              </div>

              {/* Rating stars */}
              <div className="my-3">
                <label className="form-label fw-semibold">Đánh giá của bạn:</label>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn p-0 border-0"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => handleRatingHover(star)}
                      onMouseLeave={handleRatingLeave}
                    >
                      <i
                        className={`fas fa-star fs-4 ${(hoverRating || rating) >= star ? 'text-warning' : 'text-secondary'
                          }`}
                      ></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-3">
                <label className="form-label fw-bold">Nội dung đánh giá:</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm..."
                ></textarea>
                <div className="text-end text-muted small">
                  {comment.length}/{MAX_REVIEW_LENGTH} ký tự
                </div>
              </div>

              {/* Image upload */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0">Thêm hình ảnh</label>
                  <small className="text-muted">{previewImages.length}/{MAX_IMAGES}</small>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {previewImages.map((image, index) => (
                    <div
                      key={index}
                      className="position-relative border rounded overflow-hidden"
                      style={{ width: 80, height: 80 }}
                    >
                      <img
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-light position-absolute top-0 end-0 m-1 p-1 rounded-circle"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times text-danger"></i>
                      </button>
                    </div>
                  ))}

                  {previewImages.length < MAX_IMAGES && (
                    <div
                      className="d-flex flex-column justify-content-center align-items-center border rounded text-center text-muted"
                      style={{ width: 80, height: 80, cursor: 'pointer' }}
                      onClick={triggerFileInput}
                    >
                      <i className="fas fa-camera mb-1"></i>
                      <small>Thêm ảnh</small>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="d-none"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button
                type="button"
                className={`btn ${rating > 0 ? 'btn-primary' : 'btn-secondary disabled'}`}
                disabled={rating === 0}
                onClick={handleSubmit}
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ViewReviewModal = ({ review, onClose }) => {
    const dispatch = useDispatch();

    const [rating, setRating] = useState(review?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(review?.comment || '');

    const [imagesFromServer, setImagesFromServer] = useState(review?.images || []); // ảnh cũ (URL)
    const [imageFiles, setImageFiles] = useState([]); // ảnh mới (File)
    const fileInputRef = useRef(null);

    // Xử lý khi người dùng chọn file mới
    const handleImageUpload = (e) => {
      if (e.target.files && imageFiles.length + imagesFromServer.length < MAX_IMAGES) {
        const file = e.target.files[0];
        setImageFiles((prev) => [...prev, file]);
      }
    };

    // Gộp ảnh từ server và ảnh mới để render
    const renderedImages = [
      ...imagesFromServer.map((src) => ({
        src,
        isNew: false,
      })),
      ...imageFiles.map((file) => ({
        src: URL.createObjectURL(file),
        isNew: true,
        file,
      })),
    ];

    const removeImage = (index) => {
      const image = renderedImages[index];
      if (image.isNew) {
        setImageFiles((prev) => prev.filter((_, i) => i !== index - imagesFromServer.length));
      } else {
        setImagesFromServer((prev) => prev.filter((_, i) => i !== index));
      }
    };

    const handleSubmit = async () => {
      if (rating > 0) {
        const result = await Swal.fire({
          title: 'Xác nhận cập nhật lại đánh giá?',
          text: 'Bạn sẽ không thể chỉnh sửa sau khi gửi!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Gửi đánh giá',
          cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append('rating', rating);
          formData.append('comment', comment);

          // Ảnh cũ cần giữ lại
          imagesFromServer.forEach((img) => formData.append('oldImages', img));
          // Ảnh mới upload
          imageFiles.forEach((file) => formData.append('images', file));

          dispatch(
            updateReviewByOrderNumberAndProduct({
              orderNumber: review.orderNumber,
              productId: review.product._id,
              formData,
            })
          )
            .unwrap()
            .then(() => {
              Swal.fire('Đã cập nhật!', 'Cảm ơn bạn đã đánh giá sản phẩm.', 'success');
              onClose();
            })
            .catch((err) => {
              Swal.fire('Lỗi', err.message || 'Cập nhật đánh giá thất bại', 'error');
            });
        }
      }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const handleRatingClick = (value) => setRating(value);
    const handleRatingHover = (value) => setHoverRating(value);
    const handleRatingLeave = () => setHoverRating(0);
    const handleCommentChange = (e) => {
      if (e.target.value.length <= MAX_REVIEW_LENGTH) {
        setComment(e.target.value);
      }
    };

    return (
      <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-md" role="document">
          <div className="modal-content" style={{ height: '650px' }}>
            <div className="modal-header">
              <h5 className="modal-title">Đánh giá sản phẩm</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {/* Product Info */}
              <div className="d-flex p-3 border-bottom gap-3 align-items-center">
                <img
                  src={review?.images?.[0]}
                  alt={review?.product.slug}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                />
                <div className="text-muted small">
                  <strong className="text-dark">{review?.product.name}</strong>
                  <div>Màu: {review?.product.color} / Size: 42</div>
                </div>
              </div>

              {/* Rating */}
              <div className="my-3">
                <label className="form-label fw-semibold">Đánh giá của bạn:</label>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn p-0 border-0"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => handleRatingHover(star)}
                      onMouseLeave={handleRatingLeave}
                    >
                      <i
                        className={`fas fa-star fs-4 ${((hoverRating || rating) >= star ? 'text-warning' : 'text-secondary')}`}
                      ></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-3">
                <label className="form-label fw-bold">Nội dung đánh giá:</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm..."
                ></textarea>
                <div className="text-end text-muted small">
                  {comment?.length}/{MAX_REVIEW_LENGTH} ký tự
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0">Thêm hình ảnh</label>
                  <small className="text-muted">
                    {renderedImages.length}/{MAX_IMAGES}
                  </small>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {renderedImages.map((image, index) => (
                    <div
                      key={index}
                      className="position-relative border rounded overflow-hidden"
                      style={{ width: 80, height: 80 }}
                    >
                      <img
                        src={image.src}
                        alt={`Uploaded ${index + 1}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-light position-absolute top-0 end-0 m-1 p-1 rounded-circle"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times text-danger"></i>
                      </button>
                    </div>
                  ))}

                  {renderedImages.length < MAX_IMAGES && (
                    <div
                      className="d-flex flex-column justify-content-center align-items-center border rounded text-center text-muted"
                      style={{ width: 80, height: 80, cursor: 'pointer' }}
                      onClick={triggerFileInput}
                    >
                      <i className="fas fa-camera mb-1"></i>
                      <small>Thêm ảnh</small>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="d-none"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button
                type="button"
                className={`btn ${rating > 0 ? 'btn-primary' : 'btn-secondary disabled'}`}
                disabled={rating === 0}
                onClick={handleSubmit}
              >
                Sửa đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderStatusHistory = () => (
    <div className="d-flex flex-column gap-3">
      {orderDetail.statusHistory.map((item, index) => (
        <div className="d-flex align-items-center gap-3" key={index}>
          <div
            className="rounded-circle"
            style={{
              width: 12,
              height: 12,
              backgroundColor: '#764ba2',
            }}
          ></div>
          <div className="d-flex justify-content-between w-100 border-bottom pb-2">
            {/* Hiển thị label thay vì raw status */}
            <span className="fw-medium text-muted small">{getOrderStatusLabel(item.status)}</span>
            <span className="text-muted small">{formatDateTime(item.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );


  return (
    <div className="min-vh-100">
      {/* Header */}
      <header
        className="shadow-lg mb-3"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}
      >
        <div className="container-lg py-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-primary rounded-pill me-4 shadow-sm"
                onClick={() => navigate(-1)}
                aria-label="Quay lại"
              >
                <i className="fa-solid fa-person-walking-arrow-loop-left"></i>
              </button>
              <div>
                <h1
                  className="h4 m-0 fw-bold text-dark mb-1 bg-info"
                  style={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Chi tiết đơn hàng
                </h1>
                <p className="text-muted mb-0 fw-bold"># {orderDetail.orderNumber}</p>
              </div>
            </div>
            <div className='d-flex'>
              {renderCancelButton()}
              {getStatusBadge(orderDetail.status)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-5">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Order Status */}
            <div
              className="bg-white rounded-4 shadow-lg p-5 mb-4 position-relative overflow-hidden"
              style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100 opacity-25"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  zIndex: -1
                }}
              ></div>
              <h2 className="h5 fw-bold mb-4 text-dark">
                <i className="bi bi-truck text-primary me-2"></i>
                Trạng thái đơn hàng
              </h2>

              <div className="row g-3 mb-4">
                {renderStatusSteps()}
              </div>

              {/* Progress Bar */}
              <div className="progress rounded-pill shadow-sm" style={{ height: '8px' }}>
                <div
                  className="progress-bar rounded-pill"
                  style={{
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    transition: 'width 0.5s ease'
                  }}
                ></div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-4 shadow-lg p-4 mb-4">
              <h2 className="h6 fw-bold mb-4 text-dark">
                <i className="bi bi-bag-check text-success me-2"></i>
                Sản phẩm đã mua
              </h2>
              <div className="d-flex flex-column gap-3">
                {orderDetail.items.map(renderProductItem)}
                {showReviewModal && selectedProduct && (
                  <ReviewModal
                    product={selectedProduct.product}
                    orderItem={selectedProduct}
                    onClose={handleCloseReviewModal}
                  />
                )}
                {showViewReviewModal && selectedProduct && (
                  <ViewReviewModal
                    review={review}
                    onClose={handleCloseReviewModal}
                  />
                )}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-4 shadow p-4">
              <h2 className="h5 fw-bold mb-4 text-dark">
                <i className="bi bi-clock-history text-info me-2"></i>
                Lịch sử đơn hàng
              </h2>
              {renderStatusHistory()}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-lg-4">
            {/* Payment Info Card */}
            <div className="bg-white rounded-4 shadow-lg p-4 mb-4 position-relative overflow-hidden">
              <div
                className="position-absolute top-0 end-0"
                style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                  borderRadius: '50%',
                  transform: 'translate(50%, -50%)',
                  opacity: 0.1
                }}
              ></div>
              <h2 className="h6 fw-bold mb-4 text-dark">
                <i className="bi bi-credit-card-2-front text-success me-2"></i>
                Thông tin thanh toán
              </h2>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light">
                  <span className="text-muted fw-medium">Phương thức:</span>
                  <span className="fw-bold text-dark">
                    {orderDetail.payment.paymentMethod.charAt(0).toUpperCase() + orderDetail.payment.paymentMethod.slice(1)}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light">
                  <span className="text-muted fw-medium">Trạng thái:</span>
                  {getStatusBadge(orderDetail.status)}
                </div>
              </div>
            </div>

            {/* Delivery Info Card */}
            <div className="bg-white rounded-4 shadow-lg p-4 mb-4 position-relative overflow-hidden">
              <div
                className="position-absolute top-0 end-0"
                style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  transform: 'translate(50%, -50%)',
                  opacity: 0.1
                }}
              ></div>
              <h2 className="h6 fw-bold mb-4 text-dark">
                <i className="bi bi-geo-alt text-primary me-2"></i>
                Thông tin giao hàng
              </h2>
              <div className="d-flex flex-column gap-3">
                <div className="p-3 rounded-3 bg-light">
                  <label className="text-muted small fw-medium mb-1 d-block">Người nhận</label>
                  <span className="fw-bold text-dark">{orderDetail.shippingAddress.fullName}</span>
                </div>
                <div className="p-3 rounded-3 bg-light">
                  <label className="text-muted small fw-medium mb-1 d-block">Địa chỉ</label>
                  <span className="fw-bold text-dark">{orderDetail.shippingAddress.address}</span>
                </div>
                <div className="p-3 rounded-3 bg-light">
                  <label className="text-muted small fw-medium mb-1 d-block">Thành phố</label>
                  <span className="fw-bold text-dark">{orderDetail.shippingAddress.city}</span>
                </div>
                <div className="p-3 rounded-3 bg-light">
                  <label className="text-muted small fw-medium mb-1 d-block">Điện thoại</label>
                  <span className="fw-bold text-dark">{orderDetail.shippingAddress.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div
              className="rounded-4 shadow-lg p-4 text-white position-relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                style={{
                  background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.2"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")'
                }}
              ></div>
              <h2 className="h6 fw-bold mb-4 position-relative">
                <i className="bi bi-receipt me-2"></i>
                Tổng kết đơn hàng
              </h2>
              <div className="d-flex flex-column gap-3 position-relative">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="opacity-75">Tạm tính:</span>
                  <span className="fw-bold">{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="opacity-75">Phí vận chuyển:</span>
                  <span className="fw-bold text-warning">{orderDetail.shippingFee.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="opacity-75">Giảm giá:</span>
                  <span className="fw-bold text-warning">-{orderDetail.discountValue.toLocaleString()}đ</span>
                </div>
                <hr className="border-white opacity-25" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold">Tổng cộng:</span>
                  <span className="fs-4 fw-bold">{orderDetail.totalPrice.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;