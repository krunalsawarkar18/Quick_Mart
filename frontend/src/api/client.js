const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const buildHeaders = (token, extraHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (path, options = {}, token) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: buildHeaders(token, options.headers)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export default API_URL;

