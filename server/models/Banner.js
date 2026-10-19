import mongoose from 'mongoose';

// type: hero  -> big slider on top
//       deal  -> small "Hot Deals" cards strip
//       brand -> brand promo cards under the hot deals strip
const bannerSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['hero', 'deal', 'brand'], required: true },
    tag: { type: String, default: '' },
    title: { type: String, default: '' },
    highlight: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image: { type: String, default: '' },
    gradient: { type: String, default: '' },
    textColor: { type: String, default: '#ffffff' },
    link: { type: String, default: '/shop' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Banner', bannerSchema);
