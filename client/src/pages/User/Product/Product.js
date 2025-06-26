import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { fetchProducts } from '../../../redux/public/productsSlice';
import { fetchCategories } from '../../../redux/public/categorySlice';
import { fetchBrands } from '../../../redux/public/brandSlice';

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

  return (
    <div className="container-fluid py-3">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3 col-lg-2">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0 d-flex align-items-center justify-content-between">
                <span>
                  <i className="bi bi-funnel me-2"></i>
                  Bộ lọc
                </span>
                <button 
                  className="btn btn-sm btn-outline-light" 
                  onClick={clearFilters}
                  title="Xóa tất cả bộ lọc"
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              </h6>
            </div>
            <div className="card-body p-3">
              {/* Sort Filter */}
              <div className="filter-group mb-4">
                <label className="form-label fw-semibold text-muted small">
                  <i className="bi bi-sort-numeric-down me-1"></i>
                  SẮP XẾP THEO GIÁ
                </label>
                <select
                  name="sortBy"
                  className="form-select form-select-sm"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="">Mặc định</option>
                  <option value="price_asc">Thấp đến cao</option>
                  <option value="price_desc">Cao đến thấp</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-group mb-4">
                <label className="form-label fw-semibold text-muted small">
                  <i className="bi bi-currency-dollar me-1"></i>
                  KHOẢNG GIÁ
                </label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Từ"
                      className="form-control form-control-sm"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Đến"
                      className="form-control form-control-sm"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="filter-group mb-4">
                <label className="form-label fw-semibold text-muted small">
                  <i className="bi bi-grid me-1"></i>
                  DANH MỤC
                </label>
                <select
                  name="category"
                  className="form-select form-select-sm"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="filter-group mb-3">
                <label className="form-label fw-semibold text-muted small">
                  <i className="bi bi-tags me-1"></i>
                  THƯƠNG HIỆU
                </label>
                <select
                  name="brand"
                  className="form-select form-select-sm"
                  value={filters.brand}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map(br => (
                    <option key={br._id} value={br._id}>
                      {br.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters Summary */}
              {(category || brand || minPrice || maxPrice || sortBy) && (
                <div className="active-filters mt-3 pt-3 border-top">
                  <small className="text-muted fw-semibold">BỘ LỌC ĐANG DÙNG:</small>
                  <div className="mt-2">
                    {sortBy && (
                      <span className="badge bg-info me-1 mb-1">
                        {sortBy === 'price_asc' ? 'Giá tăng dần' : 'Giá giảm dần'}
                      </span>
                    )}
                    {category && (
                      <span className="badge bg-success me-1 mb-1">
                        {categories.find(c => c._id === category)?.name}
                      </span>
                    )}
                    {brand && (
                      <span className="badge bg-warning me-1 mb-1">
                        {brands.find(b => b._id === brand)?.name}
                      </span>
                    )}
                    {(minPrice || maxPrice) && (
                      <span className="badge bg-secondary me-1 mb-1">
                        {minPrice && maxPrice ? `${minPrice}đ - ${maxPrice}đ` 
                         : minPrice ? `Từ ${minPrice}đ` 
                         : `Đến ${maxPrice}đ`}
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