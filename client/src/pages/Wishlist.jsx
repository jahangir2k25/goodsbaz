import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { list } = useWishlist();
  return (
    <div className="container-x py-8">
      <h1 className="mb-5 text-2xl font-bold">My Wishlist</h1>
      {list.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-6xl">💖</p>
          <p className="mt-3 font-semibold">Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary mt-4">Discover products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      )}
    </div>
  );
}
