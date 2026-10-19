import { Router } from 'express';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Banner from '../models/Banner.js';
import Coupon from '../models/Coupon.js';
import { crudFactory } from '../controllers/crudFactory.js';
import { validateCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const build = (Model, opts, { publicList = true } = {}) => {
  const c = crudFactory(Model, opts);
  const r = Router();
  if (publicList) r.get('/', c.list);
  else r.get('/', protect, admin, c.list);
  r.post('/', protect, admin, c.create);
  r.put('/:id', protect, admin, c.update);
  r.delete('/:id', protect, admin, c.remove);
  return r;
};

export const categoryRoutes = build(Category, { sort: { order: 1 }, label: 'Category' });
export const brandRoutes = build(Brand, { sort: { name: 1 }, label: 'Brand' });
export const bannerRoutes = build(Banner, { sort: { type: 1, order: 1 }, label: 'Banner' });

const coupons = build(Coupon, { label: 'Coupon' }, { publicList: false });
// public: validate a coupon code at checkout (declared before /:id routes)
export const couponRoutes = Router();
couponRoutes.post('/validate', validateCoupon);
couponRoutes.use('/', coupons);
