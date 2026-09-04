import axios from "axios";
import store from "../store";
import { logout } from "../slice/authSlice";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

export const api = axios.create({
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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      toast.error("Session expired or unauthorized. Please log in again.");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

const handleError = (error) => {
  if (error.response && error.response.data) {
    throw error.response.data;
  }
  throw { message: error.message || "Network error. Please try again." };
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getWalletDetails = async () => {
  try {
    const response = await api.get("/wallet/details");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getWalletBalanceWithPin = async (pin) => {
  try {
    const response = await api.post("/wallet/balance", { pin });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getTransactionHistory = async () => {
  try {
    const response = await api.get("/auth/history");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const addMoney = async (amount) => {
  try {
    const response = await api.post("/wallet/add-money", { amount });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await api.get("/users/find", { params: query });
    return response.data;
  } catch (error) {
    handleError(error);
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
    handleError(error);
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
    handleError(error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllTransactions = async (
  sortBy = "createdAt",
  sortOrder = "desc"
) => {
  try {
    const response = await api.get("/admin/transactions", {
      params: { sort_by: sortBy, sort_order: sortOrder },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}/details`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await api.delete("/users");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserTransactions = async (
  userId,
  sortBy = "createdAt",
  sortOrder = "desc"
) => {
  try {
    const response = await api.get(`/admin/users/${userId}/transactions`, {
      params: { sort_by: sortBy, sort_order: sortOrder },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
