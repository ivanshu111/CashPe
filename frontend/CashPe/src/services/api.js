import axios from "axios";
import store from "../store";

const API_BASE_URL = "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    console.log('Sending token:', token); // Added logging
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

export const getTransactionHistory = async () => {
  try {
    const response = await api.get("/auth/history");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addMoney = async (amount) => {
  try {
    const response = await api.post("/wallet/add-money", { amount });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await api.get("/users/find", { params: query });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const sendMoney = async (toUser, amount, pin) => {
  try {
    const response = await api.post("/wallet/send-money", {
      toUser,
      amount,
      pin,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await api.patch("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Admin API calls
export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllTransactions = async () => {
  try {
    const response = await api.get("/admin/transactions");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}/details`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await api.delete("/users");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

