import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import api from '../api/axios';
import ProductImage from './ProductImage';
import { money } from '../utils/format';

export default function SearchBar({ className = '' }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const navigate = useNavigate();

  // debounce live suggestions
  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return undefined;
    }
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get('/products', { params: { keyword: q.trim(), limit: 6 } });
        setResults(data.products);
        setOpen(true);
      } catch (e) {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const close = (e) => wrap.current && !wrap.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    navigate(`/shop?keyword=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <form onSubmit={submit} className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search products"
          className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </form>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          {results.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p.slug}`}
              onClick={() => {
                setOpen(false);
                setQ('');
              }}
              className="flex items-center gap-3 px-3 py-2 hover:bg-brand-50"
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md">
                <ProductImage src={p.images?.[0]} name={p.name} brand={p.brand?.name} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{p.name}</p>
                <p className="text-[11px] text-gray-400">{p.brand?.name}</p>
              </div>
              <span className="text-xs font-bold text-brand">{money(p.finalPrice)}</span>
            </Link>
          ))}
          <button onClick={submit} className="w-full border-t bg-gray-50 py-2 text-center text-xs font-semibold text-brand hover:bg-brand-50">
            See all results for "{q}"
          </button>
        </div>
      )}
    </div>
  );
}
