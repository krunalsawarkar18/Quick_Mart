import { apiRequest } from "../api/client.js";
import { DEFAULT_DELIVERY_SETTINGS } from "./delivery.js";
import { readCachedValue, writeCachedValue } from "./storageCache.js";

const DELIVERY_SETTINGS_CACHE_KEY = "quick-market-delivery-settings";
const DELIVERY_SETTINGS_CACHE_TTL_MS = 10 * 60 * 1000;

export const readCachedDeliverySettings = () =>
  readCachedValue(DELIVERY_SETTINGS_CACHE_KEY, DELIVERY_SETTINGS_CACHE_TTL_MS) || DEFAULT_DELIVERY_SETTINGS;

export const loadDeliverySettings = async () => {
  const settings = await apiRequest("/settings/delivery");
  writeCachedValue(DELIVERY_SETTINGS_CACHE_KEY, settings);
  return settings;
};
