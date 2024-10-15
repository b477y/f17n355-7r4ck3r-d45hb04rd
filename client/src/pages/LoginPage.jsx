<<<<<<< HEAD
import { Button, TextField, Typography, Box, Container, Link } from "@mui/material/";
=======
import { Button, TextField, Typography, Box, Container } from "@mui/material/";
>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import BASE_URL from "../constants/baseUrl";
import { isAuthenticated } from "../utils/auth";

const LoginPage = () => {
  const [error, setError] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Prevent access to login if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [navigate]);

  const onSubmit = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    // Validate the form data
    if (!email || !password) {
      setError("Check submitted data");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Unable to login the user, please try with another credentials");
        return;
      }

      // Check if the token is received from the backend
      if (!data.token) {
        setError("Incorrect token received from the backend.");
        return;
      }

      // Call the login function with email and token, and navigate to the home page
      login(data.email, data.token);
      navigate("/");
    } catch (err) {
      setError("An error occurred while trying to login.");
    }
  };

  return (
<<<<<<< HEAD
    <Container maxWidth="xs" sx={{ backgroundColor: "#f0f4f8", borderRadius: "8px", boxShadow: 3, padding: 4, mt: 8 }}>
=======
    <Container>
>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
<<<<<<< HEAD
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Login To Your Account
        </Typography>
=======
          mt: 2,
        }}
      >
        <Typography variant="h6">Login To Your Account</Typography>
>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
            gap: 2,
<<<<<<< HEAD
          }}
        >
          <TextField
            inputRef={emailRef}
            label="Email"
            name="email"
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 4 }}
          />
=======
            padding: 2,
            border: 1,
            borderColor: "#f5f5f5",
          }}
        >
          <TextField inputRef={emailRef} label="Email" name="email" />
>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765
          <TextField
            inputRef={passwordRef}
            label="Password"
            name="password"
            type="password"
<<<<<<< HEAD
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 4 }}
          />
          <Button onClick={onSubmit} variant="contained" sx={{ backgroundColor: "#1a237e", '&:hover': { backgroundColor: "#0d47a1" } }}>
            Login
          </Button>
          {error && <Typography sx={{ color: "red", textAlign: "center" }}>{error}</Typography>}
        </Box>
        <Typography sx={{ mt: 2 }}>
          Don’t have an account? 
          <Link href="/register" sx={{ ml: 1, color: "#1a237e", fontWeight: 600 }}>Register Now</Link>
        </Typography>
=======
          />
          <Button onClick={onSubmit} variant="contained">
            Login
          </Button>
          {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
        </Box>
>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765
      </Box>
    </Container>
  );
};

export default LoginPage;
