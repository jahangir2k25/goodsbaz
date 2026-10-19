import { Link } from 'react-router-dom';
import { CATEGORY_ICONS } from '../utils/format';

export default function CategoryGrid({ categories = [] }) {
  if (!categories.length) return null;
  return (
    <section className="py-6 md:py-8">
      <div className="container-x">
        <h2 className="section-title mb-1">Shop by Category</h2>
        <span className="mb-5 block h-1 w-12 rounded-full bg-brand" />
        <div className="grid grid-cols-4 gap-3 md:grid-cols-8 md:gap-4">
          {categories.map((c) => (
            <Link key={c._id} to={`/shop?category=${c.slug}`} className="group flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-50 to-brand-200 text-3xl shadow-sm ring-2 ring-transparent transition group-hover:scale-105 group-hover:ring-brand md:h-20 md:w-20 md:text-4xl">
                {c.image ? <img src={c.image} alt={c.name} className="h-full w-full object-cover" /> : c.icon || CATEGORY_ICONS[c.slug] || '🛍️'}
              </span>
              <span className="mt-2 text-[11px] font-semibold leading-tight text-gray-700 group-hover:text-brand md:text-xs">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
