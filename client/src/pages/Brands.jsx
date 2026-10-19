import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function Brands() {
  const [brands, setBrands] = useState(null);
  useEffect(() => {
    api.get('/brands').then((r) => setBrands(r.data)).catch(() => setBrands([]));
  }, []);

  if (!brands) return <Loader />;

  // group A-Z
  const groups = brands.reduce((acc, b) => {
    const k = b.name[0].toUpperCase();
    (acc[k] = acc[k] || []).push(b);
    return acc;
  }, {});

  return (
    <div className="container-x py-8">
      <h1 className="mb-6 text-2xl font-bold">All Brands</h1>
      <div className="space-y-6">
        {Object.keys(groups).sort().map((k) => (
          <div key={k}>
            <h2 className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{k}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {groups[k].map((b) => (
                <Link key={b._id} to={`/shop?brand=${b.slug}`} className="rounded-xl border p-4 text-center text-sm font-semibold transition hover:border-brand hover:text-brand hover:shadow">
                  {b.logo ? <img src={b.logo} alt={b.name} className="mx-auto h-10 object-contain" /> : b.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
