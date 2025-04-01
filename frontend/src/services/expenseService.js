import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses";

const getAuthHeader = () => {
  return { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
};

export const getExpenses = async () => {
  const res = await axios.get(API_URL, getAuthHeader());
  return res.data;
};

export const addExpense = async (expense) => {
  const res = await axios.post(API_URL, expense, getAuthHeader());
  return res.data;
};

export const updateExpense = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedData, getAuthHeader());
  return res.data;
};

export const deleteExpense = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeader());
};


export const getMonthlySummary = async (month, year) => {
  const res = await axios.get(`http://localhost:5000/api/expenses/summary?month=${month}&year=${year}`, getAuthHeader());
  return res.data;
};
