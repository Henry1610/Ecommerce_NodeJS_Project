import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../../redux/admin/orderSlice";
import { fetchProducts } from "../../../redux/admin/productsSlice";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { FaBoxOpen, FaTags, FaThLarge, FaUserFriends, FaExclamationTriangle } from 'react-icons/fa';
import { fetchUsers } from "../../../redux/admin/userSlice";
import { fetchBrands } from "../../../redux/admin/brandSlice";
import { fetchCategories } from "../../../redux/admin/categoriesSlice";

Chart.register(LineElement, PointElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const pieColors = ["#3b82f6", "#f59e42", "#a855f7", "#10b981", "#f43f5e"];

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
    dispatch(fetchUsers())
    dispatch(fetchBrands())
    dispatch(fetchCategories())
  }, [dispatch]);

  const { orders } = useSelector((state) => state.admin.adminOrder);
  const { products } = useSelector((state) => state.admin.adminProduct);
  const { brands } = useSelector((state) => state.admin.adminBrand);
  const { categories } = useSelector((state) => state.admin.adminCategory);
  const { users } = useSelector((state) => state.admin.adminUser);
  console.log(products, orders, categories, brands)
  const revenueByDate = {};
  (orders || []).forEach(order => {
    if (!order.createdAt) return;
    const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
    revenueByDate[date] = (revenueByDate[date] || 0) + (order.totalPrice || 0);
  });

  const sortedDates = Object.keys(revenueByDate).sort((a, b) => {
    const [da, ma, ya] = a.split("/");
    const [db, mb, yb] = b.split("/");
    return new Date(`${ya}-${ma}-${da}`) - new Date(`${yb}-${mb}-${db}`);
  });

  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: sortedDates.map(date => revenueByDate[date]),
        fill: true,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const soldByProductThisMonth = {};
  (orders || []).forEach(order => {
    if (!order.createdAt || !order.items) return;
    const d = new Date(order.createdAt);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      order.items.forEach(item => {
        soldByProductThisMonth[item.product] = (soldByProductThisMonth[item.product] || 0) + (item.quantity || 0);
      });
    }
  });

  const productsThisMonth = (products || []).map(p => ({
    ...p,
    soldThisMonth: soldByProductThisMonth[p._id] || 0,
  }));

  // Top 5 sản phẩm bán chạy toàn thời gian
  const topProductsAll = [...(products || [])]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

  const createPieData = (products, key) => {
    return {
      labels: products.map(p => p.name),
      datasets: [
        {
          data: products.map(p => p[key] || 0),
          backgroundColor: pieColors,
          borderWidth: 2,
        },
      ],
    };
  };

  const pieDataAll = createPieData(topProductsAll, "sold");
  const pieChartStyle = {
    width: 220,
    height: 220,
    margin: "0 auto",
  };

  const renderProductStats = (products, total, key, colors) => (
    <div>
      {products.map((p, idx) => (
        <div key={p._id || idx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: colors[idx],
              marginRight: 8,
            }}
          />
          <span style={{ flex: 1 }}>{p.name}</span>
          <span style={{ width: 50, textAlign: "right" }}>{p[key] || 0}</span>
          <span style={{ width: 50, textAlign: "right", color: "#888" }}>
            {total ? ((p[key] || 0) * 100 / total).toFixed(1) : 0}%
          </span>
        </div>
      ))}
    </div>
  );

  const totalSoldAll = topProductsAll.reduce((sum, p) => sum + (p.sold || 0), 0);

  // Thống kê 5 sản phẩm còn số lượng ít nhất
  const minStockProducts = [...(products || [])]
    .filter(p => typeof p.stock === 'number')
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  // Đơn hàng mới nhất
  const recentOrders = [...(orders || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Thống kê top category bán chạy
  const soldByCategory = {};
  (orders || []).forEach(order => {
    if (!order.items) return;
    order.items.forEach(item => {
      const productId = typeof item.product === 'object' ? item.product._id : item.product;
      const product = (products || []).find(p => p._id === productId);
      if (product && product.category) {
        const catId = typeof product.category === 'object' ? product.category._id : product.category;
        soldByCategory[catId] = (soldByCategory[catId] || 0) + (item.quantity || 0);
      }
    });
  });
  const categoriesWithSold = (categories || []).map(cat => ({
    ...cat,
    sold: soldByCategory[cat._id] || 0,
  }));
  const topCategories = [...categoriesWithSold]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);
  const pieDataCategory = {
    labels: topCategories.map(c => c.name),
    datasets: [
      {
        data: topCategories.map(c => c.sold),
        backgroundColor: pieColors,
        borderWidth: 2,
      },
    ],
  };
  const totalSoldCategory = topCategories.reduce((sum, c) => sum + c.sold, 0);

  // Thống kê top brand bán chạy
  const soldByBrand = {};
  (orders || []).forEach(order => {
    if (!order.items) return;
    order.items.forEach(item => {
      const productId = typeof item.product === 'object' ? item.product._id : item.product;
      const product = (products || []).find(p => p._id === productId);
      if (product && product.brand) {
        const brandId = typeof product.brand === 'object' ? product.brand._id : product.brand;
        soldByBrand[brandId] = (soldByBrand[brandId] || 0) + (item.quantity || 0);
      }
    });
  });
  const brandsWithSold = (brands || []).map(brand => ({
    ...brand,
    sold: soldByBrand[brand._id] || 0,
  }));
  const topBrands = [...brandsWithSold]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);
  const pieDataBrand = {
    labels: topBrands.map(b => b.name),
    datasets: [
      {
        data: topBrands.map(b => b.sold),
        backgroundColor: pieColors,
        borderWidth: 2,
      },
    ],
  };
  const totalSoldBrand = topBrands.reduce((sum, b) => sum + b.sold, 0);

  const [pieTab, setPieTab] = useState("product");

  return (
    <div style={{
      maxWidth: 1200,
      margin: "40px auto",
      fontFamily: "Inter, Arial, sans-serif",
      background: "#f6f8fa",
      minHeight: "100vh",
      padding: "32px 32px"
    }}>
      {/* Box tổng quan */}
      <div style={{
        display: "flex",
        gap: 16,
        justifyContent: "center",
        marginBottom: 24,
        flexWrap: "wrap"
      }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', boxShadow: '0 1px 6px rgba(59,130,246,0.06)', minWidth: 180, margin: 2 }}>
          <FaBoxOpen size={28} color="#3b82f6" style={{ marginRight: 12 }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#3b82f6' }}>{products?.length || 0}</div>
            <div style={{ color: '#555', fontWeight: 500, fontSize: 14 }}>Sản phẩm</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', boxShadow: '0 1px 6px rgba(245,158,66,0.06)', minWidth: 180, margin: 2 }}>
          <FaTags size={28} color="#f59e42" style={{ marginRight: 12 }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e42' }}>{brands?.length || 0}</div>
            <div style={{ color: '#555', fontWeight: 500, fontSize: 14 }}>Thương hiệu</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', boxShadow: '0 1px 6px rgba(168,85,247,0.06)', minWidth: 180, margin: 2 }}>
          <FaThLarge size={28} color="#a855f7" style={{ marginRight: 12 }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#a855f7' }}>{categories?.length || 0}</div>
            <div style={{ color: '#555', fontWeight: 500, fontSize: 14 }}>Danh mục</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', boxShadow: '0 1px 6px rgba(16,185,129,0.06)', minWidth: 180, margin: 2 }}>
          <FaUserFriends size={28} color="#10b981" style={{ marginRight: 12 }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#10b981' }}>{users?.length || 0}</div>
            <div style={{ color: '#555', fontWeight: 500, fontSize: 14 }}>Người dùng</div>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: 28,
        marginBottom: 28,
        boxShadow: "0 2px 12px rgba(59,130,246,0.08)"
      }}>
        <h3 style={{ fontWeight: 700, marginBottom: 18, color: "#3b82f6", fontSize: 20 }}>Doanh thu theo ngày</h3>
        <Line data={lineData} options={lineOptions} height={60} />
      </div>

      {/* Pie Chart dạng tab */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, marginBottom: 28, boxShadow: "0 2px 12px rgba(59,130,246,0.08)", maxWidth: 700, margin: "32px auto" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setPieTab("product")} style={{ background: pieTab === "product" ? "#3b82f6" : "#f3f6fa", color: pieTab === "product" ? "#fff" : "#222", border: "none", borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>Sản phẩm</button>
          <button onClick={() => setPieTab("category")} style={{ background: pieTab === "category" ? "#10b981" : "#f3f6fa", color: pieTab === "category" ? "#fff" : "#222", border: "none", borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>Danh mục</button>
          <button onClick={() => setPieTab("brand")} style={{ background: pieTab === "brand" ? "#f59e42" : "#f3f6fa", color: pieTab === "brand" ? "#fff" : "#222", border: "none", borderRadius: 8, padding: "6px 18px", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>Thương hiệu</button>
        </div>
        {pieTab === "product" && (
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ width: 180, height: 180 }}>
              <Pie data={pieDataAll} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              {topProductsAll.map((p, idx) => (
                <div key={p._id || idx} style={{ display: "flex", alignItems: "center", marginBottom: 8, fontWeight: 500 }}>
                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: pieDataAll.datasets[0].backgroundColor[idx], marginRight: 10, border: "2px solid #fff", boxShadow: "0 0 4px rgba(0,0,0,0.08)" }} />
                  <span style={{ flex: 1, fontSize: 15 }}>{p.name}</span>
                  <span style={{ width: 40, textAlign: "right", fontWeight: 700, color: "#a855f7" }}>{p.sold || 0}</span>
                  <span style={{ width: 40, textAlign: "right", color: "#888", fontSize: 13 }}>{totalSoldAll ? ((p.sold || 0) * 100 / totalSoldAll).toFixed(1) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {pieTab === "category" && (
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ width: 180, height: 180 }}>
              <Pie data={pieDataCategory} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              {topCategories.map((c, idx) => (
                <div key={c._id || idx} style={{ display: "flex", alignItems: "center", marginBottom: 8, fontWeight: 500 }}>
                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: pieDataCategory.datasets[0].backgroundColor[idx], marginRight: 10, border: "2px solid #fff", boxShadow: "0 0 4px rgba(0,0,0,0.08)" }} />
                  <span style={{ flex: 1, fontSize: 15 }}>{c.name}</span>
                  <span style={{ width: 40, textAlign: "right", fontWeight: 700, color: "#10b981" }}>{c.sold || 0}</span>
                  <span style={{ width: 40, textAlign: "right", color: "#888", fontSize: 13 }}>{totalSoldCategory ? ((c.sold || 0) * 100 / totalSoldCategory).toFixed(1) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {pieTab === "brand" && (
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ width: 180, height: 180 }}>
              <Pie data={pieDataBrand} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              {topBrands.map((b, idx) => (
                <div key={b._id || idx} style={{ display: "flex", alignItems: "center", marginBottom: 8, fontWeight: 500 }}>
                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: pieDataBrand.datasets[0].backgroundColor[idx], marginRight: 10, border: "2px solid #fff", boxShadow: "0 0 4px rgba(0,0,0,0.08)" }} />
                  <span style={{ flex: 1, fontSize: 15 }}>{b.name}</span>
                  <span style={{ width: 40, textAlign: "right", fontWeight: 700, color: "#f59e42" }}>{b.sold || 0}</span>
                  <span style={{ width: 40, textAlign: "right", color: "#888", fontSize: 13 }}>{totalSoldBrand ? ((b.sold || 0) * 100 / totalSoldBrand).toFixed(1) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sản phẩm có số lượng ít nhất */}
      <div style={{
        background: "#fff",
        borderRadius: 14,
        padding: 18,
        marginBottom: 24,
        boxShadow: "0 1px 6px rgba(245,62,94,0.06)"
      }}>
        <h4 style={{ marginBottom: 12, color: "#f43f5e", fontWeight: 700, fontSize: 17 }}>
          <FaExclamationTriangle style={{ marginRight: 8, verticalAlign: "middle" }} />
          Sản phẩm có số lượng ít nhất
        </h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600, fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#fef2f2" }}>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600 }}>Tên sản phẩm</th>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600 }}>Danh mục</th>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600 }}>Thương hiệu</th>
                <th style={{ padding: 8, textAlign: "center", fontWeight: 600 }}>Số lượng</th>
                <th style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>Giá</th>
              </tr>
            </thead>
            <tbody>
              {minStockProducts.map(product => (
                <tr key={product._id} style={{
                  borderBottom: "1px solid #fee2e2",
                  transition: "background 0.2s"
                }}
                  onMouseOver={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseOut={e => e.currentTarget.style.background = ""}
                >
                  <td style={{ padding: 8, fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: 8 }}>{product.category?.name || "N/A"}</td>
                  <td style={{ padding: 8 }}>{product.brand?.name || "N/A"}</td>
                  <td style={{ padding: 8, textAlign: "center" }}>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: product.stock <= 5 ? "#fef2f2" : "#fff7ed",
                      color: product.stock <= 5 ? "#dc2626" : "#ea580c",
                      fontWeight: 600,
                      fontSize: 13
                    }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>{product.price?.toLocaleString()}₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Đơn hàng mới gần đây */}
      <div style={{
        background: "#fff",
        borderRadius: 14,
        padding: 18,
        marginBottom: 24,
        boxShadow: "0 1px 6px rgba(59,130,246,0.06)"
      }}>
        <h4 style={{ marginBottom: 12, color: "#3b82f6", fontWeight: 700, fontSize: 17 }}>Đơn hàng mới gần đây</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600, fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f3f6fa" }}>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600 }}>Mã đơn</th>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600 }}>Khách hàng</th>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600 }}>Ngày tạo</th>
                <th style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>Tổng tiền</th>
                <th style={{ padding: 8, textAlign: "center", fontWeight: 600 }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id} style={{
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
                  cursor: "pointer"
                }}
                  onMouseOver={e => e.currentTarget.style.background = "#f6f8fa"}
                  onMouseOut={e => e.currentTarget.style.background = ""}
                >
                  <td style={{ padding: 8 }}>{order.orderNumber || order._id.slice(-6)}</td>
                  <td style={{ padding: 8 }}>{order.shippingAddress?.fullName || "Ẩn danh"}</td>
                  <td style={{ padding: 8 }}>{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                  <td style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>{order.totalPrice?.toLocaleString()}₫</td>
                  <td style={{ padding: 8, textAlign: "center" }}>
                    <span style={{
                      padding: "2px 10px",
                      borderRadius: 8,
                      background: order.status === 'Đã giao' ? "#e0f7fa" : "#fffbe7",
                      color: order.status === 'Đã giao' ? "#10b981" : "#f59e42",
                      fontWeight: 600,
                      fontSize: 13
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;