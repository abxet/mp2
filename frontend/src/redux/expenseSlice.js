import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getExpenses, addExpense, updateExpense, deleteExpense, getMonthlySummary } from "../services/expenseService";

// Async thunks for CRUD operations
export const fetchExpenses = createAsyncThunk("expenses/fetch", async (_, { rejectWithValue }) => {
    try {
        return await getExpenses();
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch expenses");
    }
});

export const createExpense = createAsyncThunk("expenses/create", async (expense, { rejectWithValue }) => {
    try {
        return await addExpense(expense);
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to add expense");
    }
});

export const editExpense = createAsyncThunk("expenses/edit", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        return await updateExpense(id, updatedData);
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update expense");
    }
});

export const removeExpense = createAsyncThunk("expenses/remove", async (id, { rejectWithValue }) => {
    try {
        await deleteExpense(id);
        return id; // Return id to remove it from state
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete expense");
    }
});

export const fetchMonthlySummary = createAsyncThunk(
    "expenses/fetchSummary",
    async ({ month, year }, { rejectWithValue }) => {
        try {
            return await getMonthlySummary(month, year);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch summary");
        }
    }
);

// Expense slice
const expenseSlice = createSlice({
    name: "expenses",
    initialState: { expenses: [], status: "idle", error: null, monthlySummary: {} }, // ✅ Added `monthlySummary`
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => { state.status = "loading"; })
            .addCase(fetchExpenses.fulfilled, (state, action) => { 
                state.status = "succeeded"; 
                state.expenses = action.payload; 
            })
            .addCase(fetchExpenses.rejected, (state, action) => { 
                state.status = "failed"; 
                state.error = action.payload; 
            })

            .addCase(createExpense.fulfilled, (state, action) => { 
                state.expenses.push(action.payload); 
            })
            .addCase(createExpense.rejected, (state, action) => { 
                state.error = action.payload; 
            })

            .addCase(editExpense.fulfilled, (state, action) => {
                const index = state.expenses.findIndex(exp => exp._id === action.payload._id);
                if (index !== -1) {
                    state.expenses[index] = action.payload;
                }
            })
            .addCase(editExpense.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(removeExpense.fulfilled, (state, action) => {
                state.expenses = state.expenses.filter(exp => exp._id !== action.payload);
            })
            .addCase(removeExpense.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(fetchMonthlySummary.fulfilled, (state, action) => {  // ✅ Removed extra dot before `.addCase`
                state.monthlySummary = action.payload;
            });
    }
});

export default expenseSlice.reducer;
