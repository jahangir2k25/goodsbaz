import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import Logo from './Logo';
import { site } from '../config/site';

const col = 'mb-3 text-sm font-bold text-white';
const link = 'block py-1 text-sm text-gray-400 transition hover:text-white';

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#1b1220] text-gray-300">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-3 text-sm text-gray-400">{site.tagline}. Authentic beauty & skincare products delivered across Bangladesh.</p>
          <div className="mt-4 flex gap-2">
            {[
              [FaFacebookF, site.facebook, 'Facebook'],
              [FaInstagram, site.instagram, 'Instagram'],
              [FaYoutube, site.youtube, 'YouTube'],
            ].map(([Icon, href, label]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className={col}>Shop</h4>
          <Link to="/shop?category=skin-care" className={link}>Skin Care</Link>
          <Link to="/shop?category=hair-care" className={link}>Hair Care</Link>
          <Link to="/shop?category=makeup" className={link}>Makeup</Link>
          <Link to="/shop?category=k-beauty" className={link}>K-Beauty</Link>
          <Link to="/shop?category=j-beauty" className={link}>J-Beauty</Link>
          <Link to="/shop?offers=true" className={link}>Offers</Link>
        </div>

        <div>
          <h4 className={col}>Customer Service</h4>
          <Link to="/account" className={link}>My Account</Link>
          <Link to="/track-order" className={link}>Track Your Order</Link>
          <Link to="/wishlist" className={link}>Wishlist</Link>
          <Link to="/page/shipping-policy" className={link}>Shipping Policy</Link>
          <Link to="/page/return-policy" className={link}>Return & Refund Policy</Link>
          <Link to="/page/privacy-policy" className={link}>Privacy Policy</Link>
          <Link to="/page/terms" className={link}>Terms & Conditions</Link>
        </div>

        <div>
          <h4 className={col}>Contact</h4>
          <p className="flex items-start gap-2 py-1 text-sm text-gray-400"><FiMapPin className="mt-0.5 shrink-0" /> {site.address}</p>
          <a href={`tel:${site.phone}`} className="flex items-center gap-2 py-1 text-sm text-gray-400 hover:text-white"><FiPhone /> {site.phoneLabel}</a>
          <a href={`mailto:${site.email}`} className="flex items-center gap-2 py-1 text-sm text-gray-400 hover:text-white"><FiMail /> {site.email}</a>
          <p className="mb-2 mt-4 text-xs font-semibold text-white">We accept</p>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="rounded bg-pink-600 px-2.5 py-1 text-white">bKash</span>
            <span className="rounded bg-orange-500 px-2.5 py-1 text-white">Nagad</span>
            <span className="rounded bg-emerald-600 px-2.5 py-1 text-white">Cash on Delivery</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {site.name}. All rights reserved. Developed by Raj Diversion.
      </div>
    </footer>
  );
}
