import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ExpenseList from "./components/ExpenseList";
import ProtectedRoute from "./components/ProtectedRoute";
import { startAutoLogout, resetAutoLogout } from "./utils/AutoLogout";
import CalendarView from "./components/CalendarView";


function App() {
    const navigate = useNavigate();

    // Logout function
    const logoutUser = () => {
        alert("Session expired due to inactivity.");
        localStorage.removeItem("token"); //  Clear token
        navigate("/login"); // Redirect to login page
    };

    useEffect(() => {
        startAutoLogout(logoutUser);  // Start auto logout timer
        resetAutoLogout(logoutUser);  // ✅ Reset timer on user activity
    }, []);

    return (

    //     <ThemeProvider theme={theme}>
    //     <CssBaseline /> {/* Ensures consistent styling */}
    //     <App />
    // </ThemeProvider>

        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
                path="/" 
                element={
                    <ProtectedRoute>
                        <ExpenseList />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/calendar" 
                element={
                    <ProtectedRoute>
                        <CalendarView />
                    </ProtectedRoute>
                } 
            />
            
        </Routes>
    );
}

export default App;
