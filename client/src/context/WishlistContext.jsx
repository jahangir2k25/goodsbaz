import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem('elegance_wishlist')) || [];
  } catch (e) {
    return [];
  }
};

export function WishlistProvider({ children }) {
  const [list, setList] = useState(load);

  useEffect(() => {
    localStorage.setItem('elegance_wishlist', JSON.stringify(list));
  }, [list]);

  const has = (id) => list.some((p) => p._id === id);

  const toggle = (p) => {
    if (has(p._id)) {
      setList((prev) => prev.filter((x) => x._id !== p._id));
      toast('Removed from wishlist');
    } else {
      setList((prev) => [...prev, p]);
      toast.success('Added to wishlist');
    }
  };

  return <WishlistContext.Provider value={{ list, has, toggle, count: list.length }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
