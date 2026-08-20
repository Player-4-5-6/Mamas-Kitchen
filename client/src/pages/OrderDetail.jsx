import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import OrderStatusTracker from "../components/OrderStatusTracker.jsx";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data.order)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="section container">Loading...</div>;
  if (!order) return <div className="section container empty-state">Order not found.</div>;

  return (
    <div className="section container" style={{ maxWidth: 640 }}>
      <h2 className="section-title">{order.orderNumber}</h2>

      <div className="panel" style={{ marginBottom: 20 }}>
        <OrderStatusTracker order={order} />
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>Items</h3>
        {order.items.map((item, idx) => (
          <div className="cart-line" key={idx}>
            <div className="cart-line-info">
              <div className="cart-line-name">{item.quantity}× {item.name}</div>
              {item.specialInstructions && <div className="cart-line-note">Note: {item.specialInstructions}</div>}
            </div>
            <span className="cart-line-price">₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="summary-row"><span>Subtotal</span><span>₦{order.itemsSubtotal.toLocaleString()}</span></div>
        <div className="summary-row"><span>Delivery Fee</span><span>{order.deliveryFee ? `₦${order.deliveryFee.toLocaleString()}` : "Free"}</span></div>
        <div className="summary-row total"><span>Total</span><span>₦{order.total.toLocaleString()}</span></div>
      </div>

      <div className="panel">
        <h3 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>Details</h3>
        <p style={{ fontSize: 14, opacity: 0.75, margin: "4px 0" }}>
          <strong>Fulfillment:</strong> {order.fulfillmentType === "delivery" ? "Delivery" : "Pickup"}
        </p>
        {order.fulfillmentType === "delivery" && order.deliveryAddress && (
          <p style={{ fontSize: 14, opacity: 0.75, margin: "4px 0" }}>
            <strong>Address:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city}
          </p>
        )}
        <p style={{ fontSize: 14, opacity: 0.75, margin: "4px 0" }}>
          <strong>Payment:</strong> {order.paymentMethod.replace(/_/g, " ")}
        </p>
      </div>
    </div>
  );
}
