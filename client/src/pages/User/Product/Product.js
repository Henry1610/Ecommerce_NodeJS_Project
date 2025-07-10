import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { fetchProducts } from '../../../redux/public/productsSlice';
import { fetchCategories } from '../../../redux/public/categorySlice';
import { fetchBrands } from '../../../redux/public/brandSlice';
import Select from 'react-select';

function Product() {
  const dispatch = useDispatch();
  const { products, loading, totalPages, currentPage } = useSelector((state) => state.public.publicProduct);
  
  const { categories } = useSelector((state) => state.public.publicCategory || { categories: [] });
  const { brands } = useSelector((state) => state.public.publicBrand || { brands: [] });
  
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: '',
  });
  
  const limit = 4;

  const { category, brand, minPrice, maxPrice, sortBy } = filters;

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    const filterParams = {
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy,
    };

    dispatch(fetchProducts({ page, limit, ...filterParams }));
  }, [dispatch, page, category, brand, minPrice, maxPrice, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '',
    });
    setPage(1);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  // Tạo options cho react-select brand
  const brandOptions = brands.map(br => ({
    value: br._id,
    label: br.name,
    logo: br.logo
  }));

  // Custom option cho react-select
  const formatBrandOptionLabel = (option) => (
    <div className="d-flex align-items-center gap-2">
      <img src={option.logo} alt={option.label} style={{ width: 28, height: 18, objectFit: 'contain', borderRadius: 4, background: '#fff', border: '1px solid #eee' }} />
      <span>{option.label}</span>
    </div>
  );

  return (
    <div className="container-fluid py-3">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3 col-lg-2">
          <div className="card shadow border-0 rounded-4 sticky-top" style={{ top: '20px', background: '#fff' }}>
            <div className="card-header bg-primary text-white rounded-top-4">
              <h6 className="mb-0 d-flex align-items-center justify-content-between">
                <span>
                  <i className="bi bi-funnel me-2"></i>
                  <span style={{ letterSpacing: 1 }}>BỘ LỌC</span>
                </span>
                <button 
                  className="btn btn-sm btn-light border-0 rounded-circle d-flex align-items-center justify-content-center" 
                  onClick={clearFilters}
                  title="Xóa tất cả bộ lọc"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                >
                  <i className="bi bi-x-lg text-danger"></i>
                </button>
              </h6>
            </div>
            <div className="card-body p-3">
              {/* Sort Filter */}
              <div className="filter-group mb-4">
                <label className="form-label fw-semibold text-uppercase small text-muted mb-1">
                  <i className="bi bi-sort-numeric-down me-1"></i>
                  Sắp xếp theo giá
                </label>
                <select
                  name="sortBy"
                  className="form-select form-select-sm rounded-3 border-secondary-subtle"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  style={{ transition: 'border 0.2s', boxShadow: 'none' }}
                >
                  <option value="">Mặc định</option>
                  <option value="price_asc">Thấp đến cao</option>
                  <option value="price_desc">Cao đến thấp</option>
                </select>
              </div>
              <hr className="my-2 opacity-25" />
              {/* Price Range Filter */}
              <div className="filter-group mb-4">
                <label className="form-label fw-semibold text-uppercase small text-muted mb-1">
                  <i className="bi bi-currency-dollar me-1"></i>
                  Khoảng giá
                </label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Từ"
                      className="form-control form-control-sm rounded-3 border-secondary-subtle"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      style={{ transition: 'border 0.2s', boxShadow: 'none' }}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Đến"
                      className="form-control form-control-sm rounded-3 border-secondary-subtle"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      style={{ transition: 'border 0.2s', boxShadow: 'none' }}
                    />
                  </div>
                </div>
              </div>
              <hr className="my-2 opacity-25" />
              {/* Category Filter */}
              <div className="filter-group mb-4">
                <label className="form-label fw-semibold text-uppercase small text-muted mb-1">
                  <i className="bi bi-grid me-1"></i>
                  Danh mục
                </label>
                <select
                  name="category"
                  className="form-select form-select-sm rounded-3 border-secondary-subtle"
                  value={filters.category}
                  onChange={handleFilterChange}
                  style={{ transition: 'border 0.2s', boxShadow: 'none' }}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <hr className="my-2 opacity-25" />
              {/* Brand Filter */}
              <div className="filter-group mb-3">
                <label className="form-label fw-semibold text-uppercase small text-muted mb-1">
                  <i className="bi bi-tags me-1"></i>
                  Thương hiệu
                </label>
                <Select
                  options={brandOptions}
                  value={brandOptions.find(opt => opt.value === filters.brand) || null}
                  onChange={opt => setFilters(f => ({ ...f, brand: opt ? opt.value : '' }))}
                  isClearable
                  placeholder="Tất cả brand"
                  formatOptionLabel={formatBrandOptionLabel}
                  classNamePrefix="brand-select"
                  styles={{
                    control: (base) => ({ ...base, borderRadius: 12, minHeight: 36, borderColor: '#dee2e6', boxShadow: 'none' }),
                    option: (base, state) => ({ ...base, display: 'flex', alignItems: 'center', gap: 8, background: state.isSelected ? '#f1f3f5' : '#fff', color: '#222' }),
                    singleValue: (base) => ({ ...base, display: 'flex', alignItems: 'center', gap: 8 }),
                  }}
                />
              </div>
              {/* Active Filters Summary */}
              {(category || brand || minPrice || maxPrice || sortBy) && (
                <div className="active-filters mt-3 pt-3 border-top">
                  <small className="text-muted fw-semibold text-uppercase">Đang dùng:</small>
                  <div className="mt-2 d-flex flex-wrap gap-1">
                    {sortBy && (
                      <span className="badge bg-info d-flex align-items-center gap-1">
                        {sortBy === 'price_asc' ? 'Giá tăng dần' : 'Giá giảm dần'}
                        <button type="button" className="btn btn-sm btn-link p-0 ms-1 text-white" style={{ lineHeight: 1 }} onClick={() => setFilters(f => ({ ...f, sortBy: '' }))}>
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </span>
                    )}
                    {category && (
                      <span className="badge bg-success d-flex align-items-center gap-1">
                        {categories.find(c => c._id === category)?.name}
                        <button type="button" className="btn btn-sm btn-link p-0 ms-1 text-white" style={{ lineHeight: 1 }} onClick={() => setFilters(f => ({ ...f, category: '' }))}>
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </span>
                    )}
                    {brand && (
                      <span className="badge bg-warning d-flex align-items-center gap-1">
                        {brands.find(b => b._id === brand)?.name}
                        <button type="button" className="btn btn-sm btn-link p-0 ms-1 text-dark" style={{ lineHeight: 1 }} onClick={() => setFilters(f => ({ ...f, brand: '' }))}>
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </span>
                    )}
                    {(minPrice || maxPrice) && (
                      <span className="badge bg-secondary d-flex align-items-center gap-1">
                        {minPrice && maxPrice ? `${minPrice}đ - ${maxPrice}đ` 
                         : minPrice ? `Từ ${minPrice}đ` 
                         : `Đến ${maxPrice}đ`}
                        <button type="button" className="btn btn-sm btn-link p-0 ms-1 text-white" style={{ lineHeight: 1 }} onClick={() => setFilters(f => ({ ...f, minPrice: '', maxPrice: '' }))}>
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Content */}
        <div className="col-md-9 col-lg-10">
          {/* Results Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              {loading ? 'Đang tải...' : `Hiển thị ${products.length} sản phẩm`}
            </h5>
            {!loading && products.length > 0 && (
              <small className="text-muted">
                Trang {currentPage} / {totalPages}
              </small>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="bi bi-search display-1 text-muted"></i>
              </div>
              <h6 className="text-muted">Không tìm thấy sản phẩm nào</h6>
              <p className="text-muted small">Hãy thử điều chỉnh bộ lọc của bạn</p>
              <button className="btn btn-outline-primary btn-sm" onClick={clearFilters}>
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {products.map(product => (
                  <div className="col-6 col-lg-4 col-xl-3" key={product._id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-4 py-3">
                  <button 
                    className="btn btn-outline-primary btn-sm d-flex align-items-center" 
                    onClick={handlePrev} 
                    disabled={page <= 1}
                  >
                    <i className="bi bi-chevron-left me-1"></i>
                    Trang trước
                  </button>

                  <div className="pagination-info px-3">
                    <span className="badge bg-primary">
                      {currentPage} / {totalPages}
                    </span>
                  </div>

                  <button 
                    className="btn btn-outline-primary btn-sm d-flex align-items-center" 
                    onClick={handleNext} 
                    disabled={page >= totalPages}
                  >
                    Trang sau
                    <i className="bi bi-chevron-right ms-1"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;