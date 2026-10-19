import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import api from '../api/axios';

export default function NavBar() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {});
  }, []);

  return (
    <nav className="bg-brand text-white">
      <ul className="container-x no-scrollbar flex items-center gap-1 overflow-x-auto py-1.5 lg:justify-center lg:overflow-visible">
        <li className="shrink-0 md:hidden">
          <NavLink to="/brands" className="block rounded px-3 py-1.5 text-xs font-medium hover:bg-white/15">
            Brands
          </NavLink>
        </li>

        {cats.map((c) => (
          <li key={c._id} className="group relative shrink-0">
            <Link
              to={`/shop?category=${c.slug}`}
              className="block whitespace-nowrap rounded px-3 py-1.5 text-xs font-medium transition hover:bg-white/15"
            >
              {c.name}
            </Link>

            {c.subCategories?.length > 0 && (
              <div className="invisible absolute left-0 top-full z-50 hidden min-w-[190px] translate-y-1 rounded-b-xl border-t-2 border-amber-400 bg-white py-2 text-gray-700 opacity-0 shadow-xl transition lg:block lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                {c.subCategories.map((s) => (
                  <Link
                    key={s}
                    to={`/shop?category=${c.slug}&sub=${encodeURIComponent(s)}`}
                    className="block px-4 py-1.5 text-xs hover:bg-brand-50 hover:text-brand"
                  >
                    {s}
                  </Link>
                ))}
                <Link to={`/shop?category=${c.slug}`} className="mt-1 block border-t px-4 pt-2 text-xs font-semibold text-brand">
                  View all {c.name} →
                </Link>
              </div>
            )}
          </li>
        ))}

        <li className="shrink-0">
          <Link
            to="/shop?offers=true"
            className="ml-1 block whitespace-nowrap rounded bg-amber-400 px-3 py-1.5 text-xs font-semibold text-gray-900 transition hover:bg-amber-300"
          >
            Offers
          </Link>
        </li>
      </ul>
    </nav>
  );
}
