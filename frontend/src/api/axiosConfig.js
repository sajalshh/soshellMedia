// src/api/axiosConfig.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, 
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
