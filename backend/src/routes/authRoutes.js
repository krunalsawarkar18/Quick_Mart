import express from "express";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

const formatAuthResponse = (user) => ({
  token: generateToken(user._id),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  }
});

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password, phone });
  await Cart.create({ user: user._id, items: [] });

  res.status(201).json(formatAuthResponse(user));
}));

router.post("/admin/register", asyncHandler(async (req, res) => {
  const { name, email, password, phone, adminKey } = req.body;

  if (!name || !email || !password || !adminKey) {
    return res.status(400).json({ message: "Name, email, password, and admin key are required" });
  }

  if (!process.env.ADMIN_SIGNUP_KEY) {
    return res.status(403).json({ message: "Admin signup is disabled until ADMIN_SIGNUP_KEY is configured" });
  }

  if (adminKey !== process.env.ADMIN_SIGNUP_KEY) {
    return res.status(403).json({ message: "Invalid admin signup key" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password, phone, role: "admin" });
  await Cart.create({ user: user._id, items: [] });

  res.status(201).json(formatAuthResponse(user));
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json(formatAuthResponse(user));
}));

router.get("/me", protect, asyncHandler(async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role
    }
  });
}));

router.put("/me", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.json({
    message: "Profile updated",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
}));

export default router;
