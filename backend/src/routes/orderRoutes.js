import express from "express";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  canCancelOrder,
  generateOrderNumber,
  restoreOrderStock,
  visibleOrderFilter
} from "../utils/orderHelpers.js";
import { calculateDeliveryFee, getDeliverySettings } from "../utils/deliverySettings.js";
import { getStripeClient, getStripePaymentIntentId, refundStripePayment } from "../utils/paymentHelpers.js";

const router = express.Router();
const stripe = getStripeClient();

const ensureCustomerAccess = (req, res, next) => {
  if (req.user?.role === "admin") {
    return res.status(403).json({ message: "Admin accounts should manage customer orders from the admin workspace" });
  }

  next();
};

router.use(protect);
router.use(ensureCustomerAccess);

const getPopulatedCart = (userId) =>
  Cart.findOne({ user: userId }).populate("items.product", "name slug price discountPrice stock imageUrl");

const getCheckoutContext = async (userId, addressId) => {
  const deliverySettings = await getDeliverySettings();
  const cart = await getPopulatedCart(userId);

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  const address = await Address.findOne({ _id: addressId, user: userId });

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  const insufficientItem = cart.items.find((item) => item.quantity > (item.product.stock || 0));

  if (insufficientItem) {
    const error = new Error(`${insufficientItem.product.name} does not have enough stock for this order`);
    error.statusCode = 400;
    throw error;
  }

  const items = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    imageUrl: item.product.imageUrl,
    price: item.product.discountPrice || item.product.price,
    quantity: item.quantity
  }));

  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = calculateDeliveryFee(itemsPrice, deliverySettings);
  const totalPrice = itemsPrice + deliveryFee;

  return { cart, address, items, itemsPrice, deliveryFee, totalPrice };
};

const createOrderPayload = ({ userId, items, address, paymentMethod, itemsPrice, deliveryFee, totalPrice, extras = {} }) => ({
  user: userId,
  items,
  address: {
    fullName: address.fullName,
    phone: address.phone,
    street: address.street,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country
  },
  paymentMethod,
  paymentStatus: "Pending",
  itemsPrice,
  deliveryFee,
  totalPrice,
  orderNumber: generateOrderNumber(),
  ...extras
});

const reduceOrderStock = async (order) => {
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      })
    )
  );
};

router.post("/", asyncHandler(async (req, res) => {
  const { addressId, paymentMethod = "Cash on Delivery" } = req.body;

  if (paymentMethod !== "Cash on Delivery") {
    return res.status(400).json({ message: "Use the Stripe checkout flow for card payments" });
  }

  const { cart, address, items, itemsPrice, deliveryFee, totalPrice } = await getCheckoutContext(req.user._id, addressId);

  const order = await Order.create({
    ...createOrderPayload({
      userId: req.user._id,
      items,
      address,
      paymentMethod,
      itemsPrice,
      deliveryFee,
      totalPrice
    })
  });

  await reduceOrderStock(order);

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
}));

router.get("/", asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id, ...visibleOrderFilter }).sort({ createdAt: -1 });
  res.json(orders);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
}));

router.post("/stripe/checkout-session", asyncHandler(async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: "Stripe is not configured on the server" });
  }

  const { addressId } = req.body;
  const { address, items, itemsPrice, deliveryFee, totalPrice } = await getCheckoutContext(req.user._id, addressId);

  const order = await Order.create(
    createOrderPayload({
      userId: req.user._id,
      items,
      address,
      paymentMethod: "Stripe",
      itemsPrice,
      deliveryFee,
      totalPrice
    })
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout?payment=cancelled`,
    customer_email: req.user.email,
    payment_method_types: ["card"],
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString()
    },
    line_items: [
      ...items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            images: item.imageUrl ? [item.imageUrl] : []
          },
          unit_amount: Math.round(item.price * 100)
        }
      })),
      ...(deliveryFee
        ? [
            {
              quantity: 1,
              price_data: {
                currency: "inr",
                product_data: {
                  name: "Delivery Fee"
                },
                unit_amount: Math.round(deliveryFee * 100)
              }
            }
          ]
        : [])
    ]
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.status(201).json({ url: session.url });
}));

router.post("/stripe/confirm-session", asyncHandler(async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: "Stripe is not configured on the server" });
  }

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ message: "Stripe session ID is required" });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.metadata?.userId !== req.user._id.toString()) {
    return res.status(403).json({ message: "This payment session does not belong to your account" });
  }

  if (session.payment_status !== "paid" || session.status !== "complete") {
    return res.status(400).json({ message: "Stripe payment is not completed yet" });
  }

  const order = await Order.findOne({
    _id: session.metadata?.orderId,
    user: req.user._id,
    stripeSessionId: session.id
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found for this Stripe session" });
  }

  if (order.paymentStatus === "Paid") {
    return res.json(order);
  }

  const products = await Product.find({
    _id: { $in: order.items.map((item) => item.product) }
  });

  const productMap = products.reduce((acc, product) => {
    acc[product._id.toString()] = product;
    return acc;
  }, {});

  const insufficientItem = order.items.find((item) => (productMap[item.product.toString()]?.stock || 0) < item.quantity);

  if (insufficientItem) {
    const paymentIntentId = getStripePaymentIntentId(session);

    if (paymentIntentId) {
      await refundStripePayment(stripe, paymentIntentId);
      order.paymentStatus = "Refunded";
      order.stripePaymentIntentId = paymentIntentId;
    } else {
      order.paymentStatus = "Failed";
    }

    order.status = "Cancelled";
    await order.save();
    return res.status(409).json({
      message: `${insufficientItem.name} is no longer available in the required quantity. Your Stripe payment was reversed.`
    });
  }

  await reduceOrderStock(order);

  order.paymentStatus = "Paid";
  order.stripePaymentIntentId = getStripePaymentIntentId(session);
  await order.save();

  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.json(order);
}));

router.patch("/:id/cancel", asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.paymentMethod === "Stripe" && order.paymentStatus !== "Paid") {
    return res.status(400).json({ message: "Only paid Stripe orders can be cancelled here" });
  }

  if (order.status === "Cancelled") {
    return res.status(400).json({ message: "Order is already cancelled" });
  }

  if (!canCancelOrder(order.status)) {
    return res.status(400).json({ message: "This order can no longer be cancelled" });
  }

  if (order.paymentMethod === "Stripe") {
    await refundStripePayment(stripe, order.stripePaymentIntentId, "requested_by_customer");
    order.paymentStatus = "Refunded";
  }

  await restoreOrderStock(order);
  order.status = "Cancelled";
  await order.save();

  res.json({
    message: `Order ${order.orderNumber} cancelled successfully`,
    order
  });
}));

export default router;
