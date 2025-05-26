import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteProduct, fetchProducts } from '../../../../redux/product/productsSlice';
import Swal from 'sweetalert2';

import './ProductList.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products); // tùy vào tên state trong slice của bạn


  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

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

          <div className="card shadow-sm">
            <div className="card-body">
              {/* ... phần filter, search ... */}

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
                      <th>Danh mục</th>
                      <th>Thương hiệu</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products && products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <label className="checkboxs">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleSelectProduct(product._id)}
                            />
                            <span className="checkmarks"></span>
                          </label>
                        </td>
                        <td className="d-flex align-items-center">
                          <a href="#" className="product-img">
                            <img src={product.img} alt="sản phẩm" className="product-img" />
                          </a>
                          <a href="#">{product.name}</a>
                        </td>
                        <td>{product.category.name}</td>
                        <td>{product.brand.name}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td className="action-icons">
                          <Link to={`${product._id}`} className="me-2" title="Xem chi tiết">
                            <i className="fas fa-eye"></i>
                          </Link>
                          <Link to={`edit/${product._id}`} className="me-2" title="Chỉnh sửa">
                            <i className="fas fa-edit"></i>
                          </Link>
                          <buton onClick={() => handleDelete(product._id)} className="confirm-text" title="Xóa">
                            <i className="fas fa-trash"></i>
                          </buton>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
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
