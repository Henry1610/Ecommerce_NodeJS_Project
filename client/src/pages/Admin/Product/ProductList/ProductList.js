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

  if (loading) return <p>Đang tải dữ liệu sản phẩm...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold">Danh sách sản phẩm</h4>
              <h6 className="text-muted">Quản lý sản phẩm của bạn</h6>
            </div>
            <Link to='add' className="btn btn-primary d-flex align-items-center">
              <i className="fas fa-plus me-2"></i>Thêm sản phẩm mới
            </Link>
          </div>
          <div className="row mb-3">
            <div className="col-lg-4 col-md-6 col-12">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-searchset btn-primary" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table align-middle table-hover shadow-sm" style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
                  <thead style={{ background: '#f3f6fa', borderBottom: '2px solid #e0e7ef' }}>
                    <tr style={{ fontSize: 17, fontWeight: 700, color: '#2563eb' }}>
                      <th style={{ width: 40, border: 'none' }}>
                        <input
                          type="checkbox"
                          id="select-all"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ border: 'none' }}>Tên sản phẩm</th>
                      <th style={{ border: 'none' }}>Danh mục</th>
                      <th style={{ border: 'none' }}>Thương hiệu</th>
                      <th style={{ border: 'none' }}>Giá</th>
                      <th style={{ border: 'none' }}>Số lượng</th>
                      <th style={{ width: 120, border: 'none' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts && filteredProducts.map(product => (
                      <tr key={product._id} className="align-middle" style={{ transition: 'box-shadow 0.2s, background 0.2s', border: 'none', borderRadius: 12, boxShadow: '0 1px 8px rgba(59,130,246,0.06)', marginBottom: 8, background: '#fff' }}>
                        <td style={{ border: 'none' }}>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => handleSelectProduct(product._id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td className="d-flex align-items-center" style={{ border: 'none' }}>
                          <a href="#" className="product-img">
                            <img src={product.images && product.images.length > 0 ? product.images[0] : '/default-product.jpg'} alt="sản phẩm" className="product-img" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, marginRight: 8 }} />
                          </a>
                          <span style={{ fontWeight: 600, fontSize: 16 }}>{product.name}</span>
                        </td>
                        <td style={{ border: 'none' }}>{product?.category?.name}</td>
                        <td style={{ border: 'none' }}>{product?.brand?.name}</td>
                        <td style={{ border: 'none' }}>
                          {
                            typeof product?.price === 'number' && !isNaN(product.price)
                              ? product.price.toLocaleString('vi-VN') + 'đ'
                              : (Number(product?.price) ? Number(product.price).toLocaleString('vi-VN') + 'đ' : '-')
                          }
                        </td>
                        <td style={{ border: 'none' }}>{product?.stock}</td>
                        <td style={{ border: 'none' }}>
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
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="10" className="text-center">Không có sản phẩm nào.</td>
                      </tr>
                    )}
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
