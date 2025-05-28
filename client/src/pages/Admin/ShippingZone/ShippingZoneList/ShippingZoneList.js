import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchShippingZones,
  deleteShippingZone,
  createShippingZone,
  updateShippingZone, // 👈 thêm
} from '../../../../redux/shippingZone/shippingZoneSlice';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ShippingZoneList = () => {
  const dispatch = useDispatch();
  const { zones, loading, error } = useSelector((state) => state.shippingZones);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [newZone, setNewZone] = useState({ city: '', fee: '' });

  const [editingZoneId, setEditingZoneId] = useState(null);
  const [editedZone, setEditedZone] = useState({ city: '', fee: '' });

  useEffect(() => {
    dispatch(fetchShippingZones());
  }, [dispatch]);

  const handleSelectAll = () => {
    const select = !selectAll;
    setSelectAll(select);
    setSelectedZones(select ? zones.map((z) => z._id) : []);
  };

  const handleSelectZone = (id) => {
    setSelectedZones((prev) =>
      prev.includes(id) ? prev.filter((zid) => zid !== id) : [...prev, id]
    );
  };

  const handleDeleteZone = async (zoneId) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc?',
      text: 'Thao tác này sẽ xoá khu vực giao hàng!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteShippingZone(zoneId)).unwrap();
        Swal.fire('Đã xoá!', 'Khu vực đã được xoá.', 'success');
      } catch (err) {
        Swal.fire('Lỗi!', err?.message || 'Không thể xoá khu vực.', 'error');
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
    try {
      await dispatch(updateShippingZone({ id: editingZoneId, ...editedZone })).unwrap();
      Swal.fire('Thành công!', 'Đã cập nhật vùng vận chuyển.', 'success');
      setEditingZoneId(null);
      setEditedZone({ city: '', fee: '' });
    } catch (err) {
      Swal.fire('Lỗi!', err?.message || 'Không thể cập nhật vùng.', 'error');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold">Shipping Zones</h4>
              <h6 className="text-muted">Manage your Shipping Areas</h6>
            </div>
            <Link to="/admin/shippingzones/add" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i> Add Zone
            </Link>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              {loading ? (
                <p>Loading zones...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th>#</th>
                        <th>Zone Name</th>
                        <th>Shipping Fee</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zones.map((zone, index) => (
                        <tr key={zone._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedZones.includes(zone._id)}
                              onChange={() => handleSelectZone(zone._id)}
                            />
                          </td>
                          <td>{index + 1}</td>

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
                              zone.city
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
                              zone.fee?.toLocaleString() + ' ₫'
                            )}
                          </td>

                          <td>
                            {editingZoneId === zone._id ? (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={handleSaveEdit}
                                >
                                  Lưu
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={cancelEdit}
                                >
                                  Huỷ
                                </button>
                              </div>
                            ) : (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(zone)}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteZone(zone._id)}
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* Row to add new zone */}
                      <tr>
                        <td></td>
                        <td>+</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={newZone.city}
                            onChange={(e) => setNewZone({ ...newZone, city: e.target.value })}
                            placeholder="Nhập tên vùng"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={newZone.fee}
                            onChange={(e) => setNewZone({ ...newZone, fee: e.target.value })}
                            placeholder="Phí vận chuyển"
                          />
                        </td>
                        <td>
                          <button className="btn btn-sm btn-success" onClick={handleAddZone}>
                            Thêm
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {zones.length === 0 && (
                    <p className="text-muted text-center mt-3">Không có vùng vận chuyển nào.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingZoneList;
