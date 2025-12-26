import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteProduct, fetchProducts } from '../../../../redux/admin/productsSlice';
import Swal from 'sweetalert2';

import './ProductList.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.admin.adminProduct);
  

  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedProducts(!selectAll ? products.map(p => p.id) : []);
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };
  const handleDelete = async (id) => {
    if (!id) return;

    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xoá?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Xoá sản phẩm thành công!');
        await dispatch(fetchProducts());
      } catch (error) {
        toast.error('Xoá sản phẩm thất bại!');
      }
    }
  };

  // Lọc sản phẩm theo searchTerm
  const filteredProducts = products.filter(product =>
    (product.name || '').toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12">
          {/* Header */}
          <div className="mb-4">
            <h1 className="h3 fw-bold text-dark mb-2">Quản lý sản phẩm</h1>
            <p className="text-muted mb-0">Danh sách và quản lý tất cả sản phẩm trong hệ thống</p>
          </div>

          {/* Search Bar */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-body p-2">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-5">
                  <div className="position-relative">
                    <i className="fas fa-search position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control form-control-md ps-5 border-2"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-7 d-flex justify-content-end align-items-center mt-2 mt-md-0">
                  <Link to='add' className="btn btn-primary d-flex align-items-center">
                    <i className="fas fa-plus me-2"></i>Thêm sản phẩm mới
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mb-0">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <i className="fas fa-exclamation-triangle text-danger mb-3" style={{ fontSize: '2rem' }}></i>
                <p className="text-danger mb-0">{error}</p>
              </div>
            ) : (
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead style={{ background: '#f3f6fa', borderBottom: '2px solid #e0e7ef' }}>
                      <tr>
                        <th style={{ width: 40, border: 'none', padding: '12px 16px', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            id="select-all"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            style={{ cursor: 'pointer' }}
                          />
                        </th>
                        <th style={{ border: 'none', padding: '12px 16px', fontWeight: 600 }}>Tên sản phẩm</th>
                        <th style={{ border: 'none', padding: '12px 16px', fontWeight: 600 }}>Danh mục</th>
                        <th style={{ border: 'none', padding: '12px 16px', fontWeight: 600 }}>Thương hiệu</th>
                        <th style={{ border: 'none', padding: '12px 16px', fontWeight: 600 }}>Giá</th>
                        <th style={{ border: 'none', padding: '12px 16px', fontWeight: 600 }}>Số lượng</th>
                        <th style={{ width: 120, border: 'none', padding: '12px 16px', fontWeight: 600 }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts && filteredProducts.length > 0 ? filteredProducts.map(product => (
                        <tr key={product._id} className="align-middle border-bottom border-light hover-bg-light">
                          <td style={{ border: 'none', padding: '12px 16px' }}>
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleSelectProduct(product._id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td className="d-flex align-items-center" style={{ border: 'none', padding: '12px 16px' }}>
                            <img src={product.images && product.images.length > 0 ? product.images[0] : '/default-product.jpg'} alt="sản phẩm" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, marginRight: 8 }} />
                            <span style={{ fontWeight: 600, fontSize: 15 }}>{product.name}</span>
                          </td>
                          <td style={{ border: 'none', padding: '12px 16px' }}>{product?.category?.name || '-'}</td>
                          <td style={{ border: 'none', padding: '12px 16px' }}>{product?.brand?.name || '-'}</td>
                          <td style={{ border: 'none', padding: '12px 16px' }}>
                            {
                              typeof product?.price === 'number' && !isNaN(product.price)
                                ? product.price.toLocaleString('vi-VN') + 'đ'
                                : (Number(product?.price) ? Number(product.price).toLocaleString('vi-VN') + 'đ' : '-')
                            }
                          </td>
                          <td style={{ border: 'none', padding: '12px 16px' }}>{product?.stock || 0}</td>
                          <td style={{ border: 'none', padding: '12px 16px' }}>
                            <div className="d-flex gap-2 justify-content-center">
                              <Link to={`${product._id}`} className="btn btn-sm" style={{ background: '#f3f6fa', color: '#2563eb', borderRadius: 8, border: 'none', boxShadow: '0 1px 4px rgba(59,130,246,0.06)' }} title="Xem chi tiết">
                                <i className="fas fa-eye"></i>
                              </Link>
                              <Link to={`edit/${product._id}`} className="btn btn-sm" style={{ background: '#f3f6fa', color: '#2563eb', borderRadius: 8, border: 'none', boxShadow: '0 1px 4px rgba(59,130,246,0.06)' }} title="Chỉnh sửa">
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button className="btn btn-sm" style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 8, border: 'none', boxShadow: '0 1px 4px rgba(245,62,94,0.06)' }} title="Xoá" onClick={() => handleDelete(product._id)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="7" className="text-center py-5">
                            <i className="fas fa-box-open text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                            <p className="text-muted mb-0">Không có sản phẩm nào.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
          </div>
        </div>
      </div>
      <style>{`
        .hover-bg-light:hover {
          background-color: #f8fafc !important;
        }
      `}</style>
    </div>
  );
};

export default ProductList;
