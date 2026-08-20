import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate("/login", { state: { from: "/checkout" } });
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="section container">
        <div className="empty-state">
          <p style={{ fontSize: 17, marginBottom: 16 }}>Your cart is empty.</p>
          <Link to="/menu" className="btn btn-primary">Browse the Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section container" style={{ maxWidth: 640 }}>
      <h2 className="section-title">Your Cart</h2>
      <div className="panel">
        {items.map((item, idx) => (
          <div className="cart-line" key={idx}>
            <div className="cart-line-info">
              <div className="cart-line-name">{item.name}</div>
              {item.specialInstructions && (
                <div className="cart-line-note">Note: {item.specialInstructions}</div>
              )}
              <div className="stepper" style={{ marginTop: 8 }}>
                <button onClick={() => updateQuantity(idx, item.quantity - 1)}><Minus size={14} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(idx, item.quantity + 1)}><Plus size={14} /></button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
              <span className="cart-line-price">₦{(item.price * item.quantity).toLocaleString()}</span>
              <button className="btn-ghost" onClick={() => removeItem(idx)}>
                <Trash2 size={16} color="var(--pepper)" />
              </button>
            </div>
          </div>
        ))}

        <div className="summary-row total">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <p style={{ fontSize: 12.5, opacity: 0.55, margin: "6px 0 0" }}>
          Delivery fee (if applicable) calculated at checkout.
        </p>
      </div>

      <button className="btn btn-primary btn-block" style={{ marginTop: 20 }} onClick={handleCheckout}>
        Proceed to Checkout
      </button>
    </div>
  );
}
