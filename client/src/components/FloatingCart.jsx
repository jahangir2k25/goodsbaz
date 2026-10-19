import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function FloatingCart() {
  const { count, subtotal } = useCart();
  const { pathname } = useLocation();
  if (pathname.startsWith('/cart') || pathname.startsWith('/checkout')) return null;

  return (
    <Link
      to="/cart"
      aria-label="Open cart"
      className="fixed right-2 top-[42%] z-40 flex flex-col items-center gap-1 md:right-4"
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-brand-800 text-white shadow-lg ring-2 ring-white transition hover:scale-110">
        <FiShoppingBag size={19} />
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-brand shadow">
          {count}
        </span>
      </span>
      <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white shadow">
        ৳{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </span>
    </Link>
  );
}
