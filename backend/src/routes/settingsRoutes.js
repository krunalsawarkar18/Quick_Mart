import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getDeliverySettings } from "../utils/deliverySettings.js";

const router = express.Router();

router.get(
  "/delivery",
  asyncHandler(async (_req, res) => {
    res.json(await getDeliverySettings());
  })
);

export default router;
