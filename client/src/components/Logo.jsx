import { Link } from 'react-router-dom';

export default function Logo({ className = '', light = false }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="Goodsbaz Home">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-brand-800 shadow">
        <span className="font-logo text-2xl leading-none text-white" style={{ marginTop: -2 }}>G</span>
      </span>
      <span className="leading-none">
        <span className={`block font-logo text-[26px] tracking-wide ${light ? 'text-white' : 'text-brand-600'}`}>Goodsbaz</span>
        <span className={`block text-[8px] font-medium tracking-[0.2em] ${light ? 'text-pink-200' : 'text-brand-400'}`}>
          Simply Elegant
        </span>
      </span>
    </Link>
  );
}
