import { memo } from "react";
function Footer() {
  const countries = [
    "Quốc gia & Khu vực:", "Singapore", "Indonesia", "Thái Lan",
    "Việt Nam", "Phillipines", "Brazil", "Mexico", "Colombia", "Chile"
  ];
  const policies = [
    "CHÍNH SÁCH BẢO MẬT",
    "QUY CHẾ HOẠT ĐỘNG",
    "CHÍNH SÁCH VẬN CHUYỂN",
    "CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN"
  ];

  return (
    <div className="text-center text-muted small container border-top">
      <div className="row border-bottom py-4">
        <div className="col-12 col-sm-6 col-md-2 text-start mb-4">
          <h6 className="fw-bold">DỊCH VỤ KHÁCH HÀNG</h6>
          <ul className="list-unstyled">
            {[
              "Trung Tâm Trợ Giúp Shopee", "Shopee Blog", "Shopee Mall",
              "Hướng Dẫn Mua Hàng/Đặt Hàng", "Hướng Dẫn Bán Hàng", "Ví ShopeePay",
              "Shopee Xu", "Đơn Hàng", "Trả Hàng/Hoàn Tiền", "Liên Hệ PRO", "Chính Sách Bảo Hành"
            ].map((item, idx) => <li key={idx} className="mb-2 small">{item}</li>)}
          </ul>
        </div>

        <div className="col-12 col-sm-6 col-md-2 text-start mb-4">
          <h6 className="fw-bold">PRO VIỆT NAM</h6>
          <ul className="list-unstyled">
            {[
              "Về Shopee", "Tuyển Dụng", "Điều Khoản Shopee", "Chính Sách Bảo Mật",
              "PRO Mall", "Kênh Người Bán", "Flash Sale", "Tiếp Thị Liên Kết", "Liên Hệ Truyền Thông"
            ].map((item, idx) => <li key={idx} className="mb-2 small">{item}</li>)}
          </ul>
        </div>

        <div className="col-12 col-sm-12 col-md-4 text-start mb-4">
          <div className="mb-3">
            <h6 className="fw-bold">THANH TOÁN</h6>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {[...Array(8).keys()].map(i => (
                <img key={i} src={`https://down-vn.img.susercontent.com/file/${["d4bbea4570b93bfd5fc652ca82a262a8", "a0a9062ebe19b45c1ae0506f16af5c16", "38fd98e55806c3b2e4535c4e4a6c4c08", "bc2a874caeee705449c164be385b796c", "2c46b83d84111ddc32cfd3b5995d9281", "5e3f0bee86058637ff23cfdf2e14ca09", "9263fa8c83628f5deff55e2a90758b06", "0217f1d345587aa0a300e69e2195c492"][i]}`} className="bg-white p-1 img-fluid" alt="" style={{maxWidth:'60px',height:'30px',objectFit:'contain'}} />
              ))}
            </div>
          </div>
          <div>
            <h6 className="fw-bold">ĐƠN VỊ VẬN CHUYỂN</h6>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {[...Array(9).keys()].map(i => (
                <img key={i} src={`https://down-vn.img.susercontent.com/file/${["vn-11134258-7ras8-m20rc1wk8926cf", "vn-50009109-64f0b242486a67a3d29fd4bcf024a8c6", "59270fb2f3fbb7cbc92fca3877edde3f", "957f4eec32b963115f952835c779cd2c", "957f4eec32b963115f952835c779cd2c", "3900aefbf52b1c180ba66e5ec91190e5", "6e3be504f08f88a15a28a9a447d94d3d", "0b3014da32de48c03340a4e4154328f6", "vn-50009109-ec3ae587db6309b791b78eb8af6793fd"][i]}`} className="bg-white p-1 img-fluid" alt="" style={{maxWidth:'60px',height:'30px',objectFit:'contain'}} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-2 text-start mb-4">
          <h6 className="fw-bold">THEO DÕI PRO</h6>
          <ul className="list-unstyled">
            {[
              { name: "Facebook", icon: "2277b37437aa470fd1c71127c6ff8eb5" },
              { name: "Instagram", icon: "5973ebbc642ceee80a504a81203bfb91" },
              { name: "LinkeIn", icon: "f4f86f1119712b553992a75493065d9a" }
            ].map((social, idx) => (
              <li key={idx} className="mb-2">
                <a href="/" className="d-flex align-items-center text-decoration-none text-muted">
                  <img src={`https://down-vn.img.susercontent.com/file/${social.icon}`} className="me-2 img-fluid" height="20" alt="" style={{maxWidth:'24px'}} />
                  <span className="small">{social.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-12 col-sm-6 col-md-2 text-start mb-4">
          <h6 className="fw-bold">TẢI ỨNG DỤNG PRO</h6>
          <div className="d-flex flex-column flex-sm-row align-items-start">
            <img src="https://down-vn.img.susercontent.com/file/a5e589e8e118e937dc660f224b9a1472" alt="" style={{ width: '70px', height: 'auto' }} className="mb-2 mb-sm-0 me-sm-2 img-fluid" />
            <div className="d-flex flex-column gap-1">
              {["ad01628e90ddf248076685f73497c163", "ae7dced05f7243d0f3171f786e123def", "35352374f39bdd03b25e7b83542b2cb0"].map((img, idx) => (
                <img key={idx} src={`https://down-vn.img.susercontent.com/file/${img}`} className="bg-white p-1 rounded img-fluid" style={{ width: '80px', height: 'auto' }} alt="" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center py-4 gap-3">
        <div className="text-center text-md-start">© 2025 Shopee. Tất cả các quyền được bảo lưu.</div>
        <div className="d-flex flex-wrap justify-content-center gap-1 gap-sm-2 small">
          {countries.map((country, index) => (
            <span key={index} className="d-flex align-items-center">
              {index !== 0 && <span className="mx-1 text-muted">|</span>}
              <span className="text-muted">{country}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="text-muted small py-3">
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-3">
          {policies.map((policy, index) => (
            <div key={index} className="position-relative">
              <span className="text-muted">{policy}</span>
              {index !== policies.length - 1 && <span className="ms-2 text-secondary">|</span>}
            </div>
          ))}
        </div>

        <div className="text-center my-3">
          <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9765d68a8945750d.png" alt="" style={{ maxWidth: '100%', height: 'auto' }} className="img-fluid" />
        </div>

        <div className="text-center">
          <div>Công ty TNHH Shopee</div>
          <div className="mt-2 small">
            Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, TP Hà Nội, Việt Nam. Tổng đài hỗ trợ: 19001221 - Email: cskh@hotro.shopee.vn
          </div>
          <div className="mt-2 small">Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Bùi Anh Tuấn</div>
          <div className="mt-2 small">Mã số doanh nghiệp: 0106773786 do Sở KH&ĐT TP Hà Nội cấp ngày 10/02/2015</div>
          <div className="mt-2 small">© 2015 - Bản quyền thuộc về Công ty TNHH Shopee</div>
        </div>
      </div>
    </div>
  );
}

export default memo(Footer);
