import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ExpenseTrendChart = ({ expenses }) => {
    // ✅ Sort expenses by date
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

    // ✅ Group expenses by date
    const expenseData = sortedExpenses.reduce((acc, expense) => {
        const date = dayjs(expense.date).format("YYYY-MM-DD"); // Format date
        acc[date] = (acc[date] || 0) + expense.amount;
        return acc;
    }, {});

    const labels = Object.keys(expenseData); // X-axis (dates)
    const dataPoints = Object.values(expenseData); // Y-axis (amount spent)

    const data = {
        labels,
        datasets: [
            {
                label: "Expenses Over Time",
                data: dataPoints,
                borderColor: "#36A2EB",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                tension: 0.4, // Smooth line
            },
        ],
    };

    return (
        <div style={{ width: "600px", margin: "auto" }}>
            <h3>Expense Trends</h3>
            <Line data={data} />
        </div>
    );
};

export default ExpenseTrendChart;
