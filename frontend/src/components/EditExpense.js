import { useState } from "react";
import { useDispatch } from "react-redux";
import { editExpense } from "../redux/expenseSlice";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem } from "@mui/material";

const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

const EditExpense = ({ expense, onClose }) => {
    const [title, setTitle] = useState(expense.title);
    const [amount, setAmount] = useState(expense.amount);
    const [category, setCategory] = useState(expense.category);
    const dispatch = useDispatch();

    const handleUpdate = (e) => {
        e.preventDefault();
        dispatch(editExpense({ id: expense._id, updatedData: { title, amount, category } }));
        onClose(); // Close edit form
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogContent>
                <TextField
                    label="Title"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    sx={{ my: 1 }}
                />
                <TextField
                    label="Amount"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    sx={{ my: 1 }}
                />
                <TextField
                    select
                    label="Category"
                    fullWidth
                    variant="outlined"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{ my: 1 }}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditExpense;
