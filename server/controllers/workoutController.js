import User from "../models/userModel.js";
import UserInfo from "../models/userInfo.js";
import Workout from "../models/workoutModel.js";
import ApiError from "../utils/ApiError.js";

// Utility function for sending responses
const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({ message, data });
};

export const createWorkout = async (req, res, next) => {
  try {
    const { exercises } = req.body;
    const user = req.user._id;

    // Validate input
    if (!user || !Array.isArray(exercises) || exercises.length === 0) {
      return sendResponse(
        res,
        400,
        "User ID and a non-empty array of exercises are required."
      );
    }

    const totalCaloriesBurned = exercises.reduce(
      (total, exercise) => total + (exercise.caloriesBurned || 0),
      0
    );

    const newWorkout = new Workout({
      user,
      exercises,
      totalCaloriesBurned,
      date: new Date(),
    });

    // Save the new workout
    const savedWorkout = await newWorkout.save();

    // Update the user document
    await User.findByIdAndUpdate(user, {
      $push: { workouts: savedWorkout._id }, // Add workout ID to user's workouts array
    });

    // Update the UserInfo document (if you have a UserInfo model)
    await UserInfo.findOneAndUpdate(
      { user }, // Find the UserInfo document based on the user ID
      { $inc: { caloriesBurned: totalCaloriesBurned } } // Increment caloriesBurned
    );

    return sendResponse(res, 201, "Workout created successfully", savedWorkout);
  } catch (error) {
    console.error("Error creating workout:", error);
    return next(new ApiError("Server error while creating workout", 500));
  }
};

// User can delete their workout
export const deleteWorkout = async (req, res, next) => {
  const workoutId = req.params.workoutId;

  if (!workoutId) {
    return sendResponse(res, 400, "Workout ID is required.");
  }

  try {
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return sendResponse(res, 404, "Workout not found.");
    }

    await Workout.findByIdAndDelete(workoutId);
    return sendResponse(res, 200, "Workout deleted successfully");
  } catch (error) {
    console.error("Error deleting workout:", error);
    return next(new ApiError("Server error while deleting workout", 500));
  }
};

// Admin can get all workouts
export const getAllWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find()
      .populate("user", "username email")
      .lean();
    return sendResponse(res, 200, "Fetched all workouts", workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return next(new ApiError("Server error while fetching workouts", 500));
  }
};

// User can update their workout
export const updateWorkout = async (req, res, next) => {
  const { workoutId } = req.params;
  const { exercises } = req.body;

  try {
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return sendResponse(res, 404, "Workout not found.");
    }

    if (exercises) {
      workout.exercises = exercises;
      workout.totalCaloriesBurned = exercises.reduce(
        (total, exercise) => total + (exercise.caloriesBurned || 0),
        0
      );
    }

    const updatedWorkout = await workout.save();
    return sendResponse(
      res,
      200,
      "Workout updated successfully",
      updatedWorkout
    );
  } catch (error) {
    console.error("Error updating workout:", error);
    return next(new ApiError("Server error while updating workout", 500));
  }
};

// User can add a workout for themselves
export const addWorkoutForUser = async (req, res, next) => {
  const userId = req.user._id;
  const existingWorkoutId = req.params.workoutId;

  try {
    const existingWorkout = await Workout.findById(existingWorkoutId)
      .populate("user", "name email")
      .lean();

    if (!existingWorkout) {
      return next(new ApiError("Existing workout not found", 404));
    }

    const newWorkout = new Workout({
      user: userId,
      exercises: existingWorkout.exercises,
      date: new Date(),
      totalCaloriesBurned: existingWorkout.totalCaloriesBurned,
    });

    const savedWorkout = await newWorkout.save();
    return sendResponse(res, 201, "Workout added successfully", savedWorkout);
  } catch (error) {
    console.error("Error adding workout:", error);
    return next(new ApiError("Server error while adding workout", 500));
  }
};

// User can get their workouts
export const getUserWorkouts = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const userWithWorkouts = await User.findById(userId)
      .populate("workouts")
      .lean();

    if (!userWithWorkouts) {
      return next(new ApiError("User not found", 404));
    }

    return sendResponse(
      res,
      200,
      "Fetched user workouts",
      userWithWorkouts.workouts
    );
  } catch (error) {
    console.error("Error fetching user workouts:", error);
    return next(new ApiError("Server error while fetching user workouts", 500));
  }
};

// User can delete their specific workout
export const deleteUserWorkout = async (req, res, next) => {
  const userId = req.params.userId;
  const workoutId = req.body.workoutId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);
    if (!deletedWorkout) {
      return next(new ApiError("Workout not found", 404));
    }

    user.workouts = user.workouts.filter(
      (id) => id.toString() !== workoutId.toString()
    );
    await user.save();
    return sendResponse(res, 200, "Workout deleted successfully");
  } catch (error) {
    console.error("Error deleting user workout:", error);
    return next(new ApiError("Server error while deleting user workout", 500));
  }
};

// User can mark an exercise as completed
export const completeExercise = async (req, res, next) => {
  const { workoutId, exerciseId } = req.params;

  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return sendResponse(res, 404, "Workout not found.");
    }

    const exercise = workout.exercises.id(exerciseId);
    if (!exercise) {
      return sendResponse(res, 404, "Exercise not found.");
    }

    exercise.completed = true; // Mark exercise as completed
    await workout.save();

    return sendResponse(res, 200, "Exercise marked as completed", workout);
  } catch (error) {
    console.error("Error completing exercise:", error);
    return next(new ApiError("Server error while completing exercise", 500));
  }
};
