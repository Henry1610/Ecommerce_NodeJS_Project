import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaFlagUsa, FaSearch, FaSignOutAlt, FaCog, FaUser, FaBars, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Header.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchAdminProfile } from '../../../../redux/admin/adminSlice';
import { logout } from '../../../../redux/auth/authSlice';
import Swal from 'sweetalert2';

const getAdminInfo = () => {
  // Simulate getting admin info from localStorage
  try {
    const admin = JSON.parse(localStorage.getItem('admin'));
    return admin || { name: 'Admin', avatar: '' };
  } catch {
    return { name: 'Admin', avatar: '' };
  }
};

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.admin.adminAdmin);

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  const toggleDropdown = (type) => {
    setActiveDropdown(prev => (prev === type ? null : type));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // You can implement real search logic here
      console.log('Searching:', search);
    }
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
        padding: '0 32px',
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
        <Link to="/admin/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: 22,
          color: '#3b82f6',
          textDecoration: 'none',
          letterSpacing: 1
        }}>
          <FaBars style={{ marginRight: 10, fontSize: 22 }} />
          Dashboard
        </Link>
      </div>

      {/* Search */}
      {/* <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f3f6fa',
          borderRadius: 8,
          padding: '4px 12px',
          minWidth: 260,
          boxShadow: '0 1px 4px rgba(59,130,246,0.04)'
        }}
      >
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm..."
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 15,
            flex: 1,
            color: '#222'
          }}
        />
        <button
          type="submit"
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            fontSize: 18,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <FaSearch />
        </button>
      </form> */}

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* Language dropdown
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleDropdown('lang')}
            className={`admin-header-btn${activeDropdown === 'lang' ? ' active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8 }}
            aria-label="Language"
          >
            <FaFlagUsa size={20} />
            {activeDropdown === 'lang' ? <FaChevronUp size={12} style={{ marginLeft: 4 }} /> : <FaChevronDown size={12} style={{ marginLeft: 4 }} />}
          </button>
          {activeDropdown === 'lang' && (
            <ul className="admin-header-dropdown" style={{ minWidth: 140 }}>
              <li><span><FaFlagUsa className="me-2" />English</span></li>
              <li><span role="img" aria-label="fr">🇫🇷</span> French</li>
              <li><span role="img" aria-label="es">🇪🇸</span> Spanish</li>
              <li><span role="img" aria-label="de">🇩🇪</span> German</li>
            </ul>
          )}
        </div> */}

        {/* Notifications dropdown */}
        {/* <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleDropdown('notif')}
            className={`admin-header-btn${activeDropdown === 'notif' ? ' active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, position: 'relative' }}
            aria-label="Notifications"
          >
            <FaBell size={20} />
            <span style={{
              position: 'absolute',
              top: 2,
              right: 2,
              background: '#f43f5e',
              color: '#fff',
              borderRadius: '50%',
              fontSize: 11,
              minWidth: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>4</span>
            {activeDropdown === 'notif' ? <FaChevronUp size={12} style={{ marginLeft: 4 }} /> : <FaChevronDown size={12} style={{ marginLeft: 4 }} />}
          </button>
          {activeDropdown === 'notif' && (
            <ul className="admin-header-dropdown" style={{ minWidth: 320, maxHeight: 400, overflowY: 'auto' }}>
              <li className="notif-item">
                <FaUserCircle className="me-2 text-primary" size={28} />
                <div><strong>John Doe</strong> added new task <br /><small className="text-muted">4 mins ago</small></div>
              </li>
              <li className="notif-item">
                <FaUserCircle className="me-2 text-secondary" size={28} />
                <div><strong>Tarah Shropshire</strong> changed the task name <br /><small className="text-muted">6 mins ago</small></div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li style={{ textAlign: 'center', padding: 8, color: '#3b82f6', cursor: 'pointer' }}>View all Notifications</li>
            </ul>
          )}
        </div> */}

        {/* User dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleDropdown('user')}
            className={`admin-header-btn${activeDropdown === 'user' ? ' active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center' }}
            aria-label="User menu"
          >
            {profile?.avatar ? (
              <img src={profile.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8 }} />
            ) : (
              <FaUserCircle size={28} style={{ marginRight: 8, color: '#3b82f6' }} />
            )}
            <span style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>{profile?.username || 'Admin'}</span>
            {activeDropdown === 'user' ? <FaChevronUp size={12} style={{ marginLeft: 6 }} /> : <FaChevronDown size={12} style={{ marginLeft: 6 }} />}
          </button>
          {activeDropdown === 'user' && (
            <ul className="admin-header-dropdown" style={{ minWidth: 180 }}>
              <li className="px-3 py-2 d-flex align-items-center">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 10 }} />
                ) : (
                  <FaUserCircle size={32} style={{ marginRight: 10, color: '#3b82f6' }} />
                )}
                <div><h6 className="mb-0">{profile?.username || 'Admin'}</h6><small className="text-muted">Admin</small></div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <Link className="dropdown-item" to="/admin/profile">
                  <FaUser className="me-2" /> My Profile
                </Link>
              </li>
              
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item" onClick={handleLogout} style={{ color: '#fff', background: '#f43f5e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, padding: '10px 18px', border: 'none', margin: 8, boxShadow: '0 2px 8px rgba(244,63,94,0.08)', transition: 'background 0.15s' }} onMouseOver={e => e.target.style.background = '#dc2626'} onMouseOut={e => e.target.style.background = '#f43f5e'}><FaSignOutAlt /> Đăng xuất</button></li>
            </ul>
          )}
        </div>
      </div>

      {/* Custom styles for dropdown */}
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
        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 18px;
        }
        @media (max-width: 700px) {
          nav.admin-header-nav {
            flex-direction: column;
            padding: 0 8px;
            min-height: unset;
          }
          .admin-header-dropdown {
            right: unset;
            left: 0;
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
