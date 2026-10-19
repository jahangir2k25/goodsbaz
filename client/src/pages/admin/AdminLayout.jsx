import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingCart, FiImage, FiLayers, FiTag, FiPercent, FiMenu, FiX, FiExternalLink } from 'react-icons/fi';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

const links = [
  ['/admin', 'Dashboard', FiGrid, true],
  ['/admin/products', 'Products', FiBox],
  ['/admin/orders', 'Orders', FiShoppingCart],
  ['/admin/banners', 'Banners', FiImage],
  ['/admin/categories', 'Categories', FiLayers],
  ['/admin/brands', 'Brands', FiTag],
  ['/admin/coupons', 'Coupons', FiPercent],
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const Sidebar = (
    <div className="flex h-full flex-col bg-[#1b1220] text-gray-300">
      <div className="border-b border-white/10 p-4"><Logo light /></div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(([to, label, Icon, end]) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand text-white' : 'hover:bg-white/10'}`}
          >
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-4 text-xs">
        <Link to="/" className="flex items-center gap-2 hover:text-white"><FiExternalLink /> View store</Link>
        <p className="truncate text-gray-500">{user?.email}</p>
        <button onClick={logout} className="text-red-400 hover:underline">Logout</button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 lg:block">{Sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">{Sidebar}</div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Menu">{open ? <FiX size={22} /> : <FiMenu size={22} />}</button>
          <span className="font-semibold">Admin Panel</span>
        </div>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
