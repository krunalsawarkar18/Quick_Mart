import express from "express";
import Address from "../models/Address.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

const ensureCustomerAccess = (req, res, next) => {
  if (req.user?.role === "admin") {
    return res.status(403).json({ message: "Admin accounts cannot use customer address features" });
  }

  next();
};

router.use(protect);
router.use(ensureCustomerAccess);

router.get("/", asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.json(addresses);
}));

router.post("/", asyncHandler(async (req, res) => {
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const address = await Address.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json(address);
}));

router.put("/:id", asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  Object.assign(address, req.body);
  await address.save();

  res.json(address);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  res.json({ message: "Address removed" });
}));

export default router;
