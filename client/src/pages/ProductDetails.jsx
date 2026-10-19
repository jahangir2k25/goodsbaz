import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHeart, FiMinus, FiPlus, FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import api, { errMsg } from '../api/axios';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import Stars from '../components/Stars';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { money, dateTime } from '../utils/format';
import { site } from '../config/site';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const { user } = useAuth();

  const [state, setState] = useState({ product: null, related: [] });
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [posting, setPosting] = useState(false);

  const load = () =>
    api
      .get(`/products/${slug}`)
      .then((r) => setState(r.data))
      .catch(() => setState({ product: null, related: [] }))
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    setImg(0);
    setQty(1);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <Loader />;
  const { product: p, related } = state;
  if (!p)
    return (
      <div className="container-x py-24 text-center">
        <p className="text-5xl">😕</p>
        <p className="mt-3 font-semibold">Product not found</p>
        <Link to="/shop" className="btn-primary mt-4">Back to shop</Link>
      </div>
    );

  const out = p.stock <= 0;
  const images = p.images?.length ? p.images : [''];

  const submitReview = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.post(`/products/${p._id}/reviews`, review);
      toast.success('Thanks for your review!');
      setReview({ rating: 5, comment: '' });
      load();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="container-x py-5">
      <nav className="mb-4 text-xs text-gray-500">
        <Link to="/" className="hover:text-brand">Home</Link> /{' '}
        <Link to={`/shop?category=${p.category?.slug}`} className="hover:text-brand">{p.category?.name}</Link> /{' '}
        <span className="text-gray-800">{p.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-gray-50">
            <ProductImage src={images[img]} name={p.name} brand={p.brand?.name} />
            {p.discountPercent > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">-{p.discountPercent}% OFF</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button key={i} onClick={() => setImg(i)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${i === img ? 'border-brand' : 'border-transparent'}`}>
                  <ProductImage src={src} name={p.name} brand={p.brand?.name} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div>
          <Link to={`/shop?brand=${p.brand?.slug}`} className="text-xs font-bold uppercase tracking-wide text-brand-400 hover:text-brand">
            {p.brand?.name}
          </Link>
          <h1 className="mt-1 text-xl font-bold leading-snug md:text-2xl">{p.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <Stars rating={p.rating} size={14} />
            <span className="text-gray-500">{p.rating?.toFixed(1)} ({p.numReviews} reviews)</span>
            {p.sku && <span className="text-xs text-gray-400">· SKU: {p.sku}</span>}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-brand">{money(p.finalPrice)}</span>
            {p.discountPercent > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{money(p.price)}</span>
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Save {money(p.price - p.finalPrice)}</span>
              </>
            )}
          </div>

          <dl className="mt-4 space-y-1 text-sm">
            {p.size && <div className="flex gap-2"><dt className="w-20 text-gray-500">Size</dt><dd className="font-medium">{p.size}</dd></div>}
            {p.subCategory && <div className="flex gap-2"><dt className="w-20 text-gray-500">Type</dt><dd className="font-medium">{p.subCategory}</dd></div>}
            <div className="flex gap-2">
              <dt className="w-20 text-gray-500">Availability</dt>
              <dd className={`font-semibold ${out ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                {out ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left!` : 'In stock'}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:text-brand" aria-label="Decrease"><FiMinus size={14} /></button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(p.stock || 1, q + 1))} className="p-3 hover:text-brand" aria-label="Increase"><FiPlus size={14} /></button>
            </div>
            <button disabled={out} onClick={() => addToCart(p, qty)} className="btn-outline flex-1 sm:flex-none">
              <FiShoppingBag /> Add to Cart
            </button>
            <button
              disabled={out}
              onClick={() => {
                addToCart(p, qty, { silent: true });
                navigate('/checkout');
              }}
              className="btn-primary flex-1 sm:flex-none"
            >
              Buy Now
            </button>
            <button onClick={() => toggle(p)} aria-label="Wishlist" className={`flex h-11 w-11 items-center justify-center rounded-full border transition hover:border-brand ${has(p._id) ? 'bg-brand text-white' : 'text-brand'}`}>
              <FiHeart />
            </button>
          </div>

          <ul className="mt-6 space-y-2 rounded-xl bg-brand-50 p-4 text-sm">
            <li className="flex items-center gap-2"><FiShield className="text-brand" /> 100% authentic product guarantee</li>
            <li className="flex items-center gap-2"><FiTruck className="text-brand" /> Delivery ৳{site.shippingInside} inside Dhaka / ৳{site.shippingOutside} outside · free over ৳{site.freeShippingMin}</li>
            <li className="flex items-center gap-2"><FiRefreshCw className="text-brand" /> Easy returns for damaged or wrong items</li>
          </ul>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-10">
        <div className="flex gap-6 border-b">
          {[['description', 'Description'], ['reviews', `Reviews (${p.numReviews})`]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`-mb-px border-b-2 pb-2 text-sm font-semibold ${tab === k ? 'border-brand text-brand' : 'border-transparent text-gray-500'}`}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'description' ? (
          <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-gray-700">{p.description || 'No description yet.'}</p>
        ) : (
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              {p.reviews?.length === 0 && <p className="text-sm text-gray-500">No written reviews yet. Be the first!</p>}
              {p.reviews?.map((r) => (
                <div key={r._id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{r.name}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{r.comment}</p>
                  <p className="mt-1 text-[11px] text-gray-400">{dateTime(r.createdAt)}</p>
                </div>
              ))}
            </div>
            <div>
              {user ? (
                <form onSubmit={submitReview} className="space-y-3 rounded-xl border p-4">
                  <h3 className="font-semibold">Write a review</h3>
                  <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })} className="input">
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                  </select>
                  <textarea rows="3" required value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Share your experience" className="input" />
                  <button disabled={posting} className="btn-primary">{posting ? 'Posting…' : 'Submit review'}</button>
                </form>
              ) : (
                <p className="rounded-xl border p-4 text-sm">
                  Please <Link to={`/login?redirect=/product/${p.slug}`} className="font-semibold text-brand">log in</Link> to write a review.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="section-title mb-4">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {related.slice(0, 5).map((r) => <ProductCard key={r._id} p={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
