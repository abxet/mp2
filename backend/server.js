const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const Expense = require("./models/Expense");
const User = require("./models/User"); // ✅ Fix: Import User Model

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Auth Routes
app.use("/api/auth", authRoutes);

// ✅ Fetch Expenses for the Logged-in User
app.get("/api/expenses", authMiddleware, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Add New Expense
app.post("/api/expenses", authMiddleware, async (req, res) => {
    try {
        const { title, amount, category, date, recurring, frequency } = req.body;
        const newExpense = new Expense({
            title,
            amount,
            category,
            date: date ? new Date(date) : new Date(),
            recurring: recurring || false,
            frequency: recurring ? frequency : null,
            user: req.user.id,
        });

        await newExpense.save();
        res.json(newExpense);
    } catch (error) {
        res.status(500).json({ error: "Failed to add expense" });
    }
});

// ✅ Update an Expense
app.put("/api/expenses/:id", authMiddleware, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, amount, category, date },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ error: "Failed to update expense" });
    }
});

// ✅ Delete an Expense
app.delete("/api/expenses/:id", authMiddleware, async (req, res) => {
    try {
        const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete expense" });
    }
});

// ✅ Get Monthly Expense Summary
app.get("/api/expenses/summary", authMiddleware, async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const selectedMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const selectedYear = year ? parseInt(year) : currentDate.getFullYear();

        const startDate = new Date(selectedYear, selectedMonth - 1, 1);
        const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

        const expenses = await Expense.find({
            user: req.user.id,
            date: { $gte: startDate, $lte: endDate },
        });

        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        res.json({ month: selectedMonth, year: selectedYear, totalSpent, expenses });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch monthly summary" });
    }
});

// ✅ Recurring Expenses (Runs Daily at Midnight)
cron.schedule("0 0 * * *", async () => {
    try {
        const today = new Date();
        const recurringExpenses = await Expense.find({ recurring: true });

        for (let exp of recurringExpenses) {
            let nextDate = new Date(exp.date);
            if (exp.frequency === "daily") nextDate.setDate(nextDate.getDate() + 1);
            if (exp.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7);
            if (exp.frequency === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);
            if (exp.frequency === "yearly") nextDate.setFullYear(nextDate.getFullYear() + 1);

            // ✅ Prevent duplicate expenses by checking if one already exists for the new date
            const existingExpense = await Expense.findOne({ user: exp.user, title: exp.title, date: nextDate });
            if (!existingExpense) {
                await Expense.create({
                    title: exp.title,
                    amount: exp.amount,
                    category: exp.category,
                    date: nextDate,
                    recurring: true,
                    frequency: exp.frequency,
                    user: exp.user,
                });
            }
        }
        console.log("✅ Recurring expenses processed successfully.");
    } catch (error) {
        console.error("❌ Error processing recurring expenses:", error);
    }
});

// ✅ Get User Budget
app.get("/api/user/budget", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ budget: user.budget || 500 }); // Default budget to 500 if not set
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ Update User Budget
app.post("/api/user/budget", authMiddleware, async (req, res) => {
    try {
        const { budget } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.budget = budget;
        await user.save();

        res.json({ message: "Budget updated successfully", budget: user.budget });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
