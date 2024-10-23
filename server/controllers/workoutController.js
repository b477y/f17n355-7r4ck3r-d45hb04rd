import User from '../models/userModel.js'
import mongoose from 'mongoose';
import Workout from '../models/workoutModel.js';
import ApiError from '../utils/ApiError.js';


// admin
export const createWorkout = async(req, res, next) => {
    try {
        const exercises = req.body.exercises;
        const user = req.user._id;

        
        if (!user || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
            return res.status(400).json({ message: "User ID and exercises are required." });
        }

        
        const newWorkout = new Workout({
            user,
            exercises,
            date: new Date(), // Set the date to now
        });

        
        const savedWorkout = await newWorkout.save();

        return res.status(201).json({ message: "Workout created successfully", workout: savedWorkout });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
}






// admin
export const  deleteWorkout = async(req, res, next) => {
    const workoutId = req.params.workoutId;

    
    if (!workoutId) {
        return res.status(400).json({ message: "User ID and Workout ID are required." });
    }

    try {
        
        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return res.status(404).json({ message: "Workout not found." });
        }

        
        const deletedWorkout = await Workout.findByIdAndDelete(workoutId);
        res.status(200).json({ message: "Workout deleted successfully", workout: deletedWorkout });
    } catch (error) {
        return next(new ApiError(`Error deleting workout`, 400));
    }
}




// admin 
export const  getAllWorkouts = async(req, res, next) => {
    try {

        const workouts = await Workout.find().populate('user', 'username email'); 
        res.status(200).json({ workouts });

    } catch (error) {
        return next(new ApiError(`Error fetching workout: ${error}`, 400));
    }
}





// (Admin)
export const updateWorkout = async (req, res, next) => {
    const { workoutId } = req.params; 
    const { exercises, date} = req.body; 

    try {
        const workout = await Workout.findById(workoutId);

    
        if (!workout) {
            return res.status(404).json({ message: "Workout not found." });
        }

        
        if (exercises) workout.exercises = exercises;
        if (date) workout.date = Date.now();

        
        const updatedWorkout = await workout.save();
        
        res.status(200).json({ message: "Workout updated successfully", workout: updatedWorkout });
    } catch (error) {
        return next(new ApiError(`Error updating workout: ${error}`, 400));
    }
}



// user
export const addWorkoutForUser = async (req, res, next) => {
    const userId = req.user._id;
    const existingWorkoutId = req.params.workoutId
    try {
    
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(`user not found`, 400));
    }

    
    const existingWorkout = await Workout.findById(existingWorkoutId).populate('user', 'name email'); // Optionally populate user details
    if (!existingWorkout) {
        return next(new ApiError(`existing workout not found`, 400));
    }

    
    const newWorkoutData = {
        user: user._id, 
        exercises: existingWorkout.exercises, 
        date: new Date(), 
    };

    const newWorkout = new Workout(newWorkoutData);
    const savedWorkout = await newWorkout.save();

    
    user.workouts.push(savedWorkout._id);
    await user.save();

    return res.json({ message: "Workout added successfully", workout: savedWorkout});
    } catch (error) {

        return next(new ApiError(`Error adding workout from existing: ${error}`, 400));
    }
}



// user
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





// user
export const deleteUserWorkout = async (req, res, next) => {
    const userId = req.params.userId
    const workoutId = req.body.workoutId

    try {
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(`User not found`, 400))
    }

    if (!user.workouts.includes(workoutId)) {
        return next(new ApiError(`Workout not associated with this user`, 400))
    }

    
    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);
    if (!deletedWorkout) {
        return next(new ApiError(`Workout not found`, 400));
    }

    user.workouts = user.workouts.filter(id => id.toString() !== workoutId.toString());
    await user.save();

    return res.status(201).json({ message: "Workout deleted successfully" });
    } catch (error) {
        return next(new ApiError(`Error deleting workout`, 400));
    }
}





