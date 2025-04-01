import React, { useEffect, useState } from "react";
import axios from "axios";

const Summary = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [summary, setSummary] = useState(null);
    const [budget, setBudget] = useState(localStorage.getItem("budget") || "");

    useEffect(() => {
        fetchSummary();
    }, [month, year]);

    const fetchSummary = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/expenses/summary?month=${month}&year=${year}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setSummary(res.data);
        } catch (error) {
            console.error("Error fetching summary", error);
        }
    };

    const handleBudgetChange = (e) => {
        setBudget(e.target.value);
        localStorage.setItem("budget", e.target.value);
    };

    return (
        <div>
            <h2>Monthly Summary</h2>
            <label>Month: 
                <input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} />
            </label>
            <label>Year: 
                <input type="number" min="2020" max="2050" value={year} onChange={(e) => setYear(e.target.value)} />
            </label>
            <p>Total Expenses: ${summary?.totalAmount || 0}</p>
            
            <label>Budget: 
                <input type="number" value={budget} onChange={handleBudgetChange} />
            </label>
            {budget && summary?.totalAmount > budget && <p style={{ color: "red" }}>⚠️ You have exceeded your budget!</p>}
        </div>
    );
};

export default Summary;
