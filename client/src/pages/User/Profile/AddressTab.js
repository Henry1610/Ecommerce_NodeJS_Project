import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedShippingAddresses } from '../../../redux/user/shippingAddressSlice';

const AddressTab = () => {
  const dispatch = useDispatch();
  const { AddressSave, loading, error } = useSelector(state => state.user.userShippingAddress);

  useEffect(() => {
    dispatch(getSavedShippingAddresses());
  }, [dispatch]);

  if (loading) return <div className="text-center py-5">Đang tải địa chỉ...</div>;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;

  if (!AddressSave || AddressSave.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-map-marker-alt mb-3" style={{ fontSize: 48, color: '#e0e7ef' }}></i>
        <h5 className="text-muted">Bạn chưa có địa chỉ giao hàng nào</h5>
        <p className="text-secondary">Hãy thêm địa chỉ để thuận tiện cho việc giao hàng!</p>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <h4 className="fw-bold mb-4">Sổ địa chỉ giao hàng</h4>
      <div className="row g-3">
        {AddressSave.map((address) => (
          <div className="col-12 col-md-6 col-lg-4" key={address._id}>
            <div className="card shadow-sm rounded-4 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="fas fa-home text-info" style={{ fontSize: 22 }}></i>
                  <div className="fw-bold text-dark">{address.name || 'Địa chỉ'}</div>
                  {address.isDefault && (
                    <span className="badge bg-primary ms-2">Mặc định</span>
                  )}
                </div>
                <div className="mb-1 text-secondary" style={{ fontSize: 15 }}>
                  {address.address}
                </div>
                <div className="mb-1 text-secondary" style={{ fontSize: 15 }}>
                  {address.city?.city || address.city}
                </div>
                <div className="mb-1 text-secondary" style={{ fontSize: 15 }}>
                  SĐT: {address.phoneNumber}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressTab; 