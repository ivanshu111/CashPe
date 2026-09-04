import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../services/api";

// Async Thunk for registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || "Network error. Please try again." }
      );
    }
  }
);

// Retrieve initial state from localStorage
const storedUser = localStorage.getItem("user");
const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
const token = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!token,
    user: user,
    token: token,
    status: "idle", // for async operations
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = "idle";
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // After registration, the user still needs to log in,
        // so we don't change isAuthenticated or user state here.
        // We just reset the status.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;