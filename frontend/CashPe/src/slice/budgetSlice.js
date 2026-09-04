import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Async Thunks
export const fetchBudget = createAsyncThunk(
    'budget/fetchBudget',
    async ({ year, month }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/budget/${year}/${month}`);
            return response.data;
        } catch (error) {
            // If budget not found, API returns 404, which we want to handle gracefully as no budget set
            if (error.response && error.response.status === 404) {
                return null; // Indicate no budget for this month/year
            }
            return rejectWithValue(error.response?.data || { message: error.message || "Network error" });
        }
    }
);

export const setBudget = createAsyncThunk(
    'budget/setBudget',
    async (budgetData, { rejectWithValue }) => {
        try {
            const response = await api.post('/budget', budgetData);
            return response.data.budget;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message || "Network error" });
        }
    }
);

export const updateBudget = createAsyncThunk(
    'budget/updateBudget',
    async ({ id, budgetData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/budget/${id}`, budgetData);
            return response.data.budget;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message || "Network error" });
        }
    }
);

const budgetSlice = createSlice({
    name: 'budget',
    initialState: {
        currentBudget: null, // Budget for the currently selected month/year
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Budget
            .addCase(fetchBudget.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchBudget.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentBudget = action.payload; // payload can be null if not found
            })
            .addCase(fetchBudget.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Set Budget (also handles update if budget exists via POST endpoint logic)
            .addCase(setBudget.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(setBudget.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentBudget = action.payload;
            })
            .addCase(setBudget.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Update Budget (PUT endpoint)
            .addCase(updateBudget.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateBudget.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentBudget = action.payload;
            })
            .addCase(updateBudget.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default budgetSlice.reducer;
