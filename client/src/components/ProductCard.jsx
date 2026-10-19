import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import ProductImage from './ProductImage';
import Stars from './Stars';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { money } from '../utils/format';

export default function ProductCard({ p }) {
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const out = p.stock <= 0;
  const wished = has(p._id);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/product/${p.slug}`} className="block h-full w-full transition duration-500 group-hover:scale-105">
          <ProductImage src={p.images?.[0]} name={p.name} brand={p.brand?.name} />
        </Link>

        {p.discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
            -{p.discountPercent}%
          </span>
        )}
        {p.isNewArrival && p.discountPercent === 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>
        )}

        <button
          onClick={() => toggle(p)}
          aria-label="Toggle wishlist"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand shadow transition hover:scale-110"
        >
          {wished ? <FaHeart size={14} /> : <FiHeart size={15} />}
        </button>

        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">Out of stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <Link to={`/shop?brand=${p.brand?.slug || ''}`} className="text-[11px] font-semibold uppercase tracking-wide text-brand-400 hover:text-brand">
          {p.brand?.name}
        </Link>
        <Link to={`/product/${p.slug}`} className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-5 text-gray-800 hover:text-brand">
          {p.name}
        </Link>
        <div className="mt-1 flex items-center gap-1.5">
          <Stars rating={p.rating} />
          <span className="text-[10px] text-gray-400">({p.numReviews})</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-bold text-brand">{money(p.finalPrice)}</span>
          {p.discountPercent > 0 && <span className="text-xs text-gray-400 line-through">{money(p.price)}</span>}
        </div>
        <button
          onClick={() => addToCart(p)}
          disabled={out}
          className="btn-outline mt-3 w-full !px-3 !py-2 text-xs"
        >
          <FiShoppingBag size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
