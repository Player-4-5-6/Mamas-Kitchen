import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const statusLabel = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const ALL_STATUSES = ["pending", "confirmed", "preparing", "out_for_delivery", "ready_for_pickup", "delivered", "cancelled"];
const CATEGORIES = ["Rice Dishes", "Soups & Swallow", "Protein", "Small Chops", "Drinks", "Extras"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("orders");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: CATEGORIES[0] });

  const loadOrders = () => api.get("/orders").then((res) => setOrders(res.data.orders));
  const loadStats = () => api.get("/orders/stats/overview").then((res) => setStats(res.data));
  const loadMenu = () => api.get("/menu").then((res) => setMenuItems(res.data.items));

  useEffect(() => {
    loadStats();
    loadOrders();
    loadMenu();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      loadOrders();
      loadStats();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleToggleAvailability = async (itemId) => {
    await api.patch(`/menu/${itemId}/availability`);
    loadMenu();
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Delete this menu item?")) return;
    await api.delete(`/menu/${itemId}`);
    toast.success("Item deleted");
    loadMenu();
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post("/menu", {
        ...newItem,
        price: Number(newItem.price),
        description: newItem.description || "Freshly prepared.",
      });
      toast.success("Menu item added");
      setNewItem({ name: "", description: "", price: "", category: CATEGORIES[0] });
      setShowAddForm(false);
      loadMenu();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add item");
    }
  };

  return (
    <div className="section container">
      <h2 className="section-title">Restaurant Dashboard</h2>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-value">{stats.totalOrders}</div></div>
          <div className="stat-card"><div className="stat-label">Total Revenue</div><div className="stat-value">₦{stats.totalRevenue.toLocaleString()}</div></div>
          <div className="stat-card"><div className="stat-label">Today's Orders</div><div className="stat-value">{stats.todaysOrderCount}</div></div>
          <div className="stat-card"><div className="stat-label">Today's Revenue</div><div className="stat-value">₦{stats.todaysRevenue.toLocaleString()}</div></div>
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>Orders</button>
        <button className={`tab ${tab === "menu" ? "active" : ""}`} onClick={() => setTab("menu")}>Menu</button>
      </div>

      {tab === "orders" && (
        <div className="panel">
          <table>
            <thead>
              <tr>
                <th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Type</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderNumber}</td>
                  <td>{o.customer?.name || "—"}</td>
                  <td>{o.items.length}</td>
                  <td>₦{o.total.toLocaleString()}</td>
                  <td style={{ textTransform: "capitalize" }}>{o.fulfillmentType}</td>
                  <td>
                    <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      style={{ background: "var(--char)", color: "var(--cloth)", border: "1px solid var(--line)", borderRadius: 8, padding: "6px 8px", fontSize: 13 }}>
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{statusLabel(s)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p style={{ opacity: 0.6, padding: "20px 0" }}>No orders yet.</p>}
        </div>
      )}

      {tab === "menu" && (
        <div>
          <button className="btn btn-primary" style={{ marginBottom: 18 }} onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "+ Add Menu Item"}
          </button>

          {showAddForm && (
            <form className="panel" onSubmit={handleAddItem} style={{ marginBottom: 24 }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input required value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Price (₦)</label>
                  <input type="number" required value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={2} value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button className="btn btn-primary btn-block">Save Item</button>
            </form>
          )}

          <div className="panel">
            <table>
              <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>₦{item.price.toLocaleString()}</td>
                    <td>
                      <button className="btn-ghost" style={{ fontSize: 12.5, fontWeight: 700, color: item.isAvailable ? "#9bd18a" : "#e98a71" }}
                        onClick={() => handleToggleAvailability(item._id)}>
                        {item.isAvailable ? "Available" : "Sold Out"}
                      </button>
                    </td>
                    <td>
                      <button className="btn-ghost" style={{ color: "var(--pepper)", fontSize: 12.5, fontWeight: 700 }}
                        onClick={() => handleDeleteItem(item._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
