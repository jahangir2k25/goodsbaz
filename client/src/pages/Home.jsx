import { useEffect, useState } from 'react';
import api from '../api/axios';
import HeroSlider from '../components/HeroSlider';
import HotDeals from '../components/HotDeals';
import BrandBanners from '../components/BrandBanners';
import CategoryGrid from '../components/CategoryGrid';
import ProductSection from '../components/ProductSection';
import BrandsStrip from '../components/BrandsStrip';
import FeaturesStrip from '../components/FeaturesStrip';
import Loader from '../components/Loader';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/home')
      .then((r) => setData(r.data))
      .catch(() => setError('Could not load the store. Is the server running and the database seeded?'));
  }, []);

  if (error) return <div className="container-x py-24 text-center text-red-600">{error}</div>;
  if (!data) return <Loader />;

  return (
    <div>
      <HeroSlider slides={data.hero} />
      <HotDeals deals={data.deals} />
      <BrandBanners banners={data.brandBanners} />
      <CategoryGrid categories={data.categories} />
      <ProductSection title="Flash Sale" subtitle="Biggest discounts right now" products={data.flashSale} to="/shop?offers=true&sort=discount" bg="bg-brand-50/60" />
      <ProductSection title="Best Sellers" subtitle="Loved by our customers" products={data.bestSellers} to="/shop?sort=popular" />
      <BrandsStrip brands={data.brands} />
      <ProductSection title="New Arrivals" subtitle="Fresh on the shelf" products={data.newArrivals} to="/shop?newArrival=true" />
      <ProductSection title="Featured Picks" subtitle="Hand-picked by our beauty experts" products={data.featured} to="/shop" bg="bg-brand-50/60" />
      <FeaturesStrip />
    </div>
  );
}
