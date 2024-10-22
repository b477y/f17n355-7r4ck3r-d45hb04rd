import User from '../models/userModel.js'
import mongoose from 'mongoose';
import Workout from '../models/workoutModel.js';

// Create a new workout for an existing user
export const createWorkoutForUser = async (req, res) => {
    const userId = req.params.userId;
    const workoutData = req.body.workoutData;
    try {
    const user = await User.findById(userId);
    if (!user) {
        return { message: "User not found" };
        }    
        
    const newWorkout = new Workout({
        user: user._id, 
        exercises: workoutData.exercises,
    });
        
    await newWorkout.save();

    user.workouts.push(newWorkout._id);
    await user.save();

    return res.status(201).json({ message: "Workout created successfully" });

    return newWorkout;
    } catch (error) {
        return next(new ApiError(`Error creating workout: ${error}`, 400))
    }
}


export const getUserWorkouts = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const userWithWorkouts = await User.findById(userId)
            .populate('workouts') // Populates the workouts field with workout documents
            .exec();
        
        return res.json(userWithWorkouts.workouts);
    } catch (error) {
        return next(new ApiError(`Error fetching user workouts: ${error}`, 400))
    }
}




export const deleteUserWorkout = async (req, res, next) => {
    const userId = req.params.userId
    const workoutId = req.body.workoutId

    try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(`User not found`, 400))
    }

    if (!user.workouts.includes(workoutId)) {
        return next(new ApiError(`Workout not associated with this user`, 400))
    }

    // Remove the workout from the database
    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);
    if (!deletedWorkout) {
        return next(new ApiError(`Workout not found`, 400));
    }

    // Remove the workout reference from the user's workouts array
    user.workouts = user.workouts.filter(id => id.toString() !== workoutId.toString());
    await user.save();

    return res.status(201).json({ message: "Workout deleted successfully" });
    } catch (error) {
        return next(new ApiError(`Error deleting workout`, 400));
    }
}





