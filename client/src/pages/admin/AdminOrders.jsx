import { useEffect, useState, useCallback, Fragment } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../../api/axios';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import { money, dateTime, STATUS_COLORS, STATUSES } from '../../utils/format';

export default function AdminOrders() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);

  const load = useCallback(() => {
    api
      .get('/orders', { params: { page, status, q: query, limit: 15 } })
      .then((r) => setData(r.data))
      .catch((e) => toast.error(errMsg(e)));
  }, [page, status, query]);

  useEffect(load, [load]);

  const update = async (id, body) => {
    try {
      const { data: o } = await api.put(`/orders/${id}/status`, body);
      setData((d) => ({ ...d, orders: d.orders.map((x) => (x._id === id ? o : x)) }));
      toast.success('Order updated');
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Orders {data && <span className="text-sm font-normal text-gray-500">({data.total})</span>}</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); setQuery(q); }} className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order no, name or phone" className="input w-56" />
          <button className="btn-outline !py-2">Search</button>
        </form>
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="input !w-auto capitalize">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {!data ? <Loader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody className="divide-y">
              {data.orders.map((o) => (
                <Fragment key={o._id}>
                  <tr className="cursor-pointer hover:bg-gray-50" onClick={() => setOpen(open === o._id ? null : o._id)}>
                    <td className="p-3"><p className="font-semibold text-brand">{o.orderNumber}</p><p className="text-xs text-gray-500">{dateTime(o.createdAt)}</p></td>
                    <td className="p-3">{o.shipping.name}<br /><span className="text-xs text-gray-500">{o.shipping.phone}</span></td>
                    <td className="p-3 font-semibold">{money(o.total)}</td>
                    <td className="p-3"><span className="text-xs font-bold uppercase">{o.paymentMethod}</span><br /><span className={`text-xs ${o.isPaid ? 'text-green-600' : 'text-gray-400'}`}>{o.isPaid ? 'Paid' : 'Unpaid'}</span></td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select value={o.status} onChange={(e) => update(o._id, { status: e.target.value })} className={`rounded-full border-0 px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[o.status]}`}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                  {open === o._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase text-gray-500">Items</p>
                            <ul className="space-y-1 text-sm">
                              {o.items.map((i) => <li key={i.product} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></li>)}
                            </ul>
                            <div className="mt-2 space-y-0.5 border-t pt-2 text-sm">
                              <p className="flex justify-between"><span>Subtotal</span><span>{money(o.subtotal)}</span></p>
                              {o.discount > 0 && <p className="flex justify-between text-green-600"><span>Coupon {o.couponCode}</span><span>-{money(o.discount)}</span></p>}
                              <p className="flex justify-between"><span>Delivery</span><span>{money(o.shippingFee)}</span></p>
                              <p className="flex justify-between font-bold"><span>Total</span><span>{money(o.total)}</span></p>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="mb-1 text-xs font-bold uppercase text-gray-500">Shipping</p>
                            <p>{o.shipping.name} · {o.shipping.phone}</p>
                            {o.shipping.email && <p>{o.shipping.email}</p>}
                            <p>{o.shipping.address}{o.shipping.district ? `, ${o.shipping.district}` : ''}</p>
                            <p className="text-gray-500">{o.shipping.area === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
                            {o.shipping.note && <p className="mt-1 italic text-gray-500">Note: {o.shipping.note}</p>}
                            {o.paymentTrxId && <p className="mt-2">TrxID: <b>{o.paymentTrxId}</b></p>}
                            <button onClick={() => update(o._id, { isPaid: !o.isPaid })} className="btn-outline mt-3 !px-4 !py-1.5 text-xs">Mark as {o.isPaid ? 'unpaid' : 'paid'}</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {data.orders.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {data && <Pagination page={data.page} pages={data.pages} onChange={setPage} />}
    </div>
  );
}
