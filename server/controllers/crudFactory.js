import asyncHandler from '../utils/asyncHandler.js';

// Generic CRUD handlers used for categories, brands, banners and coupons.
export const crudFactory = (Model, { sort = { createdAt: -1 }, label = 'Item' } = {}) => ({
  list: asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const items = await Model.find(filter).sort(sort);
    res.json(items);
  }),
  create: asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  }),
  update: asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error(`${label} not found`);
    }
    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  }),
  remove: asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error(`${label} not found`);
    }
    await item.deleteOne();
    res.json({ message: `${label} deleted` });
  }),
});
