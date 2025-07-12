import React from 'react';
import { Link } from 'react-router-dom';
const stores = [
  {
    city: 'Thành phố Hồ Chí Minh',
    locations: [
      {
        image: 'https://pendecor.vn/uploads/files/2024/01/28/thiet-ke-showroom-dien-may-1.jpg',
        address: 'Số 5 - 7 Nguyễn Huy Tưởng, F6, Q. Bình Thạnh',
        time: '09:00 - 21:00',
        status: 'Đóng cửa',
        map: '#',
      },
      {
        image: 'https://pendecor.vn/uploads/files/2024/01/28/thiet-ke-showroom-dien-may-5.jpg',
        address: '95 Trần Thiện Chánh, Q10',
        time: '09:00 - 21:00',
        status: 'Đóng cửa',
        map: '#',
      },
    ],
  },
  {
    city: 'Hà Nội',
    locations: [
      {
        image: 'https://pendecor.vn/uploads/files/2024/01/28/thiet-ke-showroom-dien-may-11.jpg',
        address: '53 Thái Hà, Đống Đa',
        time: '09:00 - 22:00',
        status: 'Đóng cửa',
        map: '#',
      },
    ],
  },
];

const AddressStore = () => {
  return (
    <div className="container py-5 border-top" style={{ maxWidth: 1200 }}>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none">Trang chủ</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">Địa chỉ cửa hàng</li>
      </ol>
      {stores.map((store, idx) => (
        <div key={store.city} className="mb-5">
          <h4 className="fw-bold mb-4">{store.city}</h4>
          <div className="row g-4">
            {store.locations.map((loc, i) => (
              <div className="col-md-6 col-lg-4" key={loc.address}>
                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: 20 }}>
                  <img
                    src={loc.image}
                    alt={loc.address}
                    className="card-img-top"
                    style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 180, objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: 140 }}>
                    <div>
                      <div className="fw-bold mb-2" style={{ fontSize: 17 }}>{loc.address}</div>
                      <div className="text-muted mb-2" style={{ fontSize: 15 }}>
                        {loc.time} <span className="mx-2">·</span> {loc.status}
                      </div>
                    </div>
                    <a
                      href={loc.map}
                      className="btn btn-outline-dark w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: 16, fontWeight: 600 }}
                    >
                      <i className="fas fa-map-marker-alt"></i> Chỉ đường
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressStore; 