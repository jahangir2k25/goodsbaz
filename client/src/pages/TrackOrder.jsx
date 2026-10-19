import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import OrderTimeline from '../components/OrderTimeline';
import { money, dateTime, STATUS_COLORS } from '../utils/format';

export default function TrackOrder() {
  const [form, setForm] = useState({ orderNumber: '', phone: '' });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    try {
      const { data } = await api.post('/orders/track', form);
      setOrder(data);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x max-w-2xl py-10">
      <h1 className="text-2xl font-bold">Track Your Order</h1>
      <p className="mb-5 text-sm text-gray-500">Enter your order number and the phone number used for the order.</p>

      <form onSubmit={submit} className="card grid gap-3 p-5 sm:grid-cols-3">
        <input required value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} placeholder="Order no. (ELG…)" className="input" />
        <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className="input" />
        <button disabled={loading} className="btn-primary">{loading ? 'Searching…' : 'Track'}</button>
      </form>

      {order && (
        <div className="card mt-6 p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-bold text-brand">{order.orderNumber}</p>
              <p className="text-xs text-gray-500">{dateTime(order.createdAt)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
          </div>
          <OrderTimeline status={order.status} />
          <ul className="mt-6 divide-y text-sm">
            {order.items.map((i) => (
              <li key={i.product} className="flex justify-between py-2"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t pt-3 font-bold"><span>Total</span><span className="text-brand">{money(order.total)}</span></p>
        </div>
      )}
    </div>
  );
}
