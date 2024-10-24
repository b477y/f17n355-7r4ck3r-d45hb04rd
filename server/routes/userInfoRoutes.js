import express from "express";
import {
  createUserInfo,
  getUserInfo,
  updateUserInfo,
  uploadUserImage,
  resizeImage,
  getWaterData,
  updateWaterIntake,
  getCaloriesData,
} from "../controllers/userInfoController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// UserInfo routes
// router.post('/', uploadUserImage, resizeImage,createUserInfo); // Create UserInfo
router.post("/", protect, createUserInfo); // Create UserInfo
router.get("/", protect, getUserInfo); // Fetch UserInfo for the authenticated user
router.put("/", protect, updateUserInfo); // Update UserInfo for the authenticated user

// Route to increment water intake by 1 cup
router.put("/increment-cups", protect, (req, res) => {
  req.body.cups = 1; // Automatically set cups to 1 for incrementing
  updateWaterIntake(req, res); // Call the controller function
});

// Route to get water data
router.get("/water-data", protect, getWaterData);

// New route to get burned calories and calorie goal
router.get("/calories-data", protect, getCaloriesData); // New route

export default router;
