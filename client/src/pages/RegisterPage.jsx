import { Button, TextField, Typography, Box, Container } from "@mui/material/";
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
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="h6">Create Your Account</Typography>
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
          <TextField inputRef={nameRef} label="Name" name="name" />
          <TextField inputRef={emailRef} label="Email" name="email" />
          <TextField
            inputRef={passwordRef}
            label="Password"
            name="password"
            type="password"
          />
          <Button onClick={onSubmit} variant="contained">
            Register
          </Button>
          {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
