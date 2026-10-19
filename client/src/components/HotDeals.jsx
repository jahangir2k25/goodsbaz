import { Link } from 'react-router-dom';

function DealCard({ d }) {
  if (d.image) {
    return (
      <Link to={d.link || '/shop'} className="block min-w-[130px] flex-1 overflow-hidden rounded-xl border-2 border-pink-300/70 bg-white shadow-lg transition hover:-translate-y-1">
        <img src={d.image} alt={d.title || d.highlight} className="h-full w-full object-cover" />
      </Link>
    );
  }
  return (
    <Link
      to={d.link || '/shop'}
      className="flex min-h-[112px] min-w-[128px] flex-1 flex-col items-center justify-center rounded-xl border-2 border-pink-300/80 bg-white/90 p-2 text-center shadow-lg ring-4 ring-white/20 transition hover:-translate-y-1 hover:bg-white md:min-h-[140px]"
    >
      {d.tag && <span className="text-[10px] font-bold uppercase italic text-blue-700 md:text-xs">{d.tag}</span>}
      {d.title && <span className="font-display text-[13px] italic leading-tight text-pink-600 md:text-lg">{d.title}</span>}
      {d.highlight && (
        <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text font-display text-2xl italic leading-none text-transparent md:text-4xl">
          {d.highlight}
        </span>
      )}
      {d.subtitle && <span className="mt-0.5 text-[11px] font-bold italic text-blue-800 md:text-sm">{d.subtitle}</span>}
    </Link>
  );
}

export default function HotDeals({ deals = [] }) {
  if (!deals.length) return null;
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#e0409f] via-[#a73fd0] to-[#3b63e0]">
      {/* sparkles */}
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1px, transparent 2px), radial-gradient(circle at 70% 70%, #fff 1px, transparent 2px), radial-gradient(circle at 90% 20%, #fff 1.5px, transparent 2.5px)', backgroundSize: '90px 90px, 120px 120px, 150px 150px' }} />

      <div className="relative mx-auto flex max-w-[1750px] flex-col items-center gap-3 px-3 py-4 lg:flex-row lg:gap-8 lg:px-6 lg:py-6">
        <div className="shrink-0 select-none text-center leading-none">
          <div className="elegance-pill text-2xl tracking-wider md:text-4xl">ELEGANCE</div>
          <div className="hot-deals-text -mt-1 text-5xl md:text-7xl">HOT DEALS</div>
        </div>

        <div className="no-scrollbar flex w-full flex-1 gap-2 overflow-x-auto pb-1 md:gap-3 lg:overflow-visible lg:pb-0">
          {deals.map((d) => (
            <DealCard key={d._id} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
