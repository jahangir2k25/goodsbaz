import Coupon from '../models/Coupon.js';
import asyncHandler from '../utils/asyncHandler.js';

// Shared by /coupons/validate and order creation. Returns { coupon, discount }
export const evaluateCoupon = async (code, subtotal) => {
  const coupon = await Coupon.findOne({ code: String(code || '').trim().toUpperCase() });
  if (!coupon || !coupon.active) throw new Error('Invalid coupon code');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('This coupon has expired');
  if (coupon.usageLimit > 0 && coupon.used >= coupon.usageLimit) throw new Error('Coupon usage limit reached');
  if (subtotal < coupon.minOrder) throw new Error(`Minimum order of ৳${coupon.minOrder} required for this coupon`);

  let discount = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  if (coupon.type === 'percent' && coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal);
  return { coupon, discount };
};

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  try {
    const { coupon, discount } = await evaluateCoupon(code, Number(subtotal) || 0);
    res.json({ code: coupon.code, discount });
  } catch (e) {
    res.status(400);
    throw e;
  }
});
