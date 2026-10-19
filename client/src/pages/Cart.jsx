import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import ProductImage from '../components/ProductImage';
import { useCart } from '../context/CartContext';
import { money } from '../utils/format';
import { site } from '../config/site';

export default function Cart() {
  const { items, subtotal, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (!items.length)
    return (
      <div className="container-x py-24 text-center">
        <p className="text-6xl">🛍️</p>
        <h1 className="mt-4 text-xl font-bold">Your cart is empty</h1>
        <p className="mt-1 text-sm text-gray-500">Looks like you have not added anything yet.</p>
        <Link to="/shop" className="btn-primary mt-6">Start shopping</Link>
      </div>
    );

  const remaining = Math.max(0, site.freeShippingMin - subtotal);

  return (
    <div className="container-x py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-600 hover:underline">Clear cart</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((i) => (
            <div key={i.product} className="card flex gap-3 p-3 sm:gap-4 sm:p-4">
              <Link to={`/product/${i.slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
                <ProductImage src={i.image} name={i.name} brand={i.brand} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-[11px] font-semibold uppercase text-brand-400">{i.brand}</p>
                <Link to={`/product/${i.slug}`} className="line-clamp-2 text-sm font-medium hover:text-brand">{i.name}</Link>
                <p className="mt-1 text-sm font-bold text-brand">
                  {money(i.price)} {i.mrp > i.price && <span className="ml-1 text-xs font-normal text-gray-400 line-through">{money(i.mrp)}</span>}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border">
                    <button onClick={() => updateQty(i.product, i.qty - 1)} className="p-2 hover:text-brand" aria-label="Decrease"><FiMinus size={13} /></button>
                    <span className="w-7 text-center text-sm font-semibold">{i.qty}</span>
                    <button onClick={() => updateQty(i.product, i.qty + 1)} className="p-2 hover:text-brand" aria-label="Increase"><FiPlus size={13} /></button>
                  </div>
                  <span className="text-sm font-bold">{money(i.price * i.qty)}</span>
                  <button onClick={() => removeItem(i.product)} className="p-2 text-gray-400 hover:text-red-600" aria-label="Remove"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card h-fit p-5 lg:sticky lg:top-40">
          <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>Calculated at checkout</span></div>
          </div>
          {remaining > 0 ? (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              Add <b>{money(remaining)}</b> more to get <b>free delivery</b>!
            </p>
          ) : (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-700">🎉 You qualify for free delivery!</p>
          )}
          <button onClick={() => navigate('/checkout')} className="btn-primary mt-5 w-full">Proceed to Checkout</button>
          <Link to="/shop" className="mt-3 block text-center text-sm text-brand hover:underline">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
