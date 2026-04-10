import express from "express";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  res.json(categories);
}));

export default router;
