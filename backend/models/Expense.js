const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
        type: String,
        enum: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"],
        required: true,
    },
    date: { type: Date, required: true },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }, //  Ensure timestamps
    recurring: { type: Boolean, default: false }, //  Recurring expense flag
    frequency: { 
        type: String, 
        enum: ["daily", "weekly", "monthly", "yearly"], 
        default: "monthly" 
    } // Recurring frequency
}, 

{ timestamps: true } // Automatically adds createdAt & updatedAt fields
);

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
