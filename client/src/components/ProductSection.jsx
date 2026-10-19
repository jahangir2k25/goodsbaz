import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function ProductSection({ title, subtitle, products = [], to, bg = '' }) {
  if (!products.length) return null;
  return (
    <section className={`py-6 md:py-8 ${bg}`}>
      <div className="container-x">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 md:text-sm">{subtitle}</p>}
            <span className="mt-1 block h-1 w-12 rounded-full bg-brand" />
          </div>
          {to && (
            <Link to={to} className="text-sm font-semibold text-brand hover:underline">
              View all →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
