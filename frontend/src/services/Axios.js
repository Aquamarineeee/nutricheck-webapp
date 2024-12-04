import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend-zeta-fawn-20.vercel.app/api",
});
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || "";
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export const Axios = instance;
