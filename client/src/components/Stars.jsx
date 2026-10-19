import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

export default function Stars({ rating = 0, size = 12 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((n) => {
        if (rating >= n) return <FaStar key={n} size={size} />;
        if (rating >= n - 0.5) return <FaStarHalfAlt key={n} size={size} />;
        return <FaRegStar key={n} size={size} />;
      })}
    </span>
  );
}
