import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Alert } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });

            const { token, user } = res.data;
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userName", user.name); // Store name
            navigate("/"); // Redirect after login
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <Box 
            sx={{ 
                height: "100vh", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                backgroundColor: "#f4f4f4" // Subtle background
            }}
        >
            <Paper 
                elevation={6} 
                sx={{ 
                    padding: 4, 
                    borderRadius: 3, 
                    width: 350, 
                    textAlign: "center" 
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        type="submit" 
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    Don't have an account? 
                    <Button 
                        onClick={() => navigate("/register")} 
                        sx={{ textTransform: "none" }}
                    >
                        Sign Up
                    </Button>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Login;
