import Product from "../models/Product.js";

export const cancellableStatuses = ["Pending", "Confirmed", "Packed"];
export const visibleOrderFilter = {
  $or: [{ paymentMethod: { $ne: "Stripe" } }, { paymentStatus: "Paid" }]
};

export const canCancelOrder = (status) => cancellableStatuses.includes(status);
export const generateOrderNumber = () => `QM-${Date.now().toString().slice(-8)}`;

export const restoreOrderStock = async (order) => {
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      })
    )
  );
};
