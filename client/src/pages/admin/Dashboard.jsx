import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { money, dateTime, STATUS_COLORS, STATUSES } from '../../utils/format';

export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => {
    api.get('/admin/stats').then((r) => setS(r.data)).catch(() => setS({ error: true }));
  }, []);

  if (!s) return <Loader />;
  if (s.error) return <p className="text-red-600">Could not load stats.</p>;

  const cards = [
    ['Revenue', money(s.revenue), 'from-pink-500 to-brand-800'],
    ['Orders', s.orders, 'from-blue-500 to-indigo-700'],
    ['Products', s.products, 'from-emerald-500 to-teal-700'],
    ['Customers', s.users, 'from-amber-500 to-orange-600'],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(([l, v, g]) => (
          <div key={l} className={`rounded-xl bg-gradient-to-br ${g} p-4 text-white shadow`}>
            <p className="text-xs uppercase tracking-wide opacity-80">{l}</p>
            <p className="mt-1 text-2xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <h2 className="mb-3 font-bold">Orders by status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((st) => (
            <span key={st} className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[st]}`}>{st}: {s.byStatus[st] || 0}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Recent orders</h2><Link to="/admin/orders" className="text-xs text-brand">View all</Link></div>
          <ul className="divide-y text-sm">
            {s.recentOrders.length === 0 && <li className="py-3 text-gray-500">No orders yet.</li>}
            {s.recentOrders.map((o) => (
              <li key={o._id} className="flex items-center justify-between py-2">
                <div><p className="font-semibold text-brand">{o.orderNumber}</p><p className="text-xs text-gray-500">{o.shipping.name} · {dateTime(o.createdAt)}</p></div>
                <div className="text-right"><p className="font-bold">{money(o.total)}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <h2 className="mb-3 font-bold">Low stock</h2>
          <ul className="divide-y text-sm">
            {s.lowStock.length === 0 && <li className="py-3 text-gray-500">All products are well stocked.</li>}
            {s.lowStock.map((p) => (
              <li key={p._id} className="flex items-center justify-between py-2">
                <Link to={`/admin/products/${p._id}`} className="line-clamp-1 hover:text-brand">{p.name}</Link>
                <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
