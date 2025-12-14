import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import notificationReducer from "../slice/notificationSlice";
import categoryReducer from "../slice/categorySlice"; // New
import budgetReducer from "../slice/budgetSlice";     // New
import expenseReducer from "../slice/expenseSlice";    // New

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    categories: categoryReducer, // New
    budget: budgetReducer,       // New
    expenses: expenseReducer,    // New
  },
});

export default store;