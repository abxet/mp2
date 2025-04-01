import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Box, Card, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

const categoryColors = {
    Food: "red",
    Transport: "blue",
    Shopping: "green",
    Bills: "purple",
    Entertainment: "orange",
    Other: "gray",
};

const CalendarView = () => {
    const { expenses } = useSelector((state) => state.expenses);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const expensesOnDate = expenses.filter(expense =>
        dayjs(expense.date).isSame(dayjs(selectedDate), "day")
    );

    return (
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h4" gutterBottom>Expense Calendar</Typography>
            
            <Card sx={{ p: 2, mb: 3 }}>
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={({ date, view }) => {
                        if (view === "month") {
                            const expensesOnThisDate = expenses.filter(expense =>
                                dayjs(expense.date).isSame(dayjs(date), "day")
                            );

                            return (
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    {expensesOnThisDate.map((expense, index) => (
                                        <div key={index} style={{
                                            width: "8px", height: "8px", borderRadius: "50%",
                                            backgroundColor: categoryColors[expense.category] || "black",
                                            margin: "2px"
                                        }}></div>
                                    ))}
                                </div>
                            );
                        }
                    }}
                />
            </Card>

            <Card sx={{ p: 2, width: "100%", maxWidth: 400 }}>
                <Typography variant="h6">Expenses on {dayjs(selectedDate).format("YYYY-MM-DD")}</Typography>
                <Divider sx={{ my: 1 }} />
                <List>
                    {expensesOnDate.length > 0 ? (
                        expensesOnDate.map(expense => (
                            <ListItem key={expense._id}>
                                <ListItemText
                                    primary={`${expense.title} - $${expense.amount}`}
                                    secondary={expense.category}
                                    sx={{ color: categoryColors[expense.category] || "black" }}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">No expenses on this date.</Typography>
                    )}
                </List>
            </Card>
        </Box>
    );
};

export default CalendarView;
