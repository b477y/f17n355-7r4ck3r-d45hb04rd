import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../constants/baseUrl";

const HealthForm = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    waterGoal: "",
    caloriesToBurn: "",
    age: "",
    weight: "",
    height: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming the token is stored in localStorage
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/api/userinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        },
        body: JSON.stringify(formData), // Send the form data without the token in the body
        credentials: "include", // include cookies
      });

      if (response.ok) {
        // Navigate to another page if submission is successful
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit data:", errorData);
      }
    } catch (err) {
      console.error("An error occurred:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Set Your Health Goals
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Water Goal (cups)"
            name="waterGoal"
            value={formData.waterGoal}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Calories To Burn"
            name="caloriesToBurn"
            value={formData.caloriesToBurn}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Weight (kg)"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Height (cm)"
            name="height"
            value={formData.height}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default HealthForm;
