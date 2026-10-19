import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import OrderTimeline from '../components/OrderTimeline';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { money, dateTime, STATUS_COLORS } from '../utils/format';

export default function Account() {
  const { user, updateProfile, logout } = useAuth();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState(null);
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', address: user.address || '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data)).catch(() => setOrders([]));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await updateProfile(payload);
      setForm((f) => ({ ...f, password: '' }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-x py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Account</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button onClick={logout} className="btn-outline !py-2 text-xs">Logout</button>
      </div>

      <div className="mb-5 flex gap-6 border-b">
        {[['orders', 'My Orders'], ['profile', 'Profile']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`-mb-px border-b-2 pb-2 text-sm font-semibold ${tab === k ? 'border-brand text-brand' : 'border-transparent text-gray-500'}`}>{l}</button>
        ))}
      </div>

      {tab === 'orders' ? (
        orders === null ? <Loader className="py-12" /> : orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-5xl">📦</p>
            <p className="mt-2 font-semibold">No orders yet</p>
            <Link to="/shop" className="btn-primary mt-4">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="card p-4">
                <button onClick={() => setOpen(open === o._id ? null : o._id)} className="flex w-full flex-wrap items-center justify-between gap-2 text-left">
                  <div>
                    <p className="font-bold text-brand">{o.orderNumber}</p>
                    <p className="text-xs text-gray-500">{dateTime(o.createdAt)} · {o.items.length} item(s)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{money(o.total)}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  </div>
                </button>
                {open === o._id && (
                  <div className="mt-4 border-t pt-4">
                    <OrderTimeline status={o.status} />
                    <ul className="mt-5 divide-y text-sm">
                      {o.items.map((i) => (
                        <li key={i.product} className="flex justify-between py-2"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></li>
                      ))}
                    </ul>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="flex justify-between text-gray-500"><span>Delivery</span><span>{o.shippingFee ? money(o.shippingFee) : 'FREE'}</span></p>
                      {o.discount > 0 && <p className="flex justify-between text-green-600"><span>Discount</span><span>-{money(o.discount)}</span></p>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <form onSubmit={save} className="card max-w-lg space-y-4 p-5">
          <div><label className="label">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" required /></div>
          <div><label className="label">Mobile</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></div>
          <div><label className="label">Default address</label><textarea rows="2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" /></div>
          <div><label className="label">New password (leave blank to keep)</label><input type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" /></div>
          <button disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
      )}
    </div>
  );
}
