import User from '../models/userModel.js'
import mongoose from 'mongoose';
import Workout from '../models/workoutModel.js';

// Create a new workout for an existing user
export const createWorkoutForUser = async (req, res) => {
    const userId = req.body.userId;
    const workoutData = req.body.workoutData;
    try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        return { message: "User not found" };
    }

    // Create the workout
    const newWorkout = new Workout({
        user: user._id, // Associate the workout with the user
        exercises: workoutData.exercises,
    });

    // Save the workout to the database
    await newWorkout.save();

    // Push the workout ID into the user's workouts array
    user.workouts.push(newWorkout._id);
    await user.save();

    return res.status(201).json({ message: "Workout created successfully" });
        
        

    return newWorkout;
    } catch (error) {
    console.error('Error creating workout:', error);
    }
}
