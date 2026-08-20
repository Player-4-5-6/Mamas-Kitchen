import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("mk_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("mk_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem, quantity = 1, specialInstructions = "") => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.menuItem === menuItem._id && i.specialInstructions === specialInstructions
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          specialInstructions,
        },
      ];
    });
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i, idx) => (idx === index ? { ...i, quantity } : i)));
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
