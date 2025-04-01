import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = ({ expenses }) => {
    // ✅ Group expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals); // Categories
    const dataPoints = Object.values(categoryTotals); // Amount spent

    const data = {
        labels,
        datasets: [
            {
                label: "Expenses",
                data: dataPoints,
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
                ],
            },
        ],
    };

    return (
        <div style={{ width: "400px", margin: "auto" }}>
            <h3>Expense Distribution</h3>
            <Pie data={data} />
        </div>
    );
};

export default ExpensePieChart;
