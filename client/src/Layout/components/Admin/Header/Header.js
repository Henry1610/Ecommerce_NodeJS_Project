import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaUser, FaBars, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Header.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchAdminProfile, resetAdminProfile } from '../../../../redux/admin/adminSlice';
import { logout, clearAuth } from '../../../../redux/auth/authSlice';
import Swal from 'sweetalert2';



const Header = ({ onToggleSidebar }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.admin.adminAdmin);

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  const toggleDropdown = (type) => {
    setActiveDropdown(prev => (prev === type ? null : type));
  };

  

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Huỷ'
    });
    if (result.isConfirmed) {
      // Clear state ngay lập tức
      dispatch(clearAuth());
      dispatch(resetAdminProfile());
      // Gọi API logout (không cần đợi)
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <nav
      className="admin-header-nav"
      style={{
        background: '#fff',
        boxShadow: '0 2px 12px rgba(59,130,246,0.08)',
        padding: '0 16px',
        minHeight: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* Logo & Dashboard */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Hamburger button for mobile */}
        <button
          onClick={onToggleSidebar}
          className="d-lg-none btn btn-link p-2"
          style={{ 
            border: 'none', 
            background: 'none',
            color: '#3b82f6',
            fontSize: '20px'
          }}
        >
          <FaBars />
        </button>
        
        <Link to="/admin/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: 'clamp(16px, 4vw, 22px)',
          color: '#3b82f6',
          textDecoration: 'none',
          letterSpacing: 1
        }}>
          <FaBars className="d-none d-lg-inline" style={{ marginRight: 10, fontSize: 22 }} />
          <span className="d-none d-sm-inline">Dashboard</span>
        </Link>
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* User dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleDropdown('user')}
            className={`admin-header-btn${activeDropdown === 'user' ? ' active' : ''}`}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 8, 
              borderRadius: 8, 
              display: 'flex', 
              alignItems: 'center' 
            }}
            aria-label="User menu"
          >
            {profile?.avatar ? (
              <img 
                src={profile.avatar} 
                alt="avatar" 
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  marginRight: 8 
                }} 
              />
            ) : (
              <FaUserCircle size={28} style={{ marginRight: 8, color: '#3b82f6' }} />
            )}
            <span 
              className="d-none d-md-inline"
              style={{ 
                fontWeight: 600, 
                color: '#222', 
                fontSize: 15 
              }}
            >
              {profile?.username || 'Admin'}
            </span>
            {activeDropdown === 'user' ? 
              <FaChevronUp size={12} style={{ marginLeft: 6 }} /> : 
              <FaChevronDown size={12} style={{ marginLeft: 6 }} />
            }
          </button>
          
          {activeDropdown === 'user' && (
            <ul className="admin-header-dropdown" style={{ minWidth: 180 }}>
              <li className="px-3 py-2 d-flex align-items-center">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="avatar" 
                    style={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      objectFit: 'cover', 
                      marginRight: 10 
                    }} 
                  />
                ) : (
                  <FaUserCircle size={32} style={{ marginRight: 10, color: '#3b82f6' }} />
                )}
                <div>
                  <h6 className="mb-0">{profile?.username || 'Admin'}</h6>
                  <small className="text-muted">Admin</small>
                </div>
              </li>
              <li>
                <Link className="dropdown-item" to="/admin/profile">
                  <FaUser className="me-2" /> My Profile
                </Link>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={handleLogout} 
                  style={{ 
                    color: '#fff', 
                    background: '#f43f5e', 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    borderRadius: 8, 
                    padding: '10px 18px', 
                    border: 'none', 
                    margin: 8, 
                    boxShadow: '0 2px 8px rgba(244,63,94,0.08)', 
                    transition: 'background 0.15s' 
                  }} 
                  onMouseOver={e => e.target.style.background = '#dc2626'} 
                  onMouseOut={e => e.target.style.background = '#f43f5e'}
                >
                  <FaSignOutAlt /> Đăng xuất
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        .admin-header-btn:hover, .admin-header-btn.active {
          background: #f3f6fa;
        }
        .admin-header-dropdown {
          position: absolute;
          top: 110%;
          right: 0;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(59,130,246,0.10);
          padding: 8px 0;
          z-index: 1000;
          min-width: 140px;
          animation: fadeIn 0.18s;
        }
        .admin-header-dropdown li {
          padding: 8px 18px;
          cursor: pointer;
          font-size: 15px;
          transition: background 0.15s;
        }
        .admin-header-dropdown li:hover {
          background: #f3f6fa;
        }
        @media (max-width: 768px) {
          .admin-header-nav {
            padding: 0 12px;
          }
          .admin-header-dropdown {
            right: 0;
            left: auto;
            min-width: 200px;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </nav>
  );
};

export default Header;
