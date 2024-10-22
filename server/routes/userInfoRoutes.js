import express from 'express';
import { createUserInfo, getUserInfo, updateUserInfo, uploadUserImage, resizeImage } from '../controllers/userInfoController.js';

const router = express.Router();

// UserInfo routes
router.post('/', uploadUserImage, resizeImage,createUserInfo); // Create UserInfo
router.get('/:userId', getUserInfo); // Fetch UserInfo by user ID
router.put('/:userId', updateUserInfo); // Update UserInfo by user ID

export default router;
