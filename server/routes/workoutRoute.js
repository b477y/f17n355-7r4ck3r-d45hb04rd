import express from 'express';
import { createWorkout, deleteWorkout, getAllWorkouts, updateWorkout, addWorkoutForUser, getUserWorkouts, deleteUserWorkout } from '../controllers/workoutController.js';
import { allowedTo } from '../controllers/userController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// UserInfo routes
router.post('/create', protect, allowedTo('admin'), createWorkout);
router.delete('/delete/:workoutId', protect, allowedTo('admin'), deleteWorkout);
router.get('/getAll', protect, allowedTo('admin'), getAllWorkouts);
router.put('/update/:workoutId', protect, allowedTo('admin'), updateWorkout);
router.post('/:workoutId', protect, allowedTo('user'), addWorkoutForUser);
router.get('/:userId',protect, allowedTo('user') ,getUserWorkouts);
router.delete('/:userId', protect, allowedTo('user', 'admin'), deleteUserWorkout);

export default router;