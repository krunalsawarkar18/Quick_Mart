import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

const getPopulatedCart = async (userId) =>
  Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name slug price discountPrice stock imageUrl category",
    populate: {
      path: "category",
      select: "name slug"
    }
  });

router.use(protect);

router.get("/", asyncHandler(async (req, res) => {
  let cart = await getPopulatedCart(req.user._id);

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
    cart = await getPopulatedCart(req.user._id);
  }

  res.json(cart);
}));

router.post("/items", asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < 1) {
    return res.status(400).json({ message: "Product is out of stock" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + Number(quantity), product.stock || 99);
  } else {
    cart.items.push({ product: productId, quantity: Math.min(Number(quantity), product.stock) });
  }

  await cart.save();
  res.status(201).json(await getPopulatedCart(req.user._id));
}));

router.put("/items/:productId", asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const cartItem = cart.items.find((item) => item.product.toString() === req.params.productId);

  if (!cartItem) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  const product = await Product.findById(req.params.productId);

  if (!product || product.stock < 1) {
    return res.status(400).json({ message: "Product is unavailable" });
  }

  cartItem.quantity = Math.min(Math.max(1, Number(req.body.quantity || 1)), product.stock);
  await cart.save();

  res.json(await getPopulatedCart(req.user._id));
}));

router.delete("/items/:productId", asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();

  res.json(await getPopulatedCart(req.user._id));
}));

router.delete("/clear", asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = [];
  await cart.save();

  res.json(await getPopulatedCart(req.user._id));
}));

export default router;
