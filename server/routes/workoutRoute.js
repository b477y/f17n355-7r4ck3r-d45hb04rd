import express from "express";
import {
  createWorkout,
  deleteWorkout,
  getAllWorkouts,
  updateWorkout,
  addWorkoutForUser,
  getUserWorkouts,
  deleteUserWorkout,
  completeExercise, // New route to mark exercise as completed
} from "../controllers/workoutController.js";
import { allowedTo } from "../controllers/userController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// Change the route from '/create' to '/' for easier access
// router.post("/", protect, allowedTo("user"), createWorkout); // Endpoint to create a workout
router.post("/", protect, createWorkout); // Endpoint to create a workout
router.delete("/:workoutId", protect, allowedTo("user"), deleteWorkout); // Endpoint to delete a workout
router.get("/getAll", protect, allowedTo("admin"), getAllWorkouts); // Endpoint to get all workouts
router.put("/:workoutId", protect, allowedTo("user"), updateWorkout); // Endpoint to update a workout
router.post("/:workoutId", protect, allowedTo("user"), addWorkoutForUser); // Endpoint to add a workout for a user
router.get("/:userId", protect, allowedTo("user"), getUserWorkouts); // Endpoint to get user workouts
router.delete("/:userId", protect, allowedTo("user"), deleteUserWorkout); // Endpoint to delete user workout
router.put(
  "/complete/:workoutId/:exerciseId",
  protect,
  allowedTo("user"),
  completeExercise // New route for completing exercises
);

export default router;
