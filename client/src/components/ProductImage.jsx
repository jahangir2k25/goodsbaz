import { useEffect, useState } from 'react';

const PALETTES = [
  ['#fde4ef', '#f9a8d4', '#be185d'],
  ['#e0f2fe', '#7dd3fc', '#0369a1'],
  ['#ecfccb', '#bef264', '#4d7c0f'],
  ['#fef3c7', '#fcd34d', '#b45309'],
  ['#ede9fe', '#c4b5fd', '#6d28d9'],
  ['#ffe4e6', '#fda4af', '#be123c'],
];

const hash = (s = '') => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// Shows the real product image; falls back to a tidy bottle illustration so the
// storefront never looks broken while you are still adding photos.
export default function ProductImage({ src, name = '', brand = '', className = 'h-full w-full object-cover' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (src && !failed) {
    return <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className={className} />;
  }

  const [bg, mid, dark] = PALETTES[hash(name) % PALETTES.length];
  const letter = (brand || name || 'E').trim()[0]?.toUpperCase();

  return (
    <div
      className={`${className} flex items-center justify-center`}
      style={{ background: `linear-gradient(160deg, ${bg}, ${mid}66)` }}
      role="img"
      aria-label={name}
    >
      <svg viewBox="0 0 120 160" className="h-3/5 w-1/2 drop-shadow-md">
        <rect x="44" y="6" width="32" height="18" rx="4" fill={dark} />
        <rect x="51" y="24" width="18" height="10" fill={mid} />
        <rect x="26" y="34" width="68" height="116" rx="16" fill="#fff" stroke={mid} strokeWidth="3" />
        <rect x="26" y="72" width="68" height="46" fill={mid} opacity="0.35" />
        <text x="60" y="106" textAnchor="middle" fontSize="30" fontWeight="700" fontFamily="Poppins, sans-serif" fill={dark}>
          {letter}
        </text>
      </svg>
    </div>
  );
}
