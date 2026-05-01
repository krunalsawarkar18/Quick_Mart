import express from "express";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=1800");

  const categories = await Category.find({}).sort({ name: 1 }).lean();
  res.json(categories);
}));

export default router;
