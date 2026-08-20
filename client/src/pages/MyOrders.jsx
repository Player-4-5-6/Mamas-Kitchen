import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const statusLabel = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my-orders").then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="section container">Loading...</div>;

  if (orders.length === 0) {
    return (
      <div className="section container">
        <div className="empty-state">
          <p style={{ marginBottom: 16 }}>You haven't placed any orders yet.</p>
          <Link to="/menu" className="btn btn-primary">Browse the Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section container" style={{ maxWidth: 720 }}>
      <h2 className="section-title">My Orders</h2>
      {orders.map((order) => (
        <Link to={`/orders/${order._id}`} key={order._id} className="order-card" style={{ display: "block" }}>
          <div className="order-card-top">
            <span className="order-num">{order.orderNumber}</span>
            <span className={`status-badge sb-${order.status}`}>{statusLabel(order.status)}</span>
          </div>
          <div style={{ fontSize: 13.5, opacity: 0.65 }}>
            {order.items.length} item{order.items.length > 1 ? "s" : ""} · ₦{order.total.toLocaleString()} ·{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </Link>
      ))}
    </div>
  );
}
