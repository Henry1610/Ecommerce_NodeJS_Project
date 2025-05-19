import React, { useState } from 'react';
import  './ProductList.css'
const ProductList = () => {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const products = [
        { id: 'PT001', name: 'Macbook pro', img: 'assets/img/product/product1.jpg', category: 'Máy tính', brand: 'N/D', price: 1500.00, unit: 'cái', qty: 100.00, createdBy: 'Quản trị viên' },
        { id: 'PT002', name: 'Cam', img: 'assets/img/product/product2.jpg', category: 'Trái cây', brand: 'N/D', price: 10.00, unit: 'cái', qty: 100.00, createdBy: 'Quản trị viên' },
        { id: 'PT003', name: 'Dứa', img: 'assets/img/product/product3.jpg', category: 'Trái cây', brand: 'N/D', price: 10.00, unit: 'cái', qty: 100.00, createdBy: 'Quản trị viên' },
        { id: 'PT004', name: 'Dâu tây', img: 'assets/img/product/product4.jpg', category: 'Trái cây', brand: 'N/D', price: 10.00, unit: 'cái', qty: 100.00, createdBy: 'Quản trị viên' },
        { id: 'PT005', name: 'Bơ', img: 'assets/img/product/product5.jpg', category: 'Phụ kiện', brand: 'N/D', price: 10.00, unit: 'cái', qty: 150.00, createdBy: 'Quản trị viên' },
        { id: 'PT006', name: 'Macbook Pro', img: 'assets/img/product/product6.jpg', category: 'Giày', brand: 'N/D', price: 10.00, unit: 'cái', qty: 100.00, createdBy: 'Quản trị viên' },
        { id: 'PT007', name: 'Apple Earpods', img: 'assets/img/product/product7.jpg', category: 'Giày', brand: 'N/D', price: 10.00, unit: 'cái', qty: 100.00, createdBy: 'Quản trị viên' },
        { id: 'PT008', name: 'iPhone 11', img: 'assets/img/product/product8.jpg', category: 'Trái cây', brand: 'N/D', price: 10.00, unit: 'cái', qty: 100.00, createdBy: 'Quản trị viên' },
        { id: 'PT009', name: 'Samsung', img: 'assets/img/product/product9.jpg', category: 'Tai nghe', brand: 'N/D', price: 10.00, unit: 'cái', qty: 100.00, createdBy: 'Quản trị viên' },
        { id: 'PT0010', name: 'Chuối', img: 'assets/img/product/product11.jpg', category: 'Chăm sóc sức khỏe', brand: 'N/D', price: 10.00, unit: 'kg', qty: 100.00, createdBy: 'Quản trị viên' },
        { id: 'PT0011', name: 'Chanh', img: 'assets/img/product/product17.jpg', category: 'Chăm sóc sức khỏe', brand: 'N/D', price: 10.00, unit: 'kg', qty: 100.00, createdBy: 'Quản trị viên' },
    ];

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedProducts(!selectAll ? products.map(p => p.id) : []);
    };

    const handleSelectProduct = (id) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    return (
        <div className="container-fluid py-4">
            

            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold">Danh sách sản phẩm</h4>
                            <h6 className="text-muted">Quản lý sản phẩm của bạn</h6>
                        </div>
                        <a href="addproduct.html" className="btn btn-primary d-flex align-items-center">
                            <i className="fas fa-plus me-2"></i>Thêm sản phẩm mới
                        </a>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-filter btn-outline-primary me-2"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#filter_inputs"
                                    >
                                        <i className="fas fa-filter"></i>
                                    </button>
                                    <div className="input-group" style={{ maxWidth: '300px' }}>
                                        <input type="text" className="form-control" placeholder="Tìm kiếm..." />
                                        <button className="btn btn-searchset btn-primary" type="button">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <a href="#" data-bs-toggle="tooltip" title="PDF">
                                            <i className="fas fa-file-pdf"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="#" data-bs-toggle="tooltip" title="Excel">
                                            <i className="fas fa-file-excel"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="#" data-bs-toggle="tooltip" title="In">
                                            <i className="fas fa-print"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="collapse" id="filter_inputs">
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                <select className="form-select">
                                                    <option>Chọn sản phẩm</option>
                                                    <option>Macbook pro</option>
                                                    <option>Cam</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                <select className="form-select">
                                                    <option>Chọn danh mục</option>
                                                    <option>Máy tính</option>
                                                    <option>Trái cây</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                <select className="form-select">
                                                    <option>Chọn danh mục con</option>
                                                    <option>Máy tính</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                <select className="form-select">
                                                    <option>Thương hiệu</option>
                                                    <option>N/D</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-2 col-md-4 col-sm-6">
                                                <select className="form-select">
                                                    <option>Giá</option>
                                                    <option>150.00</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-2 col-md-4 col-sm-6 d-flex">
                                                <button className="btn btn-filters btn-primary ms-auto">
                                                    <i className="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <label className="checkboxs">
                                                    <input
                                                        type="checkbox"
                                                        id="select-all"
                                                        checked={selectAll}
                                                        onChange={handleSelectAll}
                                                    />
                                                    <span className="checkmarks"></span>
                                                </label>
                                            </th>
                                            <th>Tên sản phẩm</th>
                                            <th>SKU</th>
                                            <th>Danh mục</th>
                                            <th>Thương hiệu</th>
                                            <th>Giá</th>
                                            <th>Đơn vị</th>
                                            <th>Số lượng</th>
                                            <th>Người tạo</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td>
                                                    <label className="checkboxs">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProducts.includes(product.id)}
                                                            onChange={() => handleSelectProduct(product.id)}
                                                        />
                                                        <span className="checkmarks"></span>
                                                    </

label>
                                                </td>
                                                <td className="d-flex align-items-center">
                                                    <a href="#" className="product-img">
                                                        <img src={product.img} alt="sản phẩm" className="product-img" />
                                                    </a>
                                                    <a href="#">{product.name}</a>
                                                </td>
                                                <td>{product.id}</td>
                                                <td>{product.category}</td>
                                                <td>{product.brand}</td>
                                                <td>{product.price.toFixed(2)}</td>
                                                <td>{product.unit}</td>
                                                <td>{product.qty.toFixed(2)}</td>
                                                <td>{product.createdBy}</td>
                                                <td className="action-icons">
                                                    <a href="product-details.html" className="me-2" title="Xem chi tiết">
                                                        <i className="fas fa-eye"></i>
                                                    </a>
                                                    <a href="editproduct.html" className="me-2" title="Chỉnh sửa">
                                                        <i className="fas fa-edit"></i>
                                                    </a>
                                                    <a href="#" className="confirm-text" title="Xóa">
                                                        <i className="fas fa-trash"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;