import axios from "axios";
import store from "../store";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWalletDetails = async () => {
  try {
    const response = await api.get("/wallet/details");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWalletBalanceWithPin = async (pin) => {
  try {
    const response = await api.post("/wallet/balance", { pin });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
