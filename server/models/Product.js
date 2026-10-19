import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: [true, 'Brand is required'] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
    subCategory: { type: String, default: '' },
    price: { type: Number, required: [true, 'Price is required'], min: 0 }, // regular price (MRP)
    salePrice: { type: Number, default: 0, min: 0 }, // 0 = no discount
    finalPrice: { type: Number, default: 0, index: true }, // computed
    discountPercent: { type: Number, default: 0 }, // computed
    images: [{ type: String }],
    description: { type: String, default: '' },
    size: { type: String, default: '' }, // e.g. "100ml"
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, default: '' },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    sold: { type: Number, default: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', tags: 'text' });

productSchema.pre('validate', function (next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = `${slugify(this.name)}-${Math.random().toString(36).slice(2, 6)}`;
  }
  const hasSale = this.salePrice > 0 && this.salePrice < this.price;
  this.finalPrice = hasSale ? this.salePrice : this.price;
  this.discountPercent = hasSale ? Math.round(((this.price - this.salePrice) / this.price) * 100) : 0;
  next();
});

export default mongoose.model('Product', productSchema);
