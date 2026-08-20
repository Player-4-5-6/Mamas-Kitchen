import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

const DELIVERY_FEE = 1500;

const generateOrderNumber = () => {
  const stamp = Date.now().toString().slice(-6);
  const rand = Math.floor(100 + Math.random() * 900);
  return `MK-${stamp}${rand}`;
};

// @desc  Place a new order
// @route POST /api/orders
export const placeOrder = async (req, res, next) => {
  try {
    const { items, fulfillmentType, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (fulfillmentType === "delivery" && !deliveryAddress) {
      return res.status(400).json({ message: "Delivery address required" });
    }

    // Re-verify prices from DB (never trust client-sent prices)
    let itemsSubtotal = 0;
    const verifiedItems = [];

    for (const cartItem of items) {
      const menuItem = await MenuItem.findById(cartItem.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({
          message: `${menuItem?.name || "An item"} is no longer available`,
        });
      }
      const lineTotal = menuItem.price * cartItem.quantity;
      itemsSubtotal += lineTotal;
      verifiedItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: cartItem.quantity,
        specialInstructions: cartItem.specialInstructions || "",
      });
    }

    const deliveryFee = fulfillmentType === "delivery" ? DELIVERY_FEE : 0;
    const total = itemsSubtotal + deliveryFee;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: req.user._id,
      items: verifiedItems,
      fulfillmentType,
      deliveryAddress: fulfillmentType === "delivery" ? deliveryAddress : undefined,
      paymentMethod,
      itemsSubtotal,
      deliveryFee,
      total,
      status: "pending",
      statusHistory: [{ status: "pending" }],
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

// @desc  Get logged-in customer's orders
// @route GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json({ count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single order (owner or admin)
// @route GET /api/orders/:id
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.customer._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all orders (admin dashboard, supports ?status=)
// @route GET /api/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });
    res.json({ count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc  Update order status (admin)
// @route PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "ready_for_pickup",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.statusHistory.push({ status });
    await order.save();

    res.json({ order });
  } catch (error) {
    next(error);
  }
};

// @desc  Dashboard sales overview (admin)
// @route GET /api/orders/stats/overview
export const getSalesOverview = async (req, res, next) => {
  try {
    const orders = await Order.find({ status: { $ne: "cancelled" } });
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaysOrders = orders.filter((o) => o.createdAt >= todayStart);

    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalRevenue,
      totalOrders,
      todaysOrderCount: todaysOrders.length,
      todaysRevenue: todaysOrders.reduce((sum, o) => sum + o.total, 0),
      statusCounts,
    });
  } catch (error) {
    next(error);
  }
};
