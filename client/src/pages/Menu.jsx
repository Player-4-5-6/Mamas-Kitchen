import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const CATEGORIES = [
  "All",
  "Rice Dishes",
  "Soups & Swallow",
  "Protein",
  "Small Chops",
  "Drinks",
  "Extras",
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    api
      .get("/menu", { params: { category: category === "All" ? undefined : category } })
      .then((res) => setItems(res.data.items))
      .catch(() => toast.error("Could not load menu"))
      .finally(() => setLoading(false));
  }, [category]);

  const handleAdd = (item) => {
    addItem(item, 1);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <>
      <div className="cat-rail">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-chip ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="section">
        <div className="container">
          {loading ? (
            <p style={{ opacity: 0.6 }}>Loading menu...</p>
          ) : items.length === 0 ? (
            <div className="empty-state">No dishes in this category yet.</div>
          ) : (
            <div className="menu-grid">
              {items.map((item) => (
                <div key={item._id} className={`dish-card ${!item.isAvailable ? "dish-unavailable" : ""}`}>
                  <div className="dish-top">
                    <h3 className="dish-name">{item.name}</h3>
                    <span className="dish-price">₦{item.price.toLocaleString()}</span>
                  </div>
                  <p className="dish-desc">{item.description}</p>
                  <div className="dish-tags">
                    {item.isSpicy && <span className="tag tag-spicy">Spicy</span>}
                    {item.tags?.includes("popular") && <span className="tag tag-popular">Popular</span>}
                  </div>
                  <div className="qty-row">
                    {item.isAvailable ? (
                      <button className="btn btn-primary btn-block" onClick={() => handleAdd(item)}>
                        Add to Cart
                      </button>
                    ) : (
                      <span className="badge-soldout">Sold out</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
