export const ORDER_STATUS_STEPS = ["Pending", "Confirmed", "Packed", "Out for Delivery", "Delivered"];

export const getOrderStatusIndex = (status) => ORDER_STATUS_STEPS.indexOf(status);

export const getOrderStatusMeta = (status) => {
  switch (status) {
    case "Pending":
      return {
        badgeClass: "bg-amber-100 text-amber-700",
        title: "Order received",
        description: "Your order is placed and waiting for confirmation."
      };
    case "Confirmed":
      return {
        badgeClass: "bg-sky-100 text-sky-700",
        title: "Order confirmed",
        description: "The store has accepted this order and will prepare it shortly."
      };
    case "Packed":
      return {
        badgeClass: "bg-violet-100 text-violet-700",
        title: "Packed and ready",
        description: "Items are packed and queued for dispatch."
      };
    case "Out for Delivery":
      return {
        badgeClass: "bg-brand-mint text-brand-green",
        title: "Out for delivery",
        description: "The delivery partner is on the way with this order."
      };
    case "Delivered":
      return {
        badgeClass: "bg-emerald-100 text-emerald-700",
        title: "Delivered",
        description: "This order has been delivered successfully."
      };
    case "Cancelled":
      return {
        badgeClass: "bg-rose-100 text-rose-700",
        title: "Order cancelled",
        description: "This order was cancelled and will not be delivered."
      };
    default:
      return {
        badgeClass: "bg-slate-200 text-slate-700",
        title: status || "Status updated",
        description: "Delivery progress has been updated."
      };
  }
};
