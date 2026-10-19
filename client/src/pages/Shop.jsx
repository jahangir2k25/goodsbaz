import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const SORTS = [
  ['newest', 'Newest'],
  ['popular', 'Best selling'],
  ['discount', 'Biggest discount'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['rating', 'Top rated'],
];

export default function Shop() {
  const [sp, setSp] = useSearchParams();
  const [cats, setCats] = useState([]);
  const [brands, setBrands] = useState([]);
  const [data, setData] = useState({ products: [], total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [price, setPrice] = useState({ min: sp.get('minPrice') || '', max: sp.get('maxPrice') || '' });

  const get = (k) => sp.get(k) || '';
  const category = get('category');
  const sub = get('sub');
  const selectedBrands = get('brand') ? get('brand').split(',') : [];

  const update = (obj, keepPage = false) => {
    const n = new URLSearchParams(sp);
    Object.entries(obj).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k)));
    if (!keepPage) n.delete('page');
    setSp(n);
  };

  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {});
    api.get('/brands').then((r) => setBrands(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setPrice({ min: get('minPrice'), max: get('maxPrice') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.get('minPrice'), sp.get('maxPrice')]);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: { ...Object.fromEntries(sp), limit: 12 } })
      .then((r) => setData(r.data))
      .catch(() => setData({ products: [], total: 0, pages: 1, page: 1 }))
      .finally(() => setLoading(false));
  }, [sp]);

  const toggleBrand = (slug) => {
    const next = selectedBrands.includes(slug) ? selectedBrands.filter((b) => b !== slug) : [...selectedBrands, slug];
    update({ brand: next.join(',') });
  };

  const activeCat = cats.find((c) => c.slug === category);
  const title = get('keyword')
    ? `Results for "${get('keyword')}"`
    : get('offers') === 'true'
    ? 'Offers & Discounts'
    : get('newArrival') === 'true'
    ? 'New Arrivals'
    : sub || activeCat?.name || 'All Products';

  const hasFilters = [...sp.keys()].some((k) => k !== 'sort' && k !== 'page');

  const Filters = (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="mb-2 font-bold text-gray-900">Categories</h3>
        <ul className="space-y-1">
          <li>
            <button onClick={() => update({ category: '', sub: '' })} className={`w-full text-left hover:text-brand ${!category ? 'font-semibold text-brand' : ''}`}>
              All products
            </button>
          </li>
          {cats.map((c) => (
            <li key={c._id}>
              <button onClick={() => update({ category: c.slug, sub: '' })} className={`w-full text-left hover:text-brand ${category === c.slug ? 'font-semibold text-brand' : ''}`}>
                {c.name}
              </button>
              {category === c.slug && c.subCategories?.length > 0 && (
                <ul className="mb-1 ml-3 mt-1 space-y-1 border-l pl-3 text-[13px] text-gray-600">
                  {c.subCategories.map((s) => (
                    <li key={s}>
                      <button onClick={() => update({ sub: sub === s ? '' : s })} className={`hover:text-brand ${sub === s ? 'font-semibold text-brand' : ''}`}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 font-bold text-gray-900">Price (৳)</h3>
        <div className="flex items-center gap-2">
          <input type="number" min="0" placeholder="Min" value={price.min} onChange={(e) => setPrice({ ...price, min: e.target.value })} className="input !py-1.5" />
          <span>–</span>
          <input type="number" min="0" placeholder="Max" value={price.max} onChange={(e) => setPrice({ ...price, max: e.target.value })} className="input !py-1.5" />
        </div>
        <button onClick={() => update({ minPrice: price.min, maxPrice: price.max })} className="btn-primary mt-2 w-full !py-1.5 text-xs">Apply</button>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[[0, 500], [500, 1000], [1000, 2000], [2000, '']].map(([a, b]) => (
            <button key={`${a}-${b}`} onClick={() => update({ minPrice: a || '', maxPrice: b })} className="rounded-full border px-2.5 py-1 text-[11px] hover:border-brand hover:text-brand">
              {b === '' ? `৳${a}+` : `৳${a}–${b}`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-bold text-gray-900">Availability & Offers</h3>
        <label className="flex cursor-pointer items-center gap-2 py-0.5">
          <input type="checkbox" checked={get('offers') === 'true'} onChange={(e) => update({ offers: e.target.checked ? 'true' : '' })} className="accent-brand" />
          On sale only
        </label>
        <label className="flex cursor-pointer items-center gap-2 py-0.5">
          <input type="checkbox" checked={get('inStock') === 'true'} onChange={(e) => update({ inStock: e.target.checked ? 'true' : '' })} className="accent-brand" />
          In stock only
        </label>
      </div>

      <div>
        <h3 className="mb-2 font-bold text-gray-900">Brands</h3>
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label key={b._id} className="flex cursor-pointer items-center gap-2 py-0.5">
              <input type="checkbox" checked={selectedBrands.includes(b.slug)} onChange={() => toggleBrand(b.slug)} className="accent-brand" />
              {b.name}
            </label>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={() => setSp({})} className="w-full rounded-full border border-red-300 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-x py-5">
      <nav className="mb-3 text-xs text-gray-500">
        <Link to="/" className="hover:text-brand">Home</Link> / <span className="text-gray-800">Shop</span>
        {activeCat && <> / <span className="text-gray-800">{activeCat.name}</span></>}
      </nav>

      <div className="flex gap-6">
        <aside className="hidden w-60 shrink-0 lg:block">{Filters}</aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
              <p className="text-xs text-gray-500">{data.total} product{data.total === 1 ? '' : 's'} found</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(true)} className="btn-outline !px-4 !py-2 text-xs lg:hidden">
                <FiFilter /> Filters
              </button>
              <select value={get('sort') || 'newest'} onChange={(e) => update({ sort: e.target.value })} className="input !w-auto !py-2 text-xs">
                {SORTS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <Loader className="py-20" />
          ) : data.products.length === 0 ? (
            <div className="rounded-xl border border-dashed py-20 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-2 font-semibold">No products found</p>
              <p className="text-sm text-gray-500">Try changing or clearing your filters.</p>
              <button onClick={() => setSp({})} className="btn-primary mt-4">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {data.products.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}

          <Pagination page={data.page} pages={data.pages} onChange={(n) => update({ page: String(n) }, true)} />
        </div>
      </div>

      {/* mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Close"><FiX size={22} /></button>
            </div>
            {Filters}
            <button onClick={() => setShowFilters(false)} className="btn-primary mt-6 w-full">Show {data.total} results</button>
          </div>
        </div>
      )}
    </div>
  );
}
