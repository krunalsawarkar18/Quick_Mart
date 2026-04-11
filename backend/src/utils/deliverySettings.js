import DeliverySetting from "../models/DeliverySetting.js";

export const DEFAULT_DELIVERY_SETTINGS = {
  charge: 40,
  freeDeliveryThreshold: 799
};

export const calculateDeliveryFee = (itemsPrice, settings = DEFAULT_DELIVERY_SETTINGS) =>
  itemsPrice > settings.freeDeliveryThreshold ? 0 : settings.charge;

export const getDeliverySettings = async () => {
  const settings = await DeliverySetting.findOne({ key: "default" }).lean();

  return {
    ...DEFAULT_DELIVERY_SETTINGS,
    ...(settings
      ? {
          charge: settings.charge,
          freeDeliveryThreshold: settings.freeDeliveryThreshold,
          updatedAt: settings.updatedAt
        }
      : {})
  };
};

export const getOrCreateDeliverySettings = async () => {
  let settings = await DeliverySetting.findOne({ key: "default" });

  if (!settings) {
    settings = await DeliverySetting.create({
      key: "default",
      ...DEFAULT_DELIVERY_SETTINGS
    });
  }

  return settings;
};
