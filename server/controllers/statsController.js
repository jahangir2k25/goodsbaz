import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [orders, products, users, revenueAgg, byStatus, recentOrders, lowStock] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.find().sort({ createdAt: -1 }).limit(6),
    Product.find({ stock: { $lte: 5 } }).select('name stock images slug').sort({ stock: 1 }).limit(8),
  ]);

  res.json({
    orders,
    products,
    users,
    revenue: revenueAgg[0]?.total || 0,
    byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
    recentOrders,
    lowStock,
  });
});
