import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  newest: { createdAt: -1 },
  'price-asc': { finalPrice: 1 },
  'price-desc': { finalPrice: -1 },
  popular: { sold: -1, rating: -1 },
  discount: { discountPercent: -1 },
  rating: { rating: -1, numReviews: -1 },
};

// GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword, category, sub, brand, minPrice, maxPrice,
    sort = 'newest', page = 1, limit = 12,
    offers, featured, bestSeller, newArrival, inStock,
  } = req.query;

  const filter = {};

  if (keyword && keyword.trim()) {
    const rx = new RegExp(escapeRegex(keyword.trim()), 'i');
    const brands = await Brand.find({ name: rx }).select('_id');
    filter.$or = [{ name: rx }, { tags: rx }, { brand: { $in: brands.map((b) => b._id) } }];
  }
  if (category) {
    const cats = await Category.find({ slug: { $in: category.split(',') } }).select('_id');
    filter.category = { $in: cats.map((c) => c._id) };
  }
  if (sub) filter.subCategory = sub;
  if (brand) {
    const brands = await Brand.find({ slug: { $in: brand.split(',') } }).select('_id');
    filter.brand = { $in: brands.map((b) => b._id) };
  }
  if (minPrice || maxPrice) {
    filter.finalPrice = {};
    if (minPrice) filter.finalPrice.$gte = Number(minPrice);
    if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
  }
  if (offers === 'true') filter.discountPercent = { $gt: 0 };
  if (featured === 'true') filter.isFeatured = true;
  if (bestSeller === 'true') filter.isBestSeller = true;
  if (newArrival === 'true') filter.isNewArrival = true;
  if (inStock === 'true') filter.stock = { $gt: 0 };

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(60, Math.max(1, Number(limit) || 12));

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .select('-reviews')
    .populate('brand', 'name slug')
    .populate('category', 'name slug')
    .sort(SORTS[sort] || SORTS.newest)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    total,
  });
});

// GET /api/products/:idOrSlug
export const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = mongoose.isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
  const product = await Product.findOne(query)
    .populate('brand', 'name slug')
    .populate('category', 'name slug subCategories');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
  })
    .select('-reviews')
    .populate('brand', 'name slug')
    .limit(8);
  res.json({ product, related });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const { reviews, rating, numReviews, sold, ...data } = req.body; // protected fields
  Object.assign(product, data);
  await product.save();
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});

// POST /api/products/:id/reviews
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.reviews.some((r) => r.user.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }
  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
});
