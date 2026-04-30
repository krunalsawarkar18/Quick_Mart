import express from "express";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getDeliverySettings, getOrCreateDeliverySettings } from "../utils/deliverySettings.js";
import { canCancelOrder, restoreOrderStock, visibleOrderFilter } from "../utils/orderHelpers.js";
import { getStripeClient, refundStripePayment } from "../utils/paymentHelpers.js";
import slugify from "../utils/slugify.js";

const router = express.Router();
const stripe = getStripeClient();

router.use(protect, adminOnly);

router.get("/dashboard", asyncHandler(async (req, res) => {
  const [products, categories, orders, customers, featuredProducts, lowStockProducts, pendingOrders, recentOrders, deliverySettings] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(visibleOrderFilter),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments({ featured: true }),
    Product.countDocuments({ stock: { $lte: 10 } }),
    Order.countDocuments({ ...visibleOrderFilter, status: { $in: ["Pending", "Confirmed", "Packed"] } }),
    Order.find(visibleOrderFilter)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    getDeliverySettings()
  ]);

  const revenue = await Order.aggregate([
    { $match: { paymentStatus: "Paid", status: { $ne: "Cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);

  res.json({
    products,
    categories,
    orders,
    customers,
    revenue: revenue[0]?.total || 0,
    featuredProducts,
    lowStockProducts,
    pendingOrders,
    recentOrders,
    deliverySettings
  });
}));

router.get("/delivery-settings", asyncHandler(async (_req, res) => {
  res.json(await getDeliverySettings());
}));

router.patch("/delivery-settings", asyncHandler(async (req, res) => {
  const settings = await getOrCreateDeliverySettings();
  const nextCharge = Number(req.body.charge);
  const nextThreshold = Number(req.body.freeDeliveryThreshold);

  if (!Number.isFinite(nextCharge) || nextCharge < 0) {
    return res.status(400).json({ message: "Delivery charge must be a valid non-negative number" });
  }

  if (!Number.isFinite(nextThreshold) || nextThreshold < 0) {
    return res.status(400).json({ message: "Free delivery threshold must be a valid non-negative number" });
  }

  settings.charge = nextCharge;
  settings.freeDeliveryThreshold = nextThreshold;
  settings.updatedBy = req.user._id;
  await settings.save();

  res.json({
    charge: settings.charge,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    updatedAt: settings.updatedAt
  });
}));

router.get("/products", asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("category", "name slug").sort({ createdAt: -1 });
  res.json(products);
}));

router.post("/products", asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    slug: req.body.slug || slugify(req.body.name)
  };

  const product = await Product.create(payload);
  res.status(201).json(await product.populate("category", "name slug"));
}));

router.put("/products/:id", asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  Object.assign(product, req.body);
  if (req.body.name && !req.body.slug) {
    product.slug = slugify(req.body.name);
  }

  await product.save();
  res.json(await product.populate("category", "name slug"));
}));

router.delete("/products/:id", asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product removed" });
}));

router.get("/categories", asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  res.json(categories);
}));

router.post("/categories", asyncHandler(async (req, res) => {
  const category = await Category.create({
    ...req.body,
    slug: req.body.slug || slugify(req.body.name)
  });

  res.status(201).json(category);
}));

router.put("/categories/:id", asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  category.name = req.body.name || category.name;
  category.description = req.body.description ?? category.description;
  category.slug = req.body.slug || slugify(category.name);
  await category.save();

  res.json(category);
}));

router.delete("/categories/:id", asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({ category: req.params.id });

  if (productCount > 0) {
    return res.status(400).json({ message: "Remove products in this category before deleting it" });
  }

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({ message: "Category removed" });
}));

router.get("/orders", asyncHandler(async (req, res) => {
  const orders = await Order.find(visibleOrderFilter)
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  res.json(orders);
}));

router.get("/customers", asyncHandler(async (req, res) => {
  const [customers, orderStats] = await Promise.all([
    User.find({ role: "customer" }).select("name email phone createdAt").sort({ createdAt: -1 }),
    Order.aggregate([
      { $match: visibleOrderFilter },
      {
        $group: {
          _id: "$user",
          ordersCount: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ["$paymentStatus", "Paid"] }, { $ne: ["$status", "Cancelled"] }]
                },
                "$totalPrice",
                0
              ]
            }
          },
          latestOrderAt: { $max: "$createdAt" }
        }
      }
    ])
  ]);

  const statsMap = orderStats.reduce((acc, item) => {
    acc[item._id.toString()] = item;
    return acc;
  }, {});

  res.json(
    customers.map((customer) => {
      const stats = statsMap[customer._id.toString()];

      return {
        ...customer.toObject(),
        ordersCount: stats?.ordersCount || 0,
        totalSpent: stats?.totalSpent || 0,
        latestOrderAt: stats?.latestOrderAt || null
      };
    })
  );
}));

router.patch("/orders/:id", asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const nextStatus = req.body.status || order.status;

  if (order.status === "Cancelled" && nextStatus !== "Cancelled") {
    return res.status(400).json({ message: "Cancelled orders cannot be reopened" });
  }

  if (nextStatus === "Cancelled" && order.status !== "Cancelled") {
    if (order.paymentMethod === "Stripe" && order.paymentStatus !== "Paid") {
      return res.status(400).json({ message: "Only paid Stripe orders can be cancelled" });
    }

    if (!canCancelOrder(order.status)) {
      return res.status(400).json({ message: "This order can no longer be cancelled" });
    }

    if (order.paymentMethod === "Stripe") {
      await refundStripePayment(stripe, order.stripePaymentIntentId, "requested_by_customer");
      order.paymentStatus = "Refunded";
    }

    await restoreOrderStock(order);
  }

  order.status = nextStatus;

  if (order.paymentMethod === "Cash on Delivery" && nextStatus === "Delivered") {
    order.paymentStatus = "Paid";
  }

  await order.save();
  res.json(order);
}));

router.delete("/customers/:id", asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: "customer" });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  await Promise.all([
    Address.deleteMany({ user: customer._id }),
    Cart.deleteMany({ user: customer._id }),
    Order.deleteMany({ user: customer._id }),
    User.deleteOne({ _id: customer._id })
  ]);

  res.json({ message: "Customer removed" });
}));

export default router;
