import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionId) => {
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`  px-2 ${isOpen ? 'd-block' : 'd-none d-lg-block'}`}
        id="sidebar-wrapper" 
        style={{
          background: '#f8fafc',
          borderRadius: 18,
          boxShadow: '0 4px 24px rgba(59,130,246,0.08)',
          padding: '18px 0',
          minHeight: 'auto', // Thay đổi từ '92vh' thành 'auto'
          maxHeight: 'calc(100vh - 100px)', // Thêm maxHeight
          maxWidth: 270,
          marginLeft: 12,
          marginRight: 12,
          position: 'relative',
          zIndex: 1050,
          overflowY: 'auto' // Thêm scroll nếu cần
        }}
      >
        <div className="accordion" id="sidebarAccordion">
          
          {/* PRODUCT */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingProduct">
              <button
                className={`accordion-button bg-light ${openSection === 'product' ? '' : 'collapsed'}`}
                type="button"
                aria-expanded={openSection === 'product'}
                aria-controls="collapseProduct"
                onClick={() => toggleSection('product')}
              >
                <i className="fa-brands fa-unity me-2"></i>Product
              </button>
            </h2>
            <div
              id="collapseProduct"
              className={`accordion-collapse collapse ${openSection === 'product' ? 'show' : ''}`}
              aria-labelledby="headingProduct"
            >
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                  <Link to="/admin/product" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-list me-2"></i> Product List
                  </Link>
                  <Link to="/admin/product/add" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-circle-plus me-2"></i> Add Product
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingCategory">
              <button
                className={`accordion-button bg-light ${openSection === 'category' ? '' : 'collapsed'}`}
                type="button"
                aria-expanded={openSection === 'category'}
                aria-controls="collapseCategory"
                onClick={() => toggleSection('category')}
              >
                <i className="fa-brands fa-microsoft me-2"></i> Category
              </button>
            </h2>
            <div
              id="collapseCategory"
              className={`accordion-collapse collapse ${openSection === 'category' ? 'show' : ''}`}
              aria-labelledby="headingCategory"
            >
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                  <Link to="/admin/category" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-list me-2"></i> Category List
                  </Link>
                  <Link to="/admin/category/add" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-circle-plus me-2"></i> Add Category
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* BRAND */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingBrand">
              <button
                className={`accordion-button bg-light ${openSection === 'brand' ? '' : 'collapsed'}`}
                type="button"
                aria-expanded={openSection === 'brand'}
                aria-controls="collapseBrand"
                onClick={() => toggleSection('brand')}
              >
                <i className="fa-brands fa-opera me-2"></i> Brand
              </button>
            </h2>
            <div
              id="collapseBrand"
              className={`accordion-collapse collapse ${openSection === 'brand' ? 'show' : ''}`}
              aria-labelledby="headingBrand"
            >
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                  <Link to="/admin/brand" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-list me-2"></i> Brand List
                  </Link>
                  <Link to="/admin/brand/add" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-circle-plus me-2"></i> Add Brand
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOrder">
              <button
                className={`accordion-button bg-light ${openSection === 'order' ? '' : 'collapsed'}`}
                type="button"
                aria-expanded={openSection === 'order'}
                aria-controls="collapseOrder"
                onClick={() => toggleSection('order')}
              >
                <i className="fa-solid fa-chart-simple me-2"></i> Order
              </button>
            </h2>
            <div
              id="collapseOrder"
              className={`accordion-collapse collapse ${openSection === 'order' ? 'show' : ''}`}
              aria-labelledby="headingOrder"
            >
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                  <Link to="/admin/order" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-list me-2"></i> Order List
                  </Link>
                  <Link to="/admin/order/refund-request" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-bell-concierge  me-2"></i>Refund Requests Order
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* DISCOUNT */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingDiscount">
              <button
                className={`accordion-button bg-light ${openSection === 'discount' ? '' : 'collapsed'}`}
                type="button"
                aria-expanded={openSection === 'discount'}
                aria-controls="collapseDiscount"
                onClick={() => toggleSection('discount')}
              >
                <i className="fa-solid fa-tag me-2"></i> Discount
              </button>
            </h2>
            <div
              id="collapseDiscount"
              className={`accordion-collapse collapse ${openSection === 'discount' ? 'show' : ''}`}
              aria-labelledby="headingDiscount"
            >
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                  <Link to="/admin/discount" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-list me-2"></i> Discount List
                  </Link>
                  <Link to="/admin/discount/add" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-circle-plus me-2"></i> Add Discount
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* USER */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingUser">
              <button
                className={`accordion-button bg-light ${openSection === 'user' ? '' : 'collapsed'}`}
                type="button"
                aria-expanded={openSection === 'user'}
                aria-controls="collapseUser"
                onClick={() => toggleSection('user')}
              >
                <i className="fa-solid fa-user me-2"></i> User
              </button>
            </h2>
            <div
              id="collapseUser"
              className={`accordion-collapse collapse ${openSection === 'user' ? 'show' : ''}`}
              aria-labelledby="headingUser"
            >
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                  <Link to="/admin/user" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-list me-2"></i> User List
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* REVIEWS */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingReview">
              <button
                className={`accordion-button bg-light ${openSection === 'review' ? '' : 'collapsed'}`}
                type="button"
                aria-expanded={openSection === 'review'}
                aria-controls="collapseReview"
                onClick={() => toggleSection('review')}
              >
                <i className="fa-solid fa-comments me-2"></i> Reviews
              </button>
            </h2>
            <div
              id="collapseReview"
              className={`accordion-collapse collapse ${openSection === 'review' ? 'show' : ''}`}
              aria-labelledby="headingReview"
            >
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                  <Link to="/admin/reviews" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                    <i className="fa-solid fa-star me-2"></i> Product Reviews
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SHIPPING ZONE */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingShippingZone">
              <button
                className={`accordion-button bg-light ${openSection === 'shippingZone' ? '' : 'collapsed'}`}
                type="button"
                aria-expanded={openSection === 'shippingZone'}
                aria-controls="collapseShippingZone"
                onClick={() => toggleSection('shippingZone')}
              >
                <i className="fa-solid fa-city me-2"></i> Shipping Zone
              </button>
            </h2>
            <div
              id="collapseShippingZone"
              className={`accordion-collapse collapse ${openSection === 'shippingZone' ? 'show' : ''}`}
              aria-labelledby="headingShippingZone"
            >
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                  <Link to="/admin/shipping-zones" className="list-group-item list-group-item-action ps-5 py-3" onClick={onClose}>
                  <i className="fa-solid fa-user me-2"></i>  Zone List
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
        <style>{`
          #sidebar-wrapper .accordion-item {
            border: none;
            background: transparent;
            margin-bottom: 8px;
          }
          #sidebar-wrapper .accordion-button {
            border-radius: 12px !important;
            font-weight: 600;
            font-size: 17px;
            color: #2563eb;
            background: #f3f6fa !important;
            box-shadow: none;
            transition: background 0.18s, color 0.18s;
            padding: 14px 22px;
          }
          #sidebar-wrapper .accordion-button:hover, #sidebar-wrapper .accordion-button:not(.collapsed) {
            background: #e0e7ef !important;
            color: #1d4ed8;
          }
          #sidebar-wrapper .list-group-item {
            border: none;
            background: transparent;
            font-size: 15px;
            color: #222;
            font-weight: 500;
            border-radius: 8px;
            margin: 2px 0;
            padding: 10px 28px !important;
            transition: background 0.15s, color 0.15s;
            display: flex;
            align-items: center;
          }
          #sidebar-wrapper .list-group-item:hover, #sidebar-wrapper .list-group-item.active {
            background: #e0e7ef;
            color: #2563eb;
          }
          #sidebar-wrapper i {
            font-size: 19px;
            margin-right: 10px;
            min-width: 22px;
            text-align: center;
          }
          
          /* Mobile responsive */
          @media (max-width: 991.98px) {
            #sidebar-wrapper {
              position: fixed;
              top: 0;
              left: 0;
              height: auto; /* Thay đổi từ '100vh' thành 'auto' */
              max-height: 100vh; /* Thêm maxHeight */
              width: 280px;
              z-index: 1050;
              margin: 0;
              border-radius: 0;
              overflow-y: auto;
              padding: 20px 0; /* Thêm padding top/bottom */
            }
          }
          
          /* Desktop responsive */
          @media (min-width: 992px) {
            #sidebar-wrapper {
              min-height: auto;
              max-height: calc(100vh - 120px); /* Giới hạn height trên desktop */
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar;
