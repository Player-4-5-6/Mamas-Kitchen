import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn(
    "VITE_API_URL is not set — falling back to localhost, which will not work in production. " +
      "Set VITE_API_URL in your Vercel project's environment variables."
  );
}

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mk_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
