import { FiCheck } from 'react-icons/fi';

const STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderTimeline({ status }) {
  if (status === 'cancelled') {
    return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">This order was cancelled.</p>;
  }
  const current = STEPS.indexOf(status);
  return (
    <ol className="flex items-start justify-between">
      {STEPS.map((s, i) => (
        <li key={s} className="relative flex flex-1 flex-col items-center text-center">
          {i > 0 && <span className={`absolute right-1/2 top-3.5 h-0.5 w-full ${i <= current ? 'bg-brand' : 'bg-gray-200'}`} />}
          <span className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i <= current ? 'bg-brand text-white' : 'bg-gray-200 text-gray-500'}`}>
            {i < current ? <FiCheck /> : i + 1}
          </span>
          <span className={`mt-1 text-[10px] font-semibold capitalize sm:text-xs ${i <= current ? 'text-brand' : 'text-gray-400'}`}>{s}</span>
        </li>
      ))}
    </ol>
  );
}
