import React, { useState } from 'react';
import './Header.css';
import images from '../../../../assets/img/images';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (type) => {
    setActiveDropdown(prev => (prev === type ? null : type));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm ">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="index.html">
          <img src={images.logo} alt="Logo" className="d-none d-lg-block" style={{ height: 40 }} />
          <img src={images.logoSmall} alt="Logo small" className="d-lg-none" style={{ height: 40 }} />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex ms-auto me-3">
            <input className="form-control me-2" type="search" placeholder="Search Here ..." />
            <button className="btn btn-outline-success" type="submit">
              <img src={images.searchIcon} alt="Search" style={{ height: 20 }} />
            </button>
          </form>

          <ul className="navbar-nav align-items-center">
            {/* Language dropdown */}
            <li className={`nav-item dropdown ms-3 ${activeDropdown === "lang" ? "show" : ""}`}>
              <button
                onClick={() => toggleDropdown("lang")}
                className="nav-link dropdown-toggle btn btn-link"
                aria-expanded={activeDropdown === "lang"}
              >
                <img src={images.flags.us1} alt="English" height="20" />
              </button>
              <ul className={`dropdown-menu dropdown-menu-start${activeDropdown === "lang" ? " show" : ""}`}>
                <li><a className="dropdown-item" href="#"><img src={images.flags.us} height="16" alt="English" /> English</a></li>
                <li><a className="dropdown-item" href="#"><img src={images.flags.fr} height="16" alt="French" /> French</a></li>
                <li><a className="dropdown-item" href="#"><img src={images.flags.es} height="16" alt="Spanish" /> Spanish</a></li>
                <li><a className="dropdown-item" href="#"><img src={images.flags.de} height="16" alt="German" /> German</a></li>
              </ul>
            </li>

            {/* Notifications dropdown */}
            <li className={`nav-item dropdown ms-3 ${activeDropdown === "notif" ? "show" : ""}`}>
              <button
                onClick={() => toggleDropdown("notif")}
                className="nav-link position-relative btn btn-link"
                aria-expanded={activeDropdown === "notif"}
              >
                <img src={images.notifIcon} alt="Notifications" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">4</span>
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-start p-3${activeDropdown === "notif" ? " show" : ""}`}
                style={{ width: 350, maxHeight: 400, overflowY: 'auto' }}
              >
                <li className="mb-2 d-flex align-items-center">
                  <img src={images.avatars.avatar2} className="rounded-circle me-2" style={{ width: 40, height: 40 }} alt="John Doe" />
                  <div><strong>John Doe</strong> added new task <br /><small className="text-muted">4 mins ago</small></div>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <img src={images.avatars.avatar3} className="rounded-circle me-2" style={{ width: 40, height: 40 }} alt="Tarah Shropshire" />
                  <div><strong>Tarah Shropshire</strong> changed the task name <br /><small className="text-muted">6 mins ago</small></div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li><a href="activities.html" className="dropdown-item text-center">View all Notifications</a></li>
              </ul>
            </li>

            {/* User dropdown */}
            <li className={`nav-item dropdown ms-3 ${activeDropdown === "user" ? "show" : ""}`}>
              <button
                onClick={() => toggleDropdown("user")}
                className="nav-link dropdown-toggle d-flex align-items-center btn btn-link"
                aria-expanded={activeDropdown === "user"}
              >
                <img src={images.avatars.avatar1} className="rounded-circle" style={{ width: 35, height: 35 }} alt="User avatar" />
                <span
                  className="status online ms-2"
                  style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: '#28a745', display: 'inline-block' }}
                ></span>
              </button>
              <ul className={`dropdown-menu dropdown-menu-start${activeDropdown === "user" ? " show" : ""}`}>
                <li className="px-3 py-2 d-flex align-items-center">
                  <img src={images.avatars.avatar1} className="rounded-circle me-2" style={{ width: 40, height: 40 }} alt="User avatar" />
                  <div><h6 className="mb-0">John Doe</h6><small className="text-muted">Admin</small></div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="profile.html"><i data-feather="user" className="me-2"></i> My Profile</a></li>
                <li><a className="dropdown-item" href="generalsettings.html"><i data-feather="settings" className="me-2"></i> Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="signin.html"><img src={images.logoutIcon} className="me-2" alt="Logout icon" /> Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
