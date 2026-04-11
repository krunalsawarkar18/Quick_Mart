export const DEFAULT_DELIVERY_SETTINGS = {
  charge: 40,
  freeDeliveryThreshold: 799
};

export const calculateDeliveryFee = (subtotal, itemCount, settings = DEFAULT_DELIVERY_SETTINGS) => {
  if (!itemCount) {
    return 0;
  }

  return subtotal > settings.freeDeliveryThreshold ? 0 : settings.charge;
};
