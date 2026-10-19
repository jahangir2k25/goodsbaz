export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  const base = 'min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium border transition';
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className={`${base} border-gray-200 hover:border-brand disabled:opacity-40`}>
        ‹
      </button>
      {nums.map((n, i) =>
        n === '…' ? (
          <span key={`d${i}`} className="px-1 text-gray-400">…</span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`${base} ${n === page ? 'border-brand bg-brand text-white' : 'border-gray-200 hover:border-brand'}`}
          >
            {n}
          </button>
        )
      )}
      <button disabled={page === pages} onClick={() => onChange(page + 1)} className={`${base} border-gray-200 hover:border-brand disabled:opacity-40`}>
        ›
      </button>
    </div>
  );
}
