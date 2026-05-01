export const readCachedValue = (key, ttlMs) => {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved);

    if (Date.now() - parsed.savedAt > ttlMs) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const writeCachedValue = (key, value) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        value,
        savedAt: Date.now()
      })
    );
  } catch {
    // Ignore storage write failures and continue with in-memory state.
  }
};
