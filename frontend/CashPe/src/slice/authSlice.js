import { createSlice } from "@reduxjs/toolkit";

// Retrieve initial state from localStorage
const storedUser = localStorage.getItem("user");
const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
const token = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!token, // Set isAuthenticated based on whether a token exists
    user: user,
    token: token,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;