import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiUser } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import Logo from './Logo';
import SearchBar from './SearchBar';
import NavBar from './NavBar';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { site } from '../config/site';

const Badge = ({ n }) => (
  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-bold text-white">
    {n}
  </span>
);

export default function Header() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container-x flex h-[60px] items-center gap-3 md:gap-5 md:h-[64px]">
        <Logo />

        <Link to="/brands" className="hidden text-xs font-semibold text-gray-700 transition hover:text-brand md:block">
          Brands
        </Link>

        <SearchBar className="hidden max-w-md flex-1 md:block" />

        <div className="ml-auto flex items-center gap-3 md:gap-4">
          {/* follow us pill */}
          <div className="hidden items-center gap-2.5 rounded-full bg-gray-100 px-3.5 py-1.5 lg:flex">
            <span className="text-[8px] font-bold tracking-wider text-gray-500">FOLLOW US</span>
            <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-gray-800 hover:text-brand">
              <FaFacebookF size={13} />
            </a>
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-gray-800 hover:text-brand">
              <FaInstagram size={14} />
            </a>
            <a href={site.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-gray-800 hover:text-brand">
              <FaYoutube size={15} />
            </a>
          </div>

          <Link to="/wishlist" className="relative text-gray-800 hover:text-brand" aria-label="Wishlist">
            <FiHeart size={21} />
            <Badge n={wishCount} />
          </Link>

          <Link to="/cart" className="relative text-gray-800 hover:text-brand" aria-label="Cart">
            <FiShoppingBag size={21} />
            <Badge n={count} />
          </Link>

          {/* account */}
          <div className="group relative">
            <button
              onClick={() => !user && navigate('/login')}
              className="flex items-center text-gray-800 hover:text-brand"
              aria-label="Account"
            >
              <FiUser size={21} />
            </button>
            {user && (
              <div className="invisible absolute right-0 top-full z-50 w-48 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="overflow-hidden rounded-xl border bg-white py-1 text-sm shadow-xl">
                  <p className="truncate border-b px-4 py-2 text-xs font-semibold text-gray-500">Hi, {user.name}</p>
                  <Link to="/account" className="block px-4 py-2 hover:bg-brand-50">My Account</Link>
                  <Link to="/track-order" className="block px-4 py-2 hover:bg-brand-50">Track Order</Link>
                  {isAdmin && <Link to="/admin" className="block px-4 py-2 font-semibold text-brand hover:bg-brand-50">Admin Panel</Link>}
                  <button onClick={() => { logout(); navigate('/'); }} className="block w-full px-4 py-2 text-left hover:bg-brand-50">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile search */}
      <div className="container-x pb-2 md:hidden">
        <SearchBar />
      </div>

      <NavBar />
    </header>
  );
}
