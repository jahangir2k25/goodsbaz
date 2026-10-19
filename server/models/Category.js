import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, unique: true, index: true },
    image: { type: String, default: '' },
    icon: { type: String, default: '' },
    subCategories: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function (next) {
  if (this.name && (!this.slug || this.isModified('name'))) this.slug = slugify(this.name);
  next();
});

export default mongoose.model('Category', categorySchema);
