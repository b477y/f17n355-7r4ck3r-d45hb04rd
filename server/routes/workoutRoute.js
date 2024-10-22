import express from 'express';
import { createWorkoutForUser, getUserWorkouts, deleteUserWorkout } from '../controllers/workoutController.js';
import { allowedTo } from '../controllers/userController.js';

const router = express.Router();

// UserInfo routes
router.post('/:userId', createWorkoutForUser);
router.get('/:userId', getUserWorkouts);
router.delete('/:userId', deleteUserWorkout);

export default router;