import MenuItem from "../models/MenuItem.js";

// @desc  Get all menu items (public, supports ?category= & ?search=)
// @route GET /api/menu
export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, availableOnly } = req.query;
    const filter = {};

    if (category && category !== "All") filter.category = category;
    if (availableOnly === "true") filter.isAvailable = true;
    if (search) filter.$text = { $search: search };

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json({ count: items.length, items });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single menu item
// @route GET /api/menu/:id
export const getMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ item });
  } catch (error) {
    next(error);
  }
};

// @desc  Create menu item (admin)
// @route POST /api/menu
export const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
};

// @desc  Update menu item (admin)
// @route PUT /api/menu/:id
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ item });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete menu item (admin)
// @route DELETE /api/menu/:id
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc  Toggle availability (admin)
// @route PATCH /api/menu/:id/availability
export const toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json({ item });
  } catch (error) {
    next(error);
  }
};
