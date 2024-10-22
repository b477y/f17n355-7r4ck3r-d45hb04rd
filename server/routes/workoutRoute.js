import express from 'express';
import { createWorkoutForUser } from '../controllers/workoutController.js';
import { allowedTo } from '../controllers/userController.js';

const router = express.Router();

// UserInfo routes
router.post('/', createWorkoutForUser);

export default router;