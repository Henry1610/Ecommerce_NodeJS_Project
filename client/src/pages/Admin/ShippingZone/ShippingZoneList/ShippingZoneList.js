import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchShippingZones,
  deleteShippingZone,
  createShippingZone,
  updateShippingZone,
} from '../../../../redux/admin/shippingZoneSlice';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ShippingZoneList = () => {
  const dispatch = useDispatch();
  const { zones = [], loading = false, error = null } = useSelector((state) => state.admin.adminShippingZone || {});
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newZone, setNewZone] = useState({ city: '', fee: '' });
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [editedZone, setEditedZone] = useState({ city: '', fee: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchShippingZones());
  }, [dispatch]);

  // Filter zones based on search term
  const filteredZones = zones.filter(zone =>
    zone.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    const select = !selectAll;
    setSelectAll(select);
    setSelectedZones(select ? filteredZones.map((z) => z._id) : []);
  };

  const handleSelectZone = (id) => {
    setSelectedZones((prev) =>
      prev.includes(id) ? prev.filter((zid) => zid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedZones.length === 0) {
      return Swal.fire('Chưa chọn', 'Vui lòng chọn ít nhất một khu vực để xóa.', 'warning');
    }

    const result = await Swal.fire({
      title: 'Xóa nhiều khu vực?',
      text: `Bạn có chắc muốn xóa ${selectedZones.length} khu vực đã chọn?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xóa tất cả',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(selectedZones.map(id => dispatch(deleteShippingZone(id)).unwrap()));
        setSelectedZones([]);
        setSelectAll(false);
        Swal.fire('Đã xóa!', 'Các khu vực đã được xóa thành công.', 'success');
      } catch (err) {
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa khu vực.', 'error');
      }
    }
  };

  const handleDeleteZone = async (zoneId) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc?',
      text: 'Thao tác này sẽ xóa khu vực giao hàng!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteShippingZone(zoneId)).unwrap();
        Swal.fire('Đã xóa!', 'Khu vực đã được xóa.', 'success');
      } catch (err) {
        Swal.fire('Lỗi!', err?.message || 'Không thể xóa khu vực.', 'error');
      }
    }
  };

  const handleAddZone = async () => {
    if (!newZone.city || !newZone.fee) {
      return Swal.fire('Thiếu thông tin', 'Vui lòng điền đủ thông tin.', 'warning');
    }

    try {
      await dispatch(createShippingZone({ ...newZone, fee: Number(newZone.fee) })).unwrap();
      setNewZone({ city: '', fee: '' });
      setShowAddForm(false);
      Swal.fire('Thành công!', 'Đã thêm vùng vận chuyển.', 'success');
    } catch (err) {
      Swal.fire('Lỗi!', err?.message || 'Không thể thêm vùng.', 'error');
    }
  };

  const handleEdit = (zone) => {
    setEditingZoneId(zone._id);
    setEditedZone({ city: zone.city, fee: zone.fee });
  };

  const cancelEdit = () => {
    setEditingZoneId(null);
    setEditedZone({ city: '', fee: '' });
  };

  const handleSaveEdit = async () => {
    const feeNumber = Number(editedZone.fee);
    if (!editedZone.city || isNaN(feeNumber) || feeNumber <= 0) {
      return Swal.fire('Thiếu thông tin', 'Vui lòng nhập tên thành phố hợp lệ và phí > 0.', 'warning');
    }
    try {
      await dispatch(updateShippingZone({
        id: editingZoneId,
        city: editedZone.city,
        fee: feeNumber
      })).unwrap();
      Swal.fire('Thành công!', 'Đã cập nhật vùng vận chuyển.', 'success');
      setEditingZoneId(null);
      setEditedZone({ city: '', fee: '' });
    } catch (err) {
      Swal.fire('Lỗi!', err?.message || 'Không thể cập nhật vùng.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted fs-5">Đang tải danh sách vùng vận chuyển...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white p-4 rounded-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="fw-bold mb-1">
                  <i className="fas fa-shipping-fast me-2"></i>
                  Quản lý vùng vận chuyển
                </h4>
                <p className="mb-0 opacity-75">Quản lý phí và khu vực giao hàng</p>
              </div>
              <div className="bg-white bg-opacity-25 rounded-circle p-3">
                <i className="fas fa-map-marked-alt fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="row mb-4">
        <div className="col-lg-6 col-md-8 mb-3">
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Tìm kiếm theo tên vùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-6 col-md-4 mb-3">
          <div className="d-flex gap-2 justify-content-end">
            {selectedZones.length > 0 && (
              <button 
                className="btn btn-outline-danger"
                onClick={handleBulkDelete}
              >
                <i className="fas fa-trash me-2"></i>
                Xóa đã chọn ({selectedZones.length})
              </button>
            )}
            <button 
              className="btn btn-primary text-white"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <i className="fas fa-plus me-2"></i>
              Thêm vùng mới
            </button>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light border-0">
                <h5 className="mb-0">
                  <i className="fas fa-plus-circle me-2 text-info"></i>
                  Thêm vùng vận chuyển mới
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tên vùng</label>
                    <input
                      type="text"
                      className="form-control form-control-md"
                      value={newZone.city}
                      onChange={(e) => setNewZone({ ...newZone, city: e.target.value })}
                      placeholder="Nhập tên thành phố/vùng"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Phí vận chuyển (₫)</label>
                    <input
                      type="number"
                      className="form-control form-control-md"
                      value={newZone.fee}
                      onChange={(e) => setNewZone({ ...newZone, fee: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">&nbsp;</label>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-info btn-md w-75"
                        onClick={handleAddZone}
                      >
                        <i className="fas fa-save text-white"></i>
                      </button>
                      <button 
                        className="btn btn-outline-info btn-md"
                        onClick={() => setShowAddForm(false)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger border-0 shadow-sm" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 ps-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th className="border-0 fw-semibold">#</th>
                      <th className="border-0 fw-semibold">
                        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                        Tên vùng
                      </th>
                      <th className="border-0 fw-semibold">
                        <i className="fas fa-money-bill-wave me-2 text-success"></i>
                        Phí vận chuyển
                      </th>
                      <th className="border-0 fw-semibold text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredZones.map((zone, index) => (
                      <tr key={zone._id} className={selectedZones.includes(zone._id) ? 'table-active' : ''}>
                        <td className="ps-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedZones.includes(zone._id)}
                              onChange={() => handleSelectZone(zone._id)}
                            />
                          </div>
                        </td>
                        <td className="fw-medium text-muted">{index + 1}</td>
                        <td>
                          {editingZoneId === zone._id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editedZone.city}
                              onChange={(e) =>
                                setEditedZone({ ...editedZone, city: e.target.value })
                              }
                            />
                          ) : (
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <i className="fas fa-city text-primary"></i>
                              </div>
                              <span className="fw-medium">{zone.city}</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {editingZoneId === zone._id ? (
                            <input
                              type="number"
                              className="form-control"
                              value={editedZone.fee}
                              onChange={(e) =>
                                setEditedZone({ ...editedZone, fee: Number(e.target.value) })
                              }
                            />
                          ) : (
                            <span className="badge bg-primary bg-opacity-15 text-white fs-6 px-3 py-2">
                              {zone.fee?.toLocaleString()} ₫
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          {editingZoneId === zone._id ? (
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={handleSaveEdit}
                                title="Lưu thay đổi"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={cancelEdit}
                                title="Hủy"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => handleEdit(zone)}
                                title="Chỉnh sửa"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteZone(zone._id)}
                                className="btn btn-sm btn-outline-danger"
                                title="Xóa"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredZones.length === 0 && !loading && (
                  <div className="text-center py-5">
                    <div className="text-muted">
                      <i className="fas fa-search fa-3x mb-3 opacity-50"></i>
                      <p className="fs-5">
                        {searchTerm ? 
                          `Không tìm thấy vùng nào với từ khóa "${searchTerm}"` : 
                          'Chưa có vùng vận chuyển nào'
                        }
                      </p>
                      {!searchTerm && (
                        <button 
                          className="btn btn-primary mt-2"
                          onClick={() => setShowAddForm(true)}
                        >
                          <i className="fas fa-plus me-2"></i>
                          Thêm vùng đầu tiên
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {filteredZones.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center text-muted">
              <small>
                Hiển thị {filteredZones.length} / {zones.length} vùng vận chuyển
              </small>
              {selectedZones.length > 0 && (
                <small>
                  Đã chọn {selectedZones.length} vùng
                </small>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingZoneList;