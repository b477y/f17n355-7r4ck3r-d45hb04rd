import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  Alert,
  Paper,
} from "@mui/material";
import BASE_URL from "../constants/baseUrl";

const ExerciseForm = () => {
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddExercise = (e) => {
    e.preventDefault();

    if (!exerciseName || !caloriesBurned) {
      setError("Please fill in all fields.");
      return;
    }

    const calories = Number(caloriesBurned);
    if (calories <= 0) {
      setError("Calories burned must be a positive number.");
      return;
    }

    const newExercise = {
      name: exerciseName,
      caloriesBurned: calories,
    };

    setExercises((prev) => [...prev, newExercise]);
    resetForm();
    setSuccessMessage(`Added ${exerciseName} - ${calories} calories`);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const resetForm = () => {
    setExerciseName("");
    setCaloriesBurned("");
    setError("");
  };

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Assuming you store the user ID in local storage

  const handleSubmitWorkout = async () => {
    if (exercises.length === 0) {
      setError("No exercises to save.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/workout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        },
        body: JSON.stringify({ exercises, user: userId }), // Send the user ID as well
        credentials: "include", // include cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating workout");
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setExercises([]); // Clear the exercises after submission

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate total calories burned
  const totalCaloriesBurned = exercises.reduce(
    (total, exercise) => total + exercise.caloriesBurned,
    0
  );

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add Exercises
      </Typography>
      <form onSubmit={handleAddExercise}>
        <TextField
          label="Exercise Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          required
        />
        <TextField
          label="Calories Burned"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={caloriesBurned}
          onChange={(e) => setCaloriesBurned(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Add Exercise
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}
      </form>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Added Exercises
      </Typography>
      <List>
        {exercises.map((exercise, index) => (
          <ListItem key={index}>
            {exercise.name} - {exercise.caloriesBurned} calories
          </ListItem>
        ))}
      </List>

      {exercises.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Calories Burned: {totalCaloriesBurned}
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitWorkout}
            sx={{ mt: 2 }}
          >
            Save Workout
          </Button>
        </>
      )}
    </Paper>
  );
};

export default ExerciseForm;
    