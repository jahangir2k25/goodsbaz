import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const FALLBACK = 'linear-gradient(100deg,#fff1f5 0%,#f9cadb 55%,#e48db0 100%)';

function Slide({ s }) {
  // Admin uploaded an image URL -> show it full-bleed
  if (s.image) return <img src={s.image} alt={s.title} className="h-full w-full object-cover" />;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: s.gradient || FALLBACK }}>
      {/* decorative blossoms / glow */}
      <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/30 blur-2xl" />
      <div className="absolute bottom-[-60px] right-[12%] h-72 w-72 rounded-full bg-white/25 blur-3xl" />
      <div className="absolute right-[6%] top-[10%] hidden h-[80%] w-[26%] rounded-t-full bg-white/20 md:block" />
      <div className="absolute right-[10%] top-[20%] hidden h-40 w-40 rounded-full bg-white/20 md:block" />

      <div className="container-x relative flex h-full items-center">
        <div className="mx-auto max-w-2xl text-center md:ml-[6%] md:mr-auto" style={{ color: s.textColor }}>
          {s.tag && (
            <span className="inline-block rounded-full bg-black/75 px-4 py-1 text-[9px] font-semibold uppercase tracking-wider text-white sm:text-xs md:px-6 md:py-1.5 md:text-sm">
              {s.tag}
            </span>
          )}
          <h2 className="mt-2 text-xl font-extrabold uppercase leading-tight drop-shadow-sm sm:text-3xl md:mt-3 md:text-5xl lg:text-6xl">
            {s.title}
          </h2>

          {s.highlight ? (
            <>
              {s.subtitle && <p className="mt-1 font-script text-3xl leading-none sm:text-4xl md:mt-3 md:text-6xl">{s.subtitle}</p>}
              <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.3em] sm:text-[10px] md:mt-3 md:text-sm">{s.highlight}</p>
            </>
          ) : (
            <>
              {s.subtitle && <p className="mt-1 text-xs font-medium sm:text-sm md:mt-2 md:text-xl">{s.subtitle}</p>}
              <span className="mt-3 inline-block rounded-full bg-white px-5 py-1.5 text-[11px] font-bold text-gray-900 shadow transition hover:scale-105 md:mt-5 md:px-8 md:py-2.5 md:text-sm">
                Shop Now →
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HeroSlider({ slides = [] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  useEffect(() => {
    if (n < 2 || paused) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n, paused]);

  if (!n) return null;
  const go = (d) => setIdx((i) => (i + d + n) % n);

  return (
    <div
      className="group relative h-[190px] w-full overflow-hidden bg-brand-50 sm:h-[260px] md:h-[360px] lg:h-[440px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <Link
          key={s._id}
          to={s.link || '/shop'}
          aria-hidden={i !== idx}
          tabIndex={i === idx ? 0 : -1}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'z-10 opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <Slide s={s} />
        </Link>
      ))}

      {n > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 opacity-0 shadow transition hover:bg-white group-hover:opacity-100 md:flex"
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 opacity-0 shadow transition hover:bg-white group-hover:opacity-100 md:flex"
          >
            <FiChevronRight size={22} />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s._id}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full border border-white/70 transition ${i === idx ? 'scale-110 bg-brand' : 'bg-white/90'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
