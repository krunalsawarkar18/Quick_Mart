import { randomBytes } from "crypto";
import Product from "../models/Product.js";

export const cancellableStatuses = ["Pending", "Confirmed", "Packed"];
export const visibleOrderFilter = {
  $or: [{ paymentMethod: { $ne: "Stripe" } }, { paymentStatus: { $in: ["Paid", "Refunded"] } }]
};

export const canCancelOrder = (status) => cancellableStatuses.includes(status);
export const generateOrderNumber = () => {
  const timestampPart = Date.now().toString().slice(-8);
  const randomPart = randomBytes(3).toString("hex").toUpperCase();
  return `QM-${timestampPart}-${randomPart}`;
};

export const restoreOrderStock = async (order) => {
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      })
    )
  );
};
