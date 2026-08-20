import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          Mama's <span>Kitchen</span>
        </Link>
        <div className="nav-links">
          <Link to="/menu">Menu</Link>
          {user && user.role !== "admin" && <Link to="/orders">My Orders</Link>}
          {user?.role === "admin" && (
            <Link to="/admin" style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <LayoutDashboard size={15} /> Dashboard
            </Link>
          )}
          <Link to="/cart" className="cart-pill">
            <ShoppingBag size={15} /> {totalCount}
          </Link>
          {user ? (
            <button onClick={handleLogout} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none" }}>
              <LogOut size={15} /> Logout
            </button>
          ) : (
            <Link to="/login" style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <User size={15} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
