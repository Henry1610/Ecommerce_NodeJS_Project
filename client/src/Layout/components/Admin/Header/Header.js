import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (type) => {
    setActiveDropdown(prev => (prev === type ? null : type));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        <h2 className="accordion-header" id="headingProduct">
          <Link
            to="/admin/dashboard"
            className="accordion-button collapsed bg-light text-decoration-none"
          >
            <i className="fa-brands fa-unity me-2"></i> Dashboard
          </Link>
        </h2>

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
              <i className="fas fa-search"></i>
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
                <i className="fas fa-flag-usa"></i>
              </button>
              <ul className={`dropdown-menu dropdown-menu-start${activeDropdown === "lang" ? " show" : ""}`}>
                <li><a className="dropdown-item" href="#"><i className="fas fa-flag-usa me-2"></i>English</a></li>
                <li><a className="dropdown-item" href="#"><i className="fas fa-flag me-2"></i>French</a></li>
                <li><a className="dropdown-item" href="#"><i className="fas fa-flag me-2"></i>Spanish</a></li>
                <li><a className="dropdown-item" href="#"><i className="fas fa-flag me-2"></i>German</a></li>
              </ul>
            </li>

            {/* Notifications dropdown */}
            <li className={`nav-item dropdown ms-3 ${activeDropdown === "notif" ? "show" : ""}`}>
              <button
                onClick={() => toggleDropdown("notif")}
                className="nav-link position-relative btn btn-link"
                aria-expanded={activeDropdown === "notif"}
              >
                <i className="fas fa-bell"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">4</span>
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-start p-3${activeDropdown === "notif" ? " show" : ""}`}
                style={{ width: 350, maxHeight: 400, overflowY: 'auto' }}
              >
                <li className="mb-2 d-flex align-items-center">
                  <i className="fas fa-user-circle fa-2x me-2 text-primary"></i>
                  <div><strong>John Doe</strong> added new task <br /><small className="text-muted">4 mins ago</small></div>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <i className="fas fa-user-circle fa-2x me-2 text-secondary"></i>
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
                <i className="fas fa-user-circle fa-lg"></i>
                <span
                  className="status online ms-2"
                  style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: '#28a745', display: 'inline-block' }}
                ></span>
              </button>
              <ul className={`dropdown-menu dropdown-menu-start${activeDropdown === "user" ? " show" : ""}`}>
                <li className="px-3 py-2 d-flex align-items-center">
                  <i className="fas fa-user-circle fa-2x me-2 text-dark"></i>
                  <div><h6 className="mb-0">John Doe</h6><small className="text-muted">Admin</small></div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="profile.html"><i className="fas fa-user me-2"></i> My Profile</a></li>
                <li><a className="dropdown-item" href="generalsettings.html"><i className="fas fa-cog me-2"></i> Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="signin.html"><i className="fas fa-sign-out-alt me-2"></i> Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
