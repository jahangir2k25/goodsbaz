import { Link } from 'react-router-dom';

export default function BrandBanners({ banners = [] }) {
  if (!banners.length) return null;
  return (
    <section className="container-x py-4 md:py-5">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
        {banners.map((b) => (
          <Link
            key={b._id}
            to={b.link || '/shop'}
            className="group relative block aspect-[5/3] overflow-hidden rounded-md shadow-sm transition hover:shadow-xl"
          >
            {b.image ? (
              <img src={b.image} alt={b.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            ) : (
              <div className="flex h-full w-full flex-col justify-center p-5 transition duration-500 group-hover:scale-[1.03]" style={{ background: b.gradient, color: b.textColor }}>
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20" />
                <div className="absolute -bottom-12 right-6 h-36 w-24 rotate-12 rounded-t-3xl bg-white/25" />
                <div className="absolute -bottom-10 right-20 h-28 w-14 -rotate-6 rounded-t-2xl bg-white/20" />
                <div className="relative max-w-[62%]">
                  {b.tag && <p className="mb-1 text-[11px] font-semibold leading-tight opacity-95">{b.tag}</p>}
                  <h3 className="text-2xl font-extrabold leading-tight md:text-3xl">{b.title}</h3>
                  {b.subtitle && <p className="mt-1 text-xs opacity-90">{b.subtitle}</p>}
                  <span className="mt-3 inline-block rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-gray-900">Shop Now</span>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
