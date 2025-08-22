import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserProfile from './Profile';
import OrderHistoryTab from './OrderHistoryTab';
import ReviewTab from './ReviewTab';
import AddressTab from './AddressTab';
import VoucherCard from '../../../components/VourcherCard';
import { fetchDiscounts } from '../../../redux/public/discountSlice';
import { logout, clearAuth } from '../../../redux/auth/authSlice';
import { clearUserProfile } from '../../../redux/user/userSlice';
import { clearCompare } from '../../../redux/public/compareSlice';
import { Link } from 'react-router-dom';
const tabs = [
  { key: 'account', label: 'Thông tin tài khoản', icon: 'fa-user' },
  { key: 'orders', label: 'Lịch sử đơn hàng', icon: 'fa-file-alt' },
  { key: 'address', label: 'Sổ địa chỉ', icon: 'fa-map-marker-alt' },
  { key: 'reviews', label: 'Đánh giá & nhận xét', icon: 'fa-star' },
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
    // Clear state ngay lập tức
    dispatch(clearAuth());
    dispatch(clearUserProfile());
    dispatch(clearCompare());
    // Gọi API logout (không cần đợi)
    dispatch(logout());
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <UserProfile />;
      case 'orders':
        return <OrderHistoryTab />;
      
      case 'address':
        return <AddressTab />;
      case 'reviews':
        return <ReviewTab />;
      
      
      default:
        return null;
    }
  };

  return (
    <div className="container " style={{ minHeight: '80vh' }}>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none">Trang chủ</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">Tài khoản</li>
      </ol>
      <div className="row justify-content-center">
        <div className="col-lg-3 mb-4 mb-lg-0">
          <div className="bg-white rounded-4 shadow-sm p-0 overflow-hidden" style={{ minWidth: 240 }}>
            <ul className="list-unstyled mb-0 d-flex d-md-block flex-row flex-md-column">
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
                    <span className="d-none d-md-inline">{tab.label}</span>
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