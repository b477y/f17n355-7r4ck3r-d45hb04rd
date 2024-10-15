import { Button, Typography, Box, Container } from "@mui/material/";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext"; // Import Auth Context
import BASE_URL from "../constants/baseUrl";

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Access the logout function

  const handleLogout = async () => {
    try {
      // Send a request to the backend to clear the cookie
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include", // Important to include cookies in the request
      });

      if (response.ok) {
        logout(); // Clear the auth state on the frontend
        navigate("/login"); // Redirect to the login page
      } else {
        console.error("Failed to log out.");
      }
    } catch (err) {
      console.error("An error occurred during logout:", err);
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
        <Typography variant="h4">Welcome to Home Page</Typography>
        <Button variant="contained" onClick={handleLogout} sx={{ mt: 4 }}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
