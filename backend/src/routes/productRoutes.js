import express from "express";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/", asyncHandler(async (req, res) => {
  const { category, featured, q } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (featured === "true") {
    filter.featured = true;
  }

  if (q) {
    const safeQuery = escapeRegex(q);
    filter.$or = [
      { name: { $regex: safeQuery, $options: "i" } },
      { description: { $regex: safeQuery, $options: "i" } },
      { tags: { $in: [new RegExp(safeQuery, "i")] } }
    ];
  }

  const products = await Product.find(filter).populate("category", "name slug").sort({ createdAt: -1 });
  res.json(products);
}));

router.get("/:slug", asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const filter = [{ slug }];

  if (slug.match(/^[0-9a-fA-F]{24}$/)) {
    filter.push({ _id: slug });
  }

  const product = await Product.findOne({
    $or: filter
  }).populate("category", "name slug");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
}));

export default router;
