import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import ProductImage from '../components/ProductImage';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { money } from '../utils/format';
import { site } from '../config/site';

const PHONE_RX = /^(?:\+?88)?01[3-9]\d{8}$/;

const PAYMENTS = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order', color: 'border-emerald-500' },
  { id: 'bkash', label: 'bKash', desc: 'Send money, then enter the TrxID', color: 'border-pink-500' },
  { id: 'nagad', label: 'Nagad', desc: 'Send money, then enter the TrxID', color: 'border-orange-500' },
];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    area: 'inside_dhaka',
    district: '',
    note: '',
  });
  const [payment, setPayment] = useState('cod');
  const [trxId, setTrxId] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null); // { code, discount }
  const [applying, setApplying] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!items.length) navigate('/cart', { replace: true });
  }, [items.length, navigate]);

  // coupon discount depends on subtotal: re-validate when cart changes
  useEffect(() => {
    if (!coupon) return;
    api
      .post('/coupons/validate', { code: coupon.code, subtotal })
      .then((r) => setCoupon(r.data))
      .catch((e) => {
        setCoupon(null);
        toast.error(errMsg(e));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const discount = coupon?.discount || 0;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= site.freeShippingMin ? 0 : form.area === 'inside_dhaka' ? site.shippingInside : site.shippingOutside;
  const total = afterDiscount + shipping;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponInput, subtotal });
      setCoupon(data);
      toast.success(`Coupon applied: -${money(data.discount)}`);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setApplying(false);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!PHONE_RX.test(form.phone.replace(/\s|-/g, ''))) return toast.error('Enter a valid mobile number (01XXXXXXXXX)');
    if (form.area === 'outside_dhaka' && !form.district.trim()) return toast.error('Please enter your district');
    if (payment !== 'cod' && !trxId.trim()) return toast.error('Please enter your transaction ID');

    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, qty: i.qty })),
        shipping: form,
        paymentMethod: payment,
        paymentTrxId: trxId,
        couponCode: coupon?.code || '',
      });
      clearCart();
      navigate('/order-success', { state: { order: data }, replace: true });
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-x py-6">
      <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
      {!user && (
        <p className="mb-4 rounded-lg bg-brand-50 px-4 py-2.5 text-sm">
          Have an account? <Link to="/login?redirect=/checkout" className="font-semibold text-brand">Log in</Link> for faster checkout — or continue as guest below.
        </p>
      )}

      <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* delivery */}
          <section className="card p-5">
            <h2 className="mb-4 font-bold">Delivery Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Full name *</label><input required value={form.name} onChange={set('name')} className="input" placeholder="Your name" /></div>
              <div><label className="label">Mobile number *</label><input required value={form.phone} onChange={set('phone')} className="input" placeholder="01XXXXXXXXX" inputMode="tel" /></div>
              <div className="sm:col-span-2"><label className="label">Email (optional)</label><input type="email" value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" /></div>

              <div className="sm:col-span-2">
                <label className="label">Delivery area *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[['inside_dhaka', 'Inside Dhaka', site.shippingInside], ['outside_dhaka', 'Outside Dhaka', site.shippingOutside]].map(([v, l, fee]) => (
                    <label key={v} className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-3 py-2.5 text-sm ${form.area === v ? 'border-brand bg-brand-50' : 'border-gray-200'}`}>
                      <span className="flex items-center gap-2"><input type="radio" name="area" checked={form.area === v} onChange={() => setForm({ ...form, area: v })} className="accent-brand" />{l}</span>
                      <span className="text-xs font-semibold text-gray-500">৳{fee}</span>
                    </label>
                  ))}
                </div>
              </div>

              {form.area === 'outside_dhaka' && (
                <div className="sm:col-span-2"><label className="label">District *</label><input value={form.district} onChange={set('district')} className="input" placeholder="e.g. Chattogram" /></div>
              )}
              <div className="sm:col-span-2"><label className="label">Full address *</label><textarea required rows="2" value={form.address} onChange={set('address')} className="input" placeholder="House, road, area" /></div>
              <div className="sm:col-span-2"><label className="label">Order note (optional)</label><input value={form.note} onChange={set('note')} className="input" placeholder="Any special instruction" /></div>
            </div>
          </section>

          {/* payment */}
          <section className="card p-5">
            <h2 className="mb-4 font-bold">Payment Method</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENTS.map((p) => (
                <label key={p.id} className={`cursor-pointer rounded-lg border-2 p-3 text-sm transition ${payment === p.id ? `${p.color} bg-gray-50` : 'border-gray-200'}`}>
                  <span className="flex items-center gap-2 font-semibold"><input type="radio" name="pay" checked={payment === p.id} onChange={() => setPayment(p.id)} className="accent-brand" />{p.label}</span>
                  <span className="mt-1 block text-[11px] text-gray-500">{p.desc}</span>
                </label>
              ))}
            </div>
            {payment !== 'cod' && (
              <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm">
                <p>
                  Send <b>{money(total)}</b> to our {payment === 'bkash' ? 'bKash' : 'Nagad'} personal number <b>{site.phoneLabel}</b>, then paste the transaction ID below.
                </p>
                <input value={trxId} onChange={(e) => setTrxId(e.target.value)} className="input mt-3" placeholder="Transaction ID (e.g. 9H7A5K2L1M)" />
              </div>
            )}
          </section>
        </div>

        {/* summary */}
        <aside className="card h-fit p-5 lg:sticky lg:top-40">
          <h2 className="mb-4 text-lg font-bold">Your Order</h2>
          <ul className="max-h-60 space-y-3 overflow-y-auto pr-1">
            {items.map((i) => (
              <li key={i.product} className="flex items-center gap-3 text-sm">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                  <ProductImage src={i.image} name={i.name} brand={i.brand} />
                  <span className="absolute right-0 top-0 rounded-bl bg-gray-800 px-1 text-[10px] text-white">{i.qty}</span>
                </div>
                <span className="line-clamp-2 flex-1 text-xs">{i.name}</span>
                <span className="font-semibold">{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder="Coupon code" className="input !py-2" disabled={!!coupon} />
            {coupon ? (
              <button type="button" onClick={() => { setCoupon(null); setCouponInput(''); }} className="rounded-lg border px-3 text-xs font-semibold text-red-600">Remove</button>
            ) : (
              <button type="button" onClick={applyCoupon} disabled={applying} className="btn-primary !rounded-lg !px-4 !py-2 text-xs">{applying ? '…' : 'Apply'}</button>
            )}
          </div>
          <p className="mt-1 text-[11px] text-gray-400">Try WELCOME10 or ELEGANCE100</p>

          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Coupon ({coupon.code})</span><span>-{money(discount)}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>{shipping === 0 ? 'FREE' : money(shipping)}</span></div>
            <div className="flex justify-between border-t pt-3 text-lg font-extrabold"><span>Total</span><span className="text-brand">{money(total)}</span></div>
          </div>

          <button disabled={placing} className="btn-primary mt-5 w-full">{placing ? 'Placing order…' : `Place Order · ${money(total)}`}</button>
          <p className="mt-2 text-center text-[11px] text-gray-400">Final prices are verified by our server.</p>
        </aside>
      </form>
    </div>
  );
}
