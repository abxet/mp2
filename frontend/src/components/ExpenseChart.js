import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
    // ✅ Group expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                label: "Total Spent",
                data: Object.values(categoryTotals),
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800", "#9C27B0"
                ],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div style={{ width: "400px", margin: "auto" }}>
            <h3>Expense Breakdown</h3>
            <Pie data={chartData} />
        </div>
    );
};

export default ExpenseChart;
