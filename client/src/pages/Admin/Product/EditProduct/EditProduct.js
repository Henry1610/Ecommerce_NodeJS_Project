import React from 'react';

const EditDiscount = ({
  productName,
  setProductName,
  productCode,
  setProductCode,
  category,
  setCategory,
  price,
  setPrice,
  stock,
  setStock,
  status,
  setStatus,
}) => {
  return ( 
    <div className="p-4 border-bottom">
      <h5 className="mb-4">Thông tin cơ bản</h5>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="product-name" className="form-label">
            Tên sản phẩm
          </label>
          <input
            type="text"
            id="product-name"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="product-code" className="form-label">
            Mã sản phẩm
          </label>
          <input
            type="text"
            id="product-code"
            className="form-control"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="category" className="form-label">
            Danh mục
          </label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Chọn danh mục</option>
            <option value="category1">Danh mục 1</option>
            <option value="category2">Danh mục 2</option>
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="price" className="form-label">
            Giá bán (VNĐ)
          </label>
          <div className="input-group">
            <input
              type="text"
              id="price"
              className="form-control"
              value={price.toLocaleString("vi-VN")}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setPrice(Number(value));
              }}
            />
            <span className="input-group-text">VNĐ</span>
          </div>
        </div>

        <div className="col-md-6">
          <label htmlFor="stock" className="form-label">
            Số lượng tồn kho
          </label>
          <input
            type="number"
            id="stock"
            className="form-control"
            min="0"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="status" className="form-label">
            Trạng thái
          </label>
          <select
            id="status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditDiscount;
