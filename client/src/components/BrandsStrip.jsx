import { Link } from 'react-router-dom';

export default function BrandsStrip({ brands = [] }) {
  const list = brands.filter((b) => b.featured);
  if (!list.length) return null;
  return (
    <section className="bg-brand-50 py-6 md:py-8">
      <div className="container-x">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="section-title">Top Brands</h2>
            <span className="mt-1 block h-1 w-12 rounded-full bg-brand" />
          </div>
          <Link to="/brands" className="text-sm font-semibold text-brand hover:underline">All brands →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {list.map((b) => (
            <Link
              key={b._id}
              to={`/shop?brand=${b.slug}`}
              className="flex h-20 items-center justify-center rounded-xl border border-brand-100 bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
            >
              {b.logo ? <img src={b.logo} alt={b.name} className="max-h-full max-w-full object-contain" /> : <span className="text-sm font-bold text-gray-700">{b.name}</span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
