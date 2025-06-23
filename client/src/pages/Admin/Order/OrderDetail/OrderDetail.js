import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import formatDateTime from '../../../../untils/dateUtils'
import { fetchOrderByOrderNumber, updateOrderStatus } from '../../../../redux/admin/orderSlice';
import { approveRefund, rejectRefund } from '../../../../redux/admin/paymentSlice';
import Swal from 'sweetalert2';

const OrderDetail = () => {
  const { orderNumber } = useParams()

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchOrderByOrderNumber(orderNumber)).unwrap();
  }, [dispatch, orderNumber]);
  const { selectedOrder } = useSelector(state => state.admin.adminOrder)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  const statuses = ["pending", "processing", "shipped", "delivered"];
  useEffect(() => {
    if (selectedOrder) {
      const index = statuses.findIndex(s => s === selectedOrder.status);
      setCurrentIndex(index !== -1 ? index : 0);
      setIsCancelled(selectedOrder.status === "cancelled");
    }
  }, [selectedOrder]);

  const statusLabels = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled"
  };

  const iconClasses = {
    pending: "fas fa-clock",
    processing: "fas fa-cog",
    shipped: "fas fa-truck",
    delivered: "fas fa-check-circle",
    cancelled: "fas fa-times"
  };
  const handleNext = () => {
    const currentStatus = selectedOrder.status;
    const nextIndex = statuses.findIndex(s => s === currentStatus) + 1;

    if (nextIndex < statuses.length) {
      const nextStatus = statuses[nextIndex];
      Swal.fire({
        title: `Chuyển trạng thái đơn hàng thành "${nextStatus}"?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(updateOrderStatus({ orderNumber: selectedOrder.orderNumber, statusData: nextStatus }));
          Swal.fire('Thành công!', `Trạng thái đã chuyển thành "${nextStatus}".`, 'success');
        }
      });
    }
  };
  const handleCancel = () => {
    Swal.fire({
      title: 'Xác nhận hủy đơn hàng?',
      text: "Bạn sẽ không thể hoàn tác thao tác này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateOrderStatus({ orderNumber: selectedOrder.orderNumber, statusData: 'cancelled' }));
        Swal.fire('Đã hủy!', 'Đơn hàng đã được hủy.', 'success');
      }
    });
  };

  const handleRejectCancel = () => {
    Swal.fire({
      title: 'Từ chối yêu cầu hủy đơn?',
      text: "Khách hàng sẽ không được hủy đơn hàng này.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Từ chối',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateOrderStatus({ orderNumber: selectedOrder.orderNumber, statusData: 'cancel_rejected' }));
        Swal.fire('Đã từ chối!', 'Yêu cầu hủy đơn đã bị từ chối.', 'success');
      }
    });
  };

 
  const handleApproveRefund = () => {
    Swal.fire({
      title: 'Xác nhận hoàn tiền đơn hàng?',
      text: "Sau khi hoàn tiền, bạn sẽ không thể hoàn tác thao tác này.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hoàn tiền',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(approveRefund(selectedOrder._id))
          .unwrap()
          .then(() => {
            Swal.fire('Thành công!', 'Đã hoàn tiền đơn hàng.', 'success');
            dispatch(fetchOrderByOrderNumber(orderNumber)); // Reload lại order
          })
          .catch((error) => {
            Swal.fire('Lỗi', error.message || 'Đã có lỗi xảy ra khi hoàn tiền.', 'error');
          });
      }
    });
  };

  const handleRejectRefund = () => {
    Swal.fire({
      title: 'Từ chối yêu cầu hoàn tiền?',
      text: "Khách hàng sẽ không được hoàn tiền cho đơn hàng này.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Từ chối',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(rejectRefund(selectedOrder._id))
          .unwrap()
          .then(() => {
            Swal.fire('Thành công!', 'Đã từ chối hoàn tiền.', 'success');
            dispatch(fetchOrderByOrderNumber(orderNumber));
          })
          .catch((error) => {
            Swal.fire('Lỗi', error.message || 'Đã có lỗi xảy ra khi từ chối hoàn tiền.', 'error');
          });
      }
    });
  };

  return (
    <div className="bg-light mt-3 container">
      {/* Order Progress */}
      <div className="bg-white rounded-4 shadow-sm p-4 my-3" style={{ width: "100%" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h5 className="fw-semibold text-dark mb-0">Order Progress</h5>

          <div className="d-flex flex-wrap gap-2">

            {/* ✅ Yêu cầu hủy đơn hàng */}
            {selectedOrder?.status === "cancel_requested" && (
              <>
                <button
                  className="btn btn-danger btn-sm fw-medium"
                  onClick={handleCancel}
                >
                  ✅ Đồng ý hủy
                </button>
                <button
                  className="btn btn-secondary btn-sm fw-medium"
                  onClick={handleRejectCancel}
                >
                  ❌ Từ chối hủy
                </button>
              </>
            )}

            {/* ✅ Chỉ hiện nút hoàn tiền nếu đơn hàng đã hủy và refund đang được yêu cầu */}
            {selectedOrder?.status === "cancelled" &&
              selectedOrder?.payment?.refundStatus === "requested" && (
                <>
                  <button
                    className="btn btn-success btn-sm fw-medium"
                    onClick={handleApproveRefund}
                  >
                    💸 Đồng ý hoàn tiền
                  </button>
                  <button
                    className="btn btn-secondary btn-sm fw-medium"
                    onClick={handleRejectRefund}
                  >
                    🚫 Từ chối hoàn tiền
                  </button>
                </>
              )}

            {/* ✅ Các nút thao tác tiến trình đơn hàng */}
            {selectedOrder?.status !== "cancel_requested" &&
              !(selectedOrder?.status === "cancelled" &&
                selectedOrder?.payment?.refundStatus === "requested") && (
                <>
                  <button
                    className="btn btn-outline-danger btn-sm fw-medium"
                    onClick={handleCancel}
                    disabled={
                      selectedOrder?.status === "cancelled" ||
                      selectedOrder?.status === "delivered"
                    }
                  >
                    🛑 Hủy đơn
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm fw-medium"
                    onClick={handleNext}
                    disabled={
                      selectedOrder?.status === "cancelled" ||
                      selectedOrder?.status === "delivered" ||
                      currentIndex === statuses.length - 1
                    }
                  >
                    ⏭ {currentIndex === statuses.length - 1 ? "Hoàn tất" : "Chuyển bước"}
                  </button>
                </>
              )}
          </div>
        </div>



        <div className="position-relative" style={{ minHeight: "80px" }}>
          {/* Cancel Status Display */}
          {isCancelled && (
            <div className="position-absolute w-100 text-center" style={{ top: "-10px", zIndex: 3 }}>
              <div className="d-inline-flex align-items-center bg-danger text-white px-3 py-1 rounded-pill">
                <i className="fas fa-times me-2"></i>
                <small className="fw-medium">Order Cancelled</small>
              </div>
            </div>
          )}

          {/* Progress Line Background */}
          <div
            className={`position-absolute ${isCancelled ? 'bg-danger bg-opacity-25' : 'bg-secondary bg-opacity-25'}`}
            style={{
              top: "22px",
              left: "22px",
              right: "22px",
              height: "4px",
              borderRadius: "4px",
              zIndex: 0
            }}
          />

          {/* Active Progress Line */}
          {!isCancelled && (
            <div
              className="position-absolute bg-success"
              style={{
                top: "22px",
                left: "22px",
                width: currentIndex === 0 ? "0%" : `calc(${(currentIndex / (statuses.length - 1)) * 100}% - ${22 - (22 * currentIndex / (statuses.length - 1))}px)`,
                height: "4px",
                borderRadius: "4px",
                zIndex: 1,
                transition: "width 0.3s ease"
              }}
            />
          )}

          {/* Steps Container */}
          <div className="d-flex justify-content-between align-items-center">
            {statuses.map((status, index) => {
              const isCompleted = index < currentIndex && !isCancelled;
              const isCurrent = index === currentIndex && !isCancelled;
              const isCancelledStep = isCancelled;

              let iconColor, circleClasses;

              if (isCancelledStep) {
                iconColor = "text-muted";
                circleClasses = "bg-white border-secondary border-opacity-50";
              } else if (isCompleted) {
                iconColor = "text-white";
                circleClasses = "bg-success border-success";
              } else if (isCurrent) {
                iconColor = "text-primary";
                circleClasses = "bg-white border-primary";
              } else {
                iconColor = "text-muted";
                circleClasses = "bg-white border-secondary border-opacity-50";
              }

              return (
                <div
                  key={status}
                  className="d-flex flex-column align-items-center"
                  style={{ zIndex: 2, position: "relative" }}
                >
                  <div
                    className={`d-flex justify-content-center align-items-center border rounded-circle ${circleClasses}`}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderWidth: "2px",
                      boxShadow: isCurrent && !isCancelled ? "0 0 8px rgba(13, 110, 253, 0.3)" : "none",
                      transition: "all 0.3s ease",
                      opacity: isCancelled ? 0.6 : 1
                    }}
                  >
                    <i
                      className={
                        isCompleted && !isCancelled
                          ? "fas fa-check text-white fs-6"
                          : `${iconClasses[status]} ${iconColor} fs-6`
                      }
                      style={{ transition: "color 0.3s ease" }}
                    />
                  </div>
                  <small
                    className={`text-center mt-2 ${isCancelled
                      ? "text-muted"
                      : isCurrent
                        ? "text-primary fw-medium"
                        : "text-secondary"
                      }`}
                    style={{ fontSize: "12px", maxWidth: "80px", opacity: isCancelled ? 0.6 : 1 }}
                  >
                    {statusLabels[status]}
                  </small>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* Order Actions */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between flex-wrap mb-3">
            <h2 className="h5 fw-semibold"> #{selectedOrder?.orderNumber}</h2>
            <div className="btn-group gap-2">


            </div>
          </div>

          <div className="row">
            {/* User Info */}
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h6 className="border-bottom pb-2 fw-bold text-primary fs-6 mb-3">
                    👤 User Information
                  </h6>
                  <ul className="list-unstyled mb-0 small text-secondary">
                    <li className="mb-2">
                      <span className="fw-semibold">Name:</span>{' '}
                      <span className="text-muted">{selectedOrder?.shippingAddress.fullName}</span>
                    </li>

                    <li>
                      <span className="fw-semibold">User ID:</span>{' '}
                      <span className="text-muted">{selectedOrder?.shippingAddress.user}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="border-bottom pb-2 fw-bold text-primary fs-6 mb-3">📦 Shipping Address</h6>
                  <div className="small text-secondary">
                    <p className="mb-1">{selectedOrder?.shippingAddress.address}</p>
                    {/* <p className="mb-1">{selectedOrder?.shippingAddress.city.city}</p> */}

                    <p className="mt-3"><span className="fw-semibold">📞 Phone:</span> {selectedOrder?.shippingAddress.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="border-bottom pb-2 fw-bold text-primary fs-6 mb-3">💳 Payment Details</h6>
                  <div className="small text-secondary">
                    <p className="mb-2"><span className="fw-semibold">Method:</span>{`Credit Card (${selectedOrder?.payment.paymentMethod}) `}</p>
                    <p className="mb-2">
                      <span className="fw-semibold">Status:</span>{' '}
                      <span className="text-success fw-semibold">{selectedOrder?.payment.paymentStatus}</span>
                    </p>
                    <p className="mb-2"><span className="fw-semibold">Paid At:</span> {formatDateTime(selectedOrder?.payment.paidAt)}</p>
                    <p className="mb-0"><span className="fw-semibold">Transaction ID:</span> {selectedOrder?.payment.paymentIntentId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Order Items */}
      <div className="card shadow-sm mb-4 border-0 rounded-3">
  <div className="card-body">
    <div className="table-responsive">
      <table className="table align-middle table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Name</th>
            <th scope="col" className="text-center">Quantity</th>
            <th scope="col" className="text-end">Price</th>
            <th scope="col" className="text-end">Original</th>
            <th scope="col" className="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          {
            selectedOrder?.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded border"
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                </td>
                <td className="fw-semibold">{item.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-end text-success fw-semibold">{item.price.toLocaleString()}đ</td>
                <td className="text-end text-muted text-decoration-line-through">{item.originalPrice.toLocaleString()}đ</td>
                <td className="text-end fw-bold text-dark">{(item.price * item.quantity).toLocaleString()}đ</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  </div>
</div>


      <div className='d-flex  gap-4 mb-3 '>

        {/* Order Summary */}
        <div className="card shadow-sm flex-fill rounded-4 border-0" style={{ maxWidth: '400px', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
          <div className="card-body px-4 py-4">
            <h5 className="card-title mb-4 text-primary fw-bold fs-4">🧾 Order Summary</h5>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Subtotal</span>
              <span className="fw-medium">
                {selectedOrder?.items.reduce((total, item) => total + item.quantity * item.price, 0).toLocaleString()}<sup>đ</sup>
              </span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Discount</span>
              <span className="fw-medium text-success">
                -{selectedOrder?.discountValue?.toLocaleString()}<sup>đ</sup>
              </span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Shipping</span>
              <span className="fw-medium">
                {selectedOrder?.shippingFee?.toLocaleString()}<sup>đ</sup>
              </span>
            </div>

            <hr className="my-4" />

            <div className="d-flex justify-content-between align-items-center fw-bold fs-5 text-dark">
              <span>Total</span>
              <span>
                {selectedOrder?.totalPrice?.toLocaleString()}<sup>đ</sup>
              </span>
            </div>
          </div>
        </div>


        {/* Order Status */}
        <div className="card shadow-sm flex-fill " style={{ maxHeight: '500px' }}>
          <div className="card-body">
            <h5 className="card-title mb-4 text-primary">Order Status</h5>

            {selectedOrder?.statusHistory.map((item, idx) => (
              <div className="mb-3 d-flex align-items-start border-start ps-3" key={item._id || idx}>
                <i className={`fas fa-check-circle text-info fs-5 me-3`}></i>
                <div>
                  <div className="fw-semibold text-capitalize">{item.status.replace(/_/g, ' ')}</div>
                  <div className="text-muted small">{formatDateTime(item.updatedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



    </div>
  );
};

export default OrderDetail;
