import { Button, TextField, Typography, Box, Container, Link } from "@mui/material/";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import BASE_URL from "../constants/baseUrl";
import { isAuthenticated } from "../utils/auth";

const RegisterPage = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Prevent access to register if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [navigate]);

  const onSubmit = async () => {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    // Validate the form data
    if (!name || !email || !password) {
      setError("Check your data and try again.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Unable to register the user.");
        return;
      }

      if (!data.token) {
        setError("Incorrect token received.");
        return;
      }

      login(data.email, data.token);
      navigate("/health-form"); // Redirect to HealthForm after successful registration
    } catch (err) {
      setError("Error occurred while registering.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: "#f0f4f8", borderRadius: "8px", boxShadow: 3, padding: 4, mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Create Your Account
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
            gap: 2,
            padding: 2,
            border: 1,
            borderColor: "#f5f5f5",
          }}
        >
          <TextField
            inputRef={nameRef}
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 4 }}
          />
          <TextField
            inputRef={emailRef}
            label="Email"
            name="email"
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 4 }}
          />
          <TextField
            inputRef={passwordRef}
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 4 }}
          />
          <Button onClick={onSubmit} variant="contained" sx={{ backgroundColor: "#1a237e", '&:hover': { backgroundColor: "#0d47a1" } }}>
            Register
          </Button>
          {error && <Typography sx={{ color: "red", textAlign: "center" }}>{error}</Typography>}
        </Box>
        <Typography sx={{ mt: 2 }}>
          Already have an account? 
          <Link href="/login" sx={{ ml: 1, color: "#1a237e", fontWeight: 600 }}>Login Now</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
