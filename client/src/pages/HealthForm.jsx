import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../constants/baseUrl';

const HealthForm = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    waterGoal: '',
    waterDrank: '',
    caloriesBurned: '',
    age: '',
    weight: '',
    height: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // include cookies
      });

      if (response.ok) {
        // Navigate to another page if submission is successful
        navigate('/dashboard');
      } else {
        console.error('Failed to submit data.');
      }
    } catch (err) {
      console.error('An error occurred:', err);
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
            label="Water Goal (liters)"
            name="waterGoal"
            value={formData.waterGoal}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Water Drank (cups)"
            name="waterDrank"
            value={formData.waterDrank}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Calories Burned"
            name="caloriesBurned"
            value={formData.caloriesBurned}
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
