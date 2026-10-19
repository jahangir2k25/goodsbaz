import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import asyncHandler from '../utils/asyncHandler.js';
import { evaluateCoupon } from './couponController.js';

const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);

export const calcShipping = (area, subtotal) => {
  const free = num(process.env.FREE_SHIPPING_MIN, 2000);
  if (subtotal >= free) return 0;
  return area === 'inside_dhaka'
    ? num(process.env.SHIPPING_INSIDE_DHAKA, 60)
    : num(process.env.SHIPPING_OUTSIDE_DHAKA, 120);
};

const makeOrderNumber = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `ELG${ymd}${Math.floor(1000 + Math.random() * 9000)}`;
};

// POST /api/orders   (guest or logged-in)
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping, paymentMethod = 'cod', paymentTrxId = '', couponCode = '' } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }
  if (!shipping || !shipping.name || !shipping.phone || !shipping.address) {
    res.status(400);
    throw new Error('Name, phone and address are required');
  }
  if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(String(shipping.phone).replace(/\s|-/g, ''))) {
    res.status(400);
    throw new Error('Please enter a valid Bangladeshi mobile number');
  }
  if (['bkash', 'nagad'].includes(paymentMethod) && !String(paymentTrxId).trim()) {
    res.status(400);
    throw new Error('Transaction ID is required for bKash / Nagad payment');
  }

  // Never trust prices from the client: reload from DB
  const ids = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids } });
  const map = new Map(products.map((p) => [p._id.toString(), p]));

  const orderItems = [];
  let subtotal = 0;
  for (const i of items) {
    const p = map.get(String(i.product));
    const qty = Math.max(1, parseInt(i.qty, 10) || 1);
    if (!p) {
      res.status(400);
      throw new Error('One of the products in your cart no longer exists');
    }
    if (p.stock < qty) {
      res.status(400);
      throw new Error(`"${p.name}" has only ${p.stock} item(s) in stock`);
    }
    orderItems.push({ product: p._id, name: p.name, image: p.images?.[0] || '', price: p.finalPrice, qty });
    subtotal += p.finalPrice * qty;
  }

  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    try {
      const r = await evaluateCoupon(couponCode, subtotal);
      discount = r.discount;
      appliedCoupon = r.coupon;
    } catch (e) {
      res.status(400);
      throw e;
    }
  }

  const area = shipping.area === 'outside_dhaka' ? 'outside_dhaka' : 'inside_dhaka';
  const shippingFee = calcShipping(area, subtotal - discount);
  const total = subtotal - discount + shippingFee;

  // unique order number
  let orderNumber = makeOrderNumber();
  while (await Order.exists({ orderNumber })) orderNumber = makeOrderNumber();

  const order = await Order.create({
    orderNumber,
    user: req.user?._id,
    items: orderItems,
    shipping: { ...shipping, area },
    paymentMethod,
    paymentTrxId,
    subtotal,
    shippingFee,
    discount,
    couponCode: appliedCoupon?.code || '',
    total,
  });

  // update stock + coupon usage
  await Promise.all(
    orderItems.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: -i.qty, sold: i.qty } }))
  );
  if (appliedCoupon) await Coupon.updateOne({ _id: appliedCoupon._id }, { $inc: { used: 1 } });

  res.status(201).json(order);
});

// GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// POST /api/orders/track  { orderNumber, phone }
export const trackOrder = asyncHandler(async (req, res) => {
  const { orderNumber, phone } = req.body;
  const order = await Order.findOne({ orderNumber: String(orderNumber || '').trim().toUpperCase() });
  const clean = (p) => String(p || '').replace(/\D/g, '').slice(-10);
  if (!order || clean(order.shipping.phone) !== clean(phone)) {
    res.status(404);
    throw new Error('No order found with these details');
  }
  res.json(order);
});

// GET /api/orders  (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ orderNumber: rx }, { 'shipping.name': rx }, { 'shipping.phone': rx }];
  }
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Number(limit) || 20);
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l);
  res.json({ orders, page: p, pages: Math.ceil(total / l) || 1, total });
});

// PUT /api/orders/:id/status (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, isPaid } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (status && status !== order.status) {
    // restock when cancelling, and take stock back if un-cancelling
    if (status === 'cancelled' && order.status !== 'cancelled') {
      await Promise.all(
        order.items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.qty, sold: -i.qty } }))
      );
    } else if (order.status === 'cancelled' && status !== 'cancelled') {
      await Promise.all(
        order.items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: -i.qty, sold: i.qty } }))
      );
    }
    order.status = status;
    if (status === 'delivered' && order.paymentMethod === 'cod') order.isPaid = true;
  }
  if (typeof isPaid === 'boolean') order.isPaid = isPaid;
  await order.save();
  res.json(order);
});
