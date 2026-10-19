import Banner from '../models/Banner.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

const card = (q, sort, limit = 10) =>
  Product.find(q).select('-reviews').populate('brand', 'name slug').sort(sort).limit(limit);

// GET /api/home  (one request for everything the home page needs)
export const getHome = asyncHandler(async (req, res) => {
  const [banners, categories, brands, flashSale, bestSellers, newArrivals, featured] = await Promise.all([
    Banner.find({ active: true }).sort({ order: 1, createdAt: 1 }),
    Category.find().sort({ order: 1 }),
    Brand.find().sort({ featured: -1, name: 1 }),
    card({ discountPercent: { $gt: 0 } }, { discountPercent: -1 }, 10),
    card({ isBestSeller: true }, { sold: -1 }, 10),
    card({ isNewArrival: true }, { createdAt: -1 }, 10),
    card({ isFeatured: true }, { createdAt: -1 }, 10),
  ]);

  res.json({
    hero: banners.filter((b) => b.type === 'hero'),
    deals: banners.filter((b) => b.type === 'deal'),
    brandBanners: banners.filter((b) => b.type === 'brand'),
    categories,
    brands,
    flashSale,
    bestSellers,
    newArrivals,
    featured,
  });
});
