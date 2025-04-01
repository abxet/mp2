import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseSlice"; // Ensure the path is correct

export const store = configureStore({
    reducer: {
        expenses: expenseReducer, // The key should match how you access it in components
    },
});

// No default export, so import it using `{ store }` in other files
