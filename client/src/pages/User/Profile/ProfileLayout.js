import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserProfile from './Profile';
import OrderHistoryTab from './OrderHistoryTab';
import ReviewTab from './ReviewTab';
import AddressTab from './AddressTab';
import VoucherCard from '../../../components/VourcherCard';
import { fetchDiscounts } from '../../../redux/public/discountSlice';
import { logout } from '../../../redux/auth/authSlice';

const tabs = [
  { key: 'account', label: 'Thông tin tài khoản', icon: 'fa-user' },
  { key: 'orders', label: 'Lịch sử đơn hàng', icon: 'fa-file-alt' },
  { key: 'voucher', label: 'Ví voucher', icon: 'fa-ticket-alt' },
  { key: 'address', label: 'Sổ địa chỉ', icon: 'fa-map-marker-alt' },
  { key: 'reviews', label: 'Đánh giá & nhận xét', icon: 'fa-star' },
  { key: 'faq', label: 'Câu hỏi thường gặp', icon: 'fa-question-circle' },
  { key: 'logout', label: 'Đăng xuất', icon: 'fa-sign-out-alt' },
];

const ProfileLayout = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [copiedCode, setCopiedCode] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { discounts, loading, error } = useSelector(state => state.public.publicDiscount);

  useEffect(() => {
    if (activeTab === 'voucher' && discounts.length === 0 && !loading) {
      dispatch(fetchDiscounts());
    }
  }, [activeTab, discounts.length, loading, dispatch]);

  // Copy code handler
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <UserProfile />;
      case 'orders':
        return <OrderHistoryTab />;
      case 'voucher':
        return (
          <div className="p-4">
            <h4 className="fw-bold mb-4">Ví voucher của bạn</h4>
            {loading ? (
              <div>Đang tải voucher...</div>
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : discounts.length === 0 ? (
              <div className="text-muted">Bạn chưa có voucher nào khả dụng.</div>
            ) : (
              <div className="row g-3">
                {discounts.map(discount => {
                  const now = new Date();
                  const validTo = new Date(discount.validTo);
                  const daysLeft = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));
                  const isExpiringSoon = daysLeft > 0 && daysLeft <= 3;
                  const isOut = discount.quantity <= 0;
                  return (
                    <div className="col-12 col-md-6 col-lg-4" key={discount._id}>
                      <div
                        className={`voucher-card-custom position-relative shadow-sm rounded-4 p-3 h-100 d-flex flex-column ${isOut ? 'opacity-50' : ''}`}
                        style={{
                          border: '2px solid #2196f3',
                          background: 'linear-gradient(90deg, #e3f2fd 60%, #ffffff 100%)',
                          minHeight: 160,
                        }}
                      >
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: 60,
                              height: 60,
                              background: '#2196f3',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: 22,
                              boxShadow: '0 2px 8px #2196f344',
                            }}
                          >
                            <span>{discount.discountPercent}%</span>
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-bold text-primary d-flex align-items-center gap-2" style={{ fontSize: 18 }}>
                              {discount.code}
                              <button
                                className="btn btn-sm btn-light border border-primary ms-1 px-2 py-1"
                                style={{ borderRadius: 8 }}
                                title="Sao chép mã"
                                onClick={() => handleCopy(discount.code)}
                                disabled={isOut}
                              >
                                {copiedCode === discount.code ? (
                                  <i className="fas fa-check text-success"></i>
                                ) : (
                                  <i className="fas fa-copy text-primary"></i>
                                )}
                              </button>
                            </div>
                            <div className="text-secondary" style={{ fontSize: 15 }}>{discount.description}</div>
                          </div>
                        </div>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          <span className="badge bg-light text-dark border border-primary" style={{ fontSize: 13 }}>
                            HSD: {validTo.toLocaleDateString()}
                          </span>
                          <span className="badge bg-light text-dark border border-primary" style={{ fontSize: 13 }}>
                            Tối đa: {discount.maxDiscount?.toLocaleString() || 0}đ
                          </span>
                          <span className="badge bg-light text-dark border border-primary" style={{ fontSize: 13 }}>
                            Còn lại: {discount.quantity}
                          </span>
                          {isExpiringSoon && !isOut && (
                            <span className="badge bg-warning text-dark" style={{ fontSize: 13 }}>Sắp hết hạn</span>
                          )}
                          {isOut && (
                            <span className="badge bg-danger text-white" style={{ fontSize: 13 }}>Hết lượt</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      case 'address':
        return <AddressTab />;
      case 'reviews':
        return <ReviewTab />;
      case 'faq':
        return <div className="p-4">Câu hỏi thường gặp (sẽ hiển thị ở đây)</div>;
      case 'logout':
        return <div className="p-4">Đăng xuất...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-lg-3 mb-4 mb-lg-0">
          <div className="bg-white rounded-4 shadow-sm p-0 overflow-hidden" style={{ minWidth: 240 }}>
            <ul className="list-unstyled mb-0">
              {tabs.map(tab => (
                <li key={tab.key}>
                  <button
                    className={`w-100 text-start px-4 py-3 border-0 bg-transparent fw-semibold d-flex align-items-center gap-3${activeTab === tab.key ? ' active' : ''}`}
                    style={{
                      background: activeTab === tab.key ? '#00c3ff22' : 'transparent',
                      color: activeTab === tab.key ? '#00b6ff' : '#222',
                      borderLeft: activeTab === tab.key ? '5px solid #00b6ff' : '5px solid transparent',
                      fontSize: 17,
                      transition: 'all 0.18s',
                      borderRadius: activeTab === tab.key ? '0 24px 24px 0' : 0,
                    }}
                    onClick={() => {
                      if (tab.key === 'logout') {
                        handleLogout();
                      } else {
                        setActiveTab(tab.key);
                      }
                    }}
                  >
                    <i className={`fas ${tab.icon}`} style={{ fontSize: 20, minWidth: 24 }}></i>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="bg-white rounded-4 shadow-sm p-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
      {/* FontAwesome CDN for icons if not already included */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default ProfileLayout; 