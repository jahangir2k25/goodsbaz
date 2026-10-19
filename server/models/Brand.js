import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, unique: true, index: true },
    logo: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

brandSchema.pre('validate', function (next) {
  if (this.name && (!this.slug || this.isModified('name'))) this.slug = slugify(this.name);
  next();
});

export default mongoose.model('Brand', brandSchema);
