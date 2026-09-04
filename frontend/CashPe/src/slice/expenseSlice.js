import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../services/api";

// Async Thunks
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/expenses?${query}`);
      return response.data; // Assuming API returns { expenses, totalPages, currentPage, totalItems }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message || "Network error" });
    }
  }
);

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expenseData, { rejectWithValue }) => {
    try {
            const response = await api.post('/expenses', expenseData);
      return response.data.expense; // Assuming API returns { message, expense }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message || "Network error" });
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
                  const response = await api.put(`/expenses/${id}`, expenseData);      return response.data.expense; // Assuming API returns { message, expense }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message || "Network error" });
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id, { rejectWithValue }) => {
    try {
                  await api.delete(`/expenses/${id}`);      return id; // Return the ID of the deleted expense
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message || "Network error" });
    }
  }
);

export const fetchMonthlySummary = createAsyncThunk(
  "expenses/fetchMonthlySummary",
  async ({ year, month }, { rejectWithValue }) => {
    try {
                  const response = await api.get(`/reports/monthly/${year}/${month}`);      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message || "Network error" });
    }
  }
);

export const fetchYearlySummary = createAsyncThunk(
  "expenses/fetchYearlySummary",
  async (year, { rejectWithValue }) => {
    try {
                  const response = await api.get(`/reports/yearly/${year}`);      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message || "Network error" });
    }
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    monthlySummary: null,
    yearlySummary: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    summaryStatus: "idle", // for reports, to separate loading states
    error: null,
  },
  reducers: {
    // You can add synchronous reducers here if needed, e.g., to clear expenses
    clearExpenses: (state) => {
      state.expenses = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload.expenses; // Assuming payload has an expenses array
        // You might also store totalPages, currentPage etc. if your UI needs them
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add Expense
      .addCase(addExpense.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses.unshift(action.payload); // Add new expense to the beginning
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Expense
      .addCase(updateExpense.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.expenses.findIndex(
          (exp) => exp._id === action.payload._id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete Expense
      .addCase(deleteExpense.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = state.expenses.filter(
          (exp) => exp._id !== action.payload
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch Monthly Summary
      .addCase(fetchMonthlySummary.pending, (state) => {
        state.summaryStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.summaryStatus = "succeeded";
        state.monthlySummary = action.payload;
      })
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.summaryStatus = "failed";
        state.error = action.payload;
      })
      // Fetch Yearly Summary
      .addCase(fetchYearlySummary.pending, (state) => {
        state.summaryStatus = "loading";
        state.error = null;
      })
      .addCase(fetchYearlySummary.fulfilled, (state, action) => {
        state.summaryStatus = "succeeded";
        state.yearlySummary = action.payload;
      })
      .addCase(fetchYearlySummary.rejected, (state, action) => {
        state.summaryStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
