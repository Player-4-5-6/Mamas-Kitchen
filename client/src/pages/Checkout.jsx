import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const DELIVERY_FEE = 1500;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [fulfillmentType, setFulfillmentType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [address, setAddress] = useState({ street: "", area: "", city: "Lagos", phone: "" });
  const [placing, setPlacing] = useState(false);

  const deliveryFee = fulfillmentType === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const payload = {
        items,
        fulfillmentType,
        paymentMethod,
        deliveryAddress: fulfillmentType === "delivery" ? address : undefined,
      };
      const res = await api.post("/orders", payload);
      clearCart();
      toast.success("Order placed!");
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="section container empty-state">Your cart is empty.</div>;
  }

  return (
    <div className="section container" style={{ maxWidth: 640 }}>
      <h2 className="section-title">Checkout</h2>
      <form onSubmit={handlePlaceOrder}>
        <div className="panel" style={{ marginBottom: 18 }}>
          <div className="form-group">
            <label>Fulfillment</label>
            <select value={fulfillmentType} onChange={(e) => setFulfillmentType(e.target.value)}>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          {fulfillmentType === "delivery" && (
            <>
              <div className="form-group">
                <label>Street Address</label>
                <input required value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Area</label>
                  <input required value={address.area}
                    onChange={(e) => setAddress({ ...address, area: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input required value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              </div>
            </>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
            </select>
          </div>
        </div>

        <div className="panel">
          <div className="summary-row"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Delivery Fee</span><span>{deliveryFee ? `₦${deliveryFee.toLocaleString()}` : "Free"}</span></div>
          <div className="summary-row total"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
        </div>

        <button className="btn btn-primary btn-block" style={{ marginTop: 20 }} disabled={placing}>
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
