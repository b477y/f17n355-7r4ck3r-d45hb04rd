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

router.post("/create", protect, allowedTo("user"), createWorkout); // Changed allowedTo to 'user'
router.delete("/delete/:workoutId", protect, allowedTo("user"), deleteWorkout); // Changed allowedTo to 'user'
router.get("/getAll", protect, allowedTo("admin"), getAllWorkouts);
router.put("/update/:workoutId", protect, allowedTo("user"), updateWorkout); // Changed allowedTo to 'user'
router.post("/:workoutId", protect, allowedTo("user"), addWorkoutForUser);
router.get("/:userId", protect, allowedTo("user"), getUserWorkouts);
router.delete("/:userId", protect, allowedTo("user"), deleteUserWorkout);
router.put(
  "/complete/:workoutId/:exerciseId",
  protect,
  allowedTo("user"),
  completeExercise
); // New route for completing exercises

export default router;
