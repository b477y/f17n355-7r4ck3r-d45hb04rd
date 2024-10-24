import User from "../models/userModel.js";
import mongoose from "mongoose";
import Workout from "../models/workoutModel.js";
import ApiError from "../utils/ApiError.js";

// User can create a workout with exercises
export const createWorkout = async (req, res, next) => {
  try {
    const { exercises } = req.body;
    const user = req.user._id;

    if (
      !user ||
      !exercises ||
      !Array.isArray(exercises) ||
      exercises.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "User ID and exercises are required." });
    }

    const totalCaloriesBurned = exercises.reduce(
      (total, exercise) => total + exercise.caloriesBurned,
      0
    );

    const newWorkout = new Workout({
      user,
      exercises,
      totalCaloriesBurned,
      date: new Date(),
    });

    const savedWorkout = await newWorkout.save();
    return res
      .status(201)
      .json({ message: "Workout created successfully", workout: savedWorkout });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// User can delete their workout
export const deleteWorkout = async (req, res, next) => {
  const workoutId = req.params.workoutId;

  if (!workoutId) {
    return res.status(400).json({ message: "Workout ID is required." });
  }

  try {
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    await Workout.findByIdAndDelete(workoutId);
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    return next(new ApiError(`Error deleting workout`, 400));
  }
};

// Admin can get all workouts
export const getAllWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find().populate("user", "username email");
    res.status(200).json({ workouts });
  } catch (error) {
    return next(new ApiError(`Error fetching workouts: ${error}`, 400));
  }
};

// User can update their workout
export const updateWorkout = async (req, res, next) => {
  const { workoutId } = req.params;
  const { exercises } = req.body;

  try {
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    if (exercises) {
      workout.exercises = exercises;
      workout.totalCaloriesBurned = exercises.reduce(
        (total, exercise) => total + exercise.caloriesBurned,
        0
      );
    }

    const updatedWorkout = await workout.save();
    res
      .status(200)
      .json({
        message: "Workout updated successfully",
        workout: updatedWorkout,
      });
  } catch (error) {
    return next(new ApiError(`Error updating workout: ${error}`, 400));
  }
};

// User can add a workout for themselves
export const addWorkoutForUser = async (req, res, next) => {
  const userId = req.user._id;
  const existingWorkoutId = req.params.workoutId;

  try {
    const existingWorkout = await Workout.findById(existingWorkoutId).populate(
      "user",
      "name email"
    );
    if (!existingWorkout) {
      return next(new ApiError(`Existing workout not found`, 400));
    }

    const newWorkout = new Workout({
      user: userId,
      exercises: existingWorkout.exercises,
      date: new Date(),
      totalCaloriesBurned: existingWorkout.totalCaloriesBurned,
    });

    const savedWorkout = await newWorkout.save();
    return res.json({
      message: "Workout added successfully",
      workout: savedWorkout,
    });
  } catch (error) {
    return next(new ApiError(`Error adding workout: ${error}`, 400));
  }
};

// User can get their workouts
export const getUserWorkouts = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const userWithWorkouts = await User.findById(userId).populate("workouts");
    return res.json(userWithWorkouts.workouts);
  } catch (error) {
    return next(new ApiError(`Error fetching user workouts: ${error}`, 400));
  }
};

// User can delete their specific workout
export const deleteUserWorkout = async (req, res, next) => {
  const userId = req.params.userId;
  const workoutId = req.body.workoutId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(`User not found`, 400));
    }

    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);
    if (!deletedWorkout) {
      return next(new ApiError(`Workout not found`, 400));
    }

    user.workouts = user.workouts.filter(
      (id) => id.toString() !== workoutId.toString()
    );
    await user.save();
    return res.status(201).json({ message: "Workout deleted successfully" });
  } catch (error) {
    return next(new ApiError(`Error deleting workout`, 400));
  }
};

// User can mark an exercise as completed
export const completeExercise = async (req, res, next) => {
  const { workoutId, exerciseId } = req.params;

  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    const exercise = workout.exercises.id(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found." });
    }

    exercise.completed = true; // Mark exercise as completed
    workout.totalCaloriesBurned += exercise.caloriesBurned; // Update total calories burned
    await workout.save();

    res.status(200).json({ message: "Exercise marked as completed", workout });
  } catch (error) {
    return next(new ApiError(`Error completing exercise: ${error}`, 400));
  }
};
