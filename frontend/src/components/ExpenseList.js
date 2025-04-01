import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchExpenses, removeExpense } from "../redux/expenseSlice";
import { useNavigate } from "react-router-dom";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import dayjs from "dayjs";
import ExpenseChart from "./ExpenseChart";
import ExpenseTrendChart from "./ExpenseTrendChart";
import ExpenseCategoryChart from "./ExpenseCategoryChart";
import axios from "axios";
import {
    Box,
    Card,
    Typography,
    Button,
    Select,
    MenuItem,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    LinearProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const categories = ["All", "Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];
const dateRanges = ["All Time", "This Month", "Last Week", "Custom"];

const ExpenseList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { expenses = [], status } = useSelector((state) => state.expenses);
    const [editingExpense, setEditingExpense] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDateRange, setSelectedDateRange] = useState("All Time");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    
    // Budget feature
    const [budget, setBudget] = useState(500);
    const [newBudget, setNewBudget] = useState(""); 
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) setUserName(storedName);

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            dispatch(fetchExpenses());
            fetchBudget();
        }
    }, [dispatch, navigate]);

    const handleDelete = (id) => {
        dispatch(removeExpense(id));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Filtering Logic
    const today = dayjs();
    let startDate, endDate;

    if (selectedDateRange === "This Month") {
        startDate = today.startOf("month");
        endDate = today.endOf("month");
    } else if (selectedDateRange === "Last Week") {
        startDate = today.subtract(7, "days").startOf("day");
        endDate = today.endOf("day");
    } else if (selectedDateRange === "Custom" && customStartDate && customEndDate) {
        startDate = dayjs(customStartDate).startOf("day");
        endDate = dayjs(customEndDate).endOf("day");
    }

    const fetchBudget = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get("http://localhost:5000/api/user/budget", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setBudget(res.data.budget);
        } catch (error) {
            console.error("Error fetching budget:", error);
        }
    };

    const handleBudgetUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await axios.post(
                "http://localhost:5000/api/user/budget",
                { budget: Number(newBudget) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBudget(Number(newBudget));
            setNewBudget("");
        } catch (error) {
            console.error("Error updating budget:", error);
        }
    };  

    const filteredExpenses = expenses.filter(expense => {
        const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory;
        const matchesDate = !startDate || !endDate || (dayjs(expense.createdAt).isAfter(startDate) && dayjs(expense.createdAt).isBefore(endDate));
        return matchesCategory && matchesDate;
    });

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <Box sx={{ maxWidth: "800px", margin: "auto", p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                {userName && (
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        👋 Hello, {userName}!
                    </Typography>
                )}
                <Typography variant="h5">ExpenseTracker</Typography>
                 <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
                    Logout
                </Button>
            </Box>

           
                {/* Add Expense */}
                <AddExpense />
                <Button variant="contained" startIcon={<CalendarMonthIcon />} sx={{ mt: 2 }} onClick={() => navigate("/calendar")}>
                    Calendar
                </Button>

            {/* Budget Section */}
            <Card sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Set Monthly Budget:</Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}>
                    <TextField
                        type="number"
                        label="Enter Budget"
                        variant="outlined"
                        size="small"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleBudgetUpdate}>Update</Button>
                </Box>

                {/* Budget Warning */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                        Total Spent: ₹{totalAmount.toFixed(2)} / ₹{budget}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={(totalAmount / budget) * 100}
                        color={totalAmount > budget ? "error" : "primary"}
                    />
                    {totalAmount > budget && <Typography color="error">⚠️ Over Budget!</Typography>}
                </Box>
            </Card>

            {/* Filters */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                </Select>

                <Select value={selectedDateRange} onChange={(e) => setSelectedDateRange(e.target.value)}>
                    {dateRanges.map((range) => (
                        <MenuItem key={range} value={range}>{range}</MenuItem>
                    ))}
                </Select>

                {selectedDateRange === "Custom" && (
                    <>
                        <TextField type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
                        <TextField type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
                    </>
                )}
            </Box>

            {/* Expenses Table */}
            <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredExpenses.map((expense) => (
                            <TableRow key={expense._id}>
                                <TableCell>{expense.title}</TableCell>
                                <TableCell>₹{expense.amount}</TableCell>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell>{dayjs(expense.date).format("YYYY-MM-DD")}</TableCell>

                                <TableCell>
                                    <IconButton onClick={() => setEditingExpense(expense)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(expense._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Form */}
            {editingExpense && <EditExpense expense={editingExpense} onClose={() => setEditingExpense(null)} />}

            {/* Charts */}
            <ExpenseChart expenses={filteredExpenses} />
            <ExpenseTrendChart expenses={filteredExpenses} />
            <ExpenseCategoryChart expenses={filteredExpenses} />
        </Box>
    );
};

export default ExpenseList;
