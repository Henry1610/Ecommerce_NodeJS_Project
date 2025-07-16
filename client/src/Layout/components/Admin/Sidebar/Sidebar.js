import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="mt-3" id="sidebar-wrapper" style={{
      background: '#f8fafc',
      borderRadius: 18,
      boxShadow: '0 4px 24px rgba(59,130,246,0.08)',
      padding: '18px 0',
      minHeight: '92vh',
      maxWidth: 270,
      marginLeft: 12,
      marginRight: 12
    }}>
      <div className="accordion" id="sidebarAccordion">
        
        {/* PRODUCT */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingProduct">
            <button
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseProduct"
              aria-expanded="false"
              aria-controls="collapseProduct"
            >
              <i className="fa-brands fa-unity me-2"></i>Product
            </button>
          </h2>
          <div
            id="collapseProduct"
            className="accordion-collapse collapse"
            aria-labelledby="headingProduct"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/admin/product" className="list-group-item list-group-item-action ps-5 py-3">
                <i className="fa-solid fa-list me-2"></i> Product List
                </Link>
                <Link to="/admin/product/add" className="list-group-item list-group-item-action ps-5 py-3">
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
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseCategory"
              aria-expanded="false"
              aria-controls="collapseCategory"
            >
              <i className="fa-brands fa-microsoft me-2"></i> Category
            </button>
          </h2>
          <div
            id="collapseCategory"
            className="accordion-collapse collapse"
            aria-labelledby="headingCategory"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/admin/category" className="list-group-item list-group-item-action ps-5 py-3">
                <i className="fa-solid fa-list me-2"></i> Category List
                </Link>
                <Link to="/admin/category/add" className="list-group-item list-group-item-action ps-5 py-3">
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
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseBrand"
              aria-expanded="false"
              aria-controls="collapseBrand"
            >
              <i className="fa-brands fa-opera me-2"></i> Brand
            </button>
          </h2>
          <div
            id="collapseBrand"
            className="accordion-collapse collapse"
            aria-labelledby="headingBrand"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/admin/brand" className="list-group-item list-group-item-action ps-5 py-3">
                <i className="fa-solid fa-list me-2"></i> Brand List
                </Link>
                <Link to="/admin/brand/add" className="list-group-item list-group-item-action ps-5 py-3">
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
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOrder"
              aria-expanded="false"
              aria-controls="collapseOrder"
            >
              <i className="fa-solid fa-chart-simple me-2"></i> Order
            </button>
          </h2>
          <div
            id="collapseOrder"
            className="accordion-collapse collapse"
            aria-labelledby="headingOrder"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/admin/order" className="list-group-item list-group-item-action ps-5 py-3">
                <i className="fa-solid fa-list me-2"></i> Order List
                </Link>
                <Link to="/admin/order/refund-request" className="list-group-item list-group-item-action ps-5 py-3">
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
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseDiscount"
              aria-expanded="false"
              aria-controls="collapseDiscount"
            >
              <i className="fa-solid fa-tag me-2"></i> Discount
            </button>
          </h2>
          <div
            id="collapseDiscount"
            className="accordion-collapse collapse"
            aria-labelledby="headingDiscount"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/admin/discount" className="list-group-item list-group-item-action ps-5 py-3">
                <i className="fa-solid fa-list me-2"></i> Discount List
                </Link>
                <Link to="/admin/discount/add" className="list-group-item list-group-item-action ps-5 py-3">
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
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseUser"
              aria-expanded="false"
              aria-controls="collapseUser"
            >
              <i className="fa-solid fa-user me-2"></i> User
            </button>
          </h2>
          <div
            id="collapseUser"
            className="accordion-collapse collapse"
            aria-labelledby="headingUser"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/admin/user" className="list-group-item list-group-item-action ps-5 py-3">
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
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseReview"
              aria-expanded="false"
              aria-controls="collapseReview"
            >
              <i className="fa-solid fa-comments me-2"></i> Reviews
            </button>
          </h2>
          <div
            id="collapseReview"
            className="accordion-collapse collapse"
            aria-labelledby="headingReview"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/admin/reviews" className="list-group-item list-group-item-action ps-5 py-3">
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
              className="accordion-button collapsed bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseShippingZone"
              aria-expanded="false"
              aria-controls="collapseShippingZone"
            >
              <i className="fa-solid fa-city me-2"></i> Shipping Zone
            </button>
          </h2>
          <div
            id="collapseShippingZone"
            className="accordion-collapse collapse"
            aria-labelledby="headingShippingZone"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/admin/shipping-zones" className="list-group-item list-group-item-action ps-5 py-3">
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
        @media (max-width: 900px) {
          #sidebar-wrapper {
            max-width: 100vw;
            padding: 8px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
