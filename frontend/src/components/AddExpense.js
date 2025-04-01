import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createExpense } from "../redux/expenseSlice";
import {
    Button,
    TextField,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    FormControl,
    FormControlLabel,
    Checkbox,
    Box,
} from "@mui/material";

const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

const AddExpense = () => {
    const dispatch = useDispatch();
    
    // Form State
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
    const [recurring, setRecurring] = useState(false);
    const [frequency, setFrequency] = useState("monthly");
    
    // Modal State
    const [open, setOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createExpense({ 
            title, 
            amount: Number(amount), 
            category, 
            date, 
            recurring, 
            frequency: recurring ? frequency : null 
        }));
        
        // Reset form fields
        setTitle("");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]); 
        setRecurring(false);
        setFrequency("monthly");
        setOpen(false);
    };

    return (
        <Box display="flex" justifyContent="center" mt={2}>
            {/* Open Modal Button */}
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                + Add Expense
            </Button>

            {/* Expense Form Modal */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogContent>
                    {/* Expense Title */}
                    <TextField
                        label="Expense Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        margin="dense"
                        required
                    />

                    {/* Amount */}
                    <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        margin="dense"
                        required
                    />

                    {/* Category Dropdown */}
                    <FormControl fullWidth margin="dense">
    <InputLabel id="category-label">Category</InputLabel>
    <Select
        labelId="category-label"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
    >
        {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
    </Select>
</FormControl>

                    {/* Date Picker */}
                    <TextField
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    {/* Recurring Expense Checkbox */}
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={recurring} 
                                onChange={() => setRecurring(!recurring)}
                            />
                        }
                        label="Recurring Expense"
                    />

                    {/* Frequency Dropdown (only shows when recurring is enabled) */}
                    {recurring && (
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Frequency</InputLabel>
                            <Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="yearly">Yearly</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>

                {/* Buttons */}
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Add Expense
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddExpense;
