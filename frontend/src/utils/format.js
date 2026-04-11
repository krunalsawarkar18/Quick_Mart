export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export const getDiscount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) {
    return 0;
  }

  return Math.round(((price - discountPrice) / price) * 100);
};

export const getSavingsAmount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) {
    return 0;
  }

  return price - discountPrice;
};

export const getProductPrice = (product) => product.discountPrice || product.price;

export const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

export const formatDateTime = (dateValue) =>
  new Date(dateValue).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

const PRODUCE_CATEGORIES = new Set(["fresh fruits", "vegetables"]);

export const isProduceProduct = (product) => {
  const categoryName =
    product?.category?.name ||
    product?.categoryName ||
    product?.category ||
    "";

  return PRODUCE_CATEGORIES.has(String(categoryName).trim().toLowerCase());
};

export const formatProductQuantity = (product, quantity) =>
  isProduceProduct(product) ? `${quantity} kg` : String(quantity);
