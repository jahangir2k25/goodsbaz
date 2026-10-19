import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem('elegance_cart')) || [];
  } catch (e) {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    localStorage.setItem('elegance_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (p, qty = 1, { silent = false } = {}) => {
    if (p.stock <= 0) return toast.error('This product is out of stock');
    setItems((prev) => {
      const found = prev.find((i) => i.product === p._id);
      const nextQty = Math.min((found?.qty || 0) + qty, p.stock);
      if (found && found.qty + qty > p.stock) toast.error(`Only ${p.stock} in stock`);
      const entry = {
        product: p._id,
        slug: p.slug,
        name: p.name,
        brand: p.brand?.name || '',
        image: p.images?.[0] || '',
        price: p.finalPrice,
        mrp: p.price,
        stock: p.stock,
        qty: nextQty,
      };
      return found ? prev.map((i) => (i.product === p._id ? entry : i)) : [...prev, entry];
    });
    if (!silent) toast.success('Added to cart');
  };

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.product === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
    );

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.product !== id));
  const clearCart = () => setItems([]);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((a, i) => a + i.qty, 0),
      subtotal: items.reduce((a, i) => a + i.qty * i.price, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, count, subtotal, addToCart, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
