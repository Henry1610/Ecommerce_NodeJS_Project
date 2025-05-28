import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="mt-3" id="sidebar-wrapper">
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
              🛍️ Product
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
                  📦 Product List
                </Link>
                <Link to="/admin/product/add" className="list-group-item list-group-item-action ps-5 py-3">
                  ➕ Add Product
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
              🗂️ Category
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
                  📁 Category List
                </Link>
                <Link to="/admin/category/add" className="list-group-item list-group-item-action ps-5 py-3">
                  ➕ Add Category
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
              🏷️ Brand
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
                  📜 Brand List
                </Link>
                <Link to="/admin/brand/add" className="list-group-item list-group-item-action ps-5 py-3">
                  ➕ Add Brand
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
              📦 Order
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
                  📋 Order List
                </Link>
                <Link to="/admin/order/add" className="list-group-item list-group-item-action ps-5 py-3">
                  ➕ Add Order
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
              💸 Discount
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
                  🧾 Discount List
                </Link>
                <Link to="/admin/discount/add" className="list-group-item list-group-item-action ps-5 py-3">
                  ➕ Add Discount
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
              💸 User
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
                  🧾 User List
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
              🚚 Shipping Zone
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
                  📦 Zone List
                </Link>
                <Link to="/admin/shipping-zones/create" className="list-group-item list-group-item-action ps-5 py-3">
                  ➕ Create Zone
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
