import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../../redux/admin/orderSlice";
import { fetchProducts } from "../../../redux/admin/productsSlice";
import { Line, Pie } from "react-chartjs-2";
import { Chart, LineElement, PointElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(LineElement, PointElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const pieColors = ["#3b82f6", "#f59e42", "#a855f7", "#10b981", "#f43f5e"];

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const { orders } = useSelector((state) => state.admin.adminOrder);
  const { products } = useSelector((state) => state.admin.adminProduct);

  // Gom doanh thu theo ngày
  const revenueByDate = {};
  (orders || []).forEach(order => {
    if (!order.createdAt) return;
    const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
    revenueByDate[date] = (revenueByDate[date] || 0) + (order.totalPrice || 0);
  });

  // Sắp xếp ngày tăng dần
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
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Pie chart top 5 sản phẩm bán chạy toàn bộ thời gian
  const topProductsAll = [...(products || [])]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);
  const pieDataAll = {
    labels: topProductsAll.map(p => p.name),
    datasets: [
      {
        data: topProductsAll.map(p => p.sold || 0),
        backgroundColor: pieColors,
        borderWidth: 2,
      },
    ],
  };
  const totalSoldAll = topProductsAll.reduce((sum, p) => sum + (p.sold || 0), 0);

  // Pie chart top 5 sản phẩm bán chạy tháng này
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const soldByProductThisMonth = {};
  (orders || []).forEach(order => {
    if (!order.createdAt || !order.orderItems) return;
    const d = new Date(order.createdAt);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      order.orderItems.forEach(item => {
        soldByProductThisMonth[item.product] = (soldByProductThisMonth[item.product] || 0) + (item.qty || 0);
      });
    }
  });
  const productsThisMonth = (products || []).map(p => ({
    ...p,
    soldThisMonth: soldByProductThisMonth[p._id] || 0,
  }));
  const topProductsMonth = [...productsThisMonth]
    .sort((a, b) => (b.soldThisMonth || 0) - (a.soldThisMonth || 0))
    .slice(0, 5);
  const pieDataMonth = {
    labels: topProductsMonth.map(p => p.name),
    datasets: [
      {
        data: topProductsMonth.map(p => p.soldThisMonth || 0),
        backgroundColor: pieColors,
        borderWidth: 2,
      },
    ],
  };
  const totalSoldMonth = topProductsMonth.reduce((sum, p) => sum + (p.soldThisMonth || 0), 0);

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto" }}>
      <h2>Biểu đồ doanh thu theo ngày</h2>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 40 }}>
        <Line data={lineData} options={lineOptions} />
      </div>

      <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
        {/* Pie chart tháng này */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 500 }}>
          <h4 style={{ marginBottom: 16, textAlign: "center" }}>Top 5 sản phẩm bán chạy tháng này</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 180, height: 180 }}>
              <Pie data={pieDataMonth} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div>
              {topProductsMonth.map((p, idx) => (
                <div key={p._id || idx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: pieDataMonth.datasets[0].backgroundColor[idx],
                    marginRight: 8
                  }} />
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <span style={{ width: 50, textAlign: "right" }}>{p.soldThisMonth || 0}</span>
                  <span style={{ width: 50, textAlign: "right", color: "#888" }}>
                    {totalSoldMonth ? ((p.soldThisMonth || 0) * 100 / totalSoldMonth).toFixed(1) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Pie chart toàn bộ thời gian */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 500 }}>
          <h4 style={{ marginBottom: 16, textAlign: "center" }}>Top 5 sản phẩm bán chạy toàn bộ thời gian</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 180, height: 180 }}>
              <Pie data={pieDataAll} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div>
              {topProductsAll.map((p, idx) => (
                <div key={p._id || idx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: pieDataAll.datasets[0].backgroundColor[idx],
                    marginRight: 8
                  }} />
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <span style={{ width: 50, textAlign: "right" }}>{p.sold || 0}</span>
                  <span style={{ width: 50, textAlign: "right", color: "#888" }}>
                    {totalSoldAll ? ((p.sold || 0) * 100 / totalSoldAll).toFixed(1) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;