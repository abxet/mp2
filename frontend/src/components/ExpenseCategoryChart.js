import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseCategoryChart = ({ expenses }) => {
    // ✅ Group expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals); // X-axis (categories)
    const dataPoints = Object.values(categoryTotals); // Y-axis (amount spent)

    const data = {
        labels,
        datasets: [
            {
                label: "Expenses by Category",
                data: dataPoints,
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
                ],
            },
        ],
    };

    return (
        <div style={{ width: "600px", margin: "auto" }}>
            <h3>Category-wise Expenses</h3>
            <Bar data={data} />
        </div>
    );
};

export default ExpenseCategoryChart;
